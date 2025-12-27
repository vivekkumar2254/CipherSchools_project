import { pgPool } from '../config/database.js';
import Attempt from '../models/Attempt.js';
import Assignment from '../models/Assignment.js';

const DANGEROUS_KEYWORDS = [
  'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'TRUNCATE',
  'CREATE', 'REPLACE', 'GRANT', 'REVOKE', 'EXECUTE', 'EXEC'
];

const validateQuery = (query) => {
  const upperQuery = query.toUpperCase().trim();
  
  for (const keyword of DANGEROUS_KEYWORDS) {
    if (upperQuery.includes(keyword)) {
      return {
        valid: false,
        error: `Query contains forbidden operation: ${keyword}. Only SELECT queries are allowed.`
      };
    }
  }

  if (!upperQuery.startsWith('SELECT')) {
    return {
      valid: false,
      error: 'Only SELECT queries are allowed'
    };
  }

  if (upperQuery.includes('--') || upperQuery.includes('/*')) {
    return {
      valid: false,
      error: 'SQL comments are not allowed'
    };
  }

  const semicolonCount = (query.match(/;/g) || []).length;
  if (semicolonCount > 1) {
    return {
      valid: false,
      error: 'Multiple SQL statements are not allowed'
    };
  }

  return { valid: true };
};

export const executeQuery = async (query, assignmentId, userId = null) => {
  const startTime = Date.now();
  
  const validation = validateQuery(query);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error
    };
  }

  let client;
  try {
    client = await pgPool.connect();
  } catch (connectionError) {
    return {
      success: false,
      error: 'PostgreSQL database is not connected. Please install PostgreSQL to execute queries.'
    };
  }

  try {
    await client.query(`SET statement_timeout = ${process.env.QUERY_TIMEOUT_MS || 5000}`);
    
    const limitedQuery = query.trim().endsWith(';') 
      ? query.trim().slice(0, -1) 
      : query.trim();
    
    const maxRows = parseInt(process.env.MAX_RESULT_ROWS) || 1000;
    const finalQuery = `${limitedQuery} LIMIT ${maxRows}`;
    
    const result = await client.query(finalQuery);
    const executionTime = Date.now() - startTime;

    const assignment = await Assignment.findById(assignmentId);
    let isCorrect = false;
    let expectedResult = null;
    let expectedColumns = null;

    if (assignment && assignment.expectedQuery) {
      try {
        const expectedQueryResult = await client.query(assignment.expectedQuery);
        expectedResult = expectedQueryResult.rows;
        expectedColumns = expectedQueryResult.fields.map(f => f.name);
        
        const userColumns = result.fields.map(f => f.name);
        const columnsMatch = JSON.stringify(userColumns) === JSON.stringify(expectedColumns);
        const dataMatches = JSON.stringify(result.rows) === JSON.stringify(expectedQueryResult.rows);
        
        isCorrect = columnsMatch && dataMatches;
      } catch (expectedError) {
        // Error executing expected query
      }
    }

    try {
      const attempt = await Attempt.create({
        assignmentId,
        userId,
        query: query,
        success: true,
        executionTime,
        rowCount: result.rowCount,
        isCorrect
      });
    } catch (mongoError) {
      // Failed to save attempt to MongoDB
    }

    return {
      success: true,
      data: {
        rows: result.rows,
        columns: result.fields.map(f => f.name),
        rowCount: result.rowCount,
        executionTime,
        isCorrect,
        expectedResult,
        expectedColumns,
        message: isCorrect ? 'Correct! Your query produces the expected result.' : 'Query executed successfully, but the result doesn\'t match the expected output.'
      }
    };

  } catch (error) {
    const executionTime = Date.now() - startTime;

    try {
      await Attempt.create({
        assignmentId,
        userId,
        query: query,
        success: false,
        errorMessage: error.message,
        executionTime
      });
    } catch (mongoError) {
      // Failed to save attempt to MongoDB
    }

    return {
      success: false,
      error: error.message
    };

  } finally {
    if (client) {
      client.release();
    }
  }
};

export const testConnection = async () => {
  try {
    const result = await pgPool.query('SELECT 1 as test');
    return { success: true, data: result.rows };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
