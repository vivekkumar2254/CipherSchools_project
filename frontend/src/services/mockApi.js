const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    return {
      success: false,
      error: data.error || 'An error occurred'
    };
  }
  
  return data;
};

export const mockApi = {
  async getAssignments() {
    try {
      const response = await fetch(`${API_URL}/assignments`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return {
        success: false,
        error: 'Failed to connect to server. Make sure the backend is running on port 3000.'
      };
    }
  },

  async getAssignment(id) {
    try {
      const response = await fetch(`${API_URL}/assignments/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      return {
        success: false,
        error: 'Failed to connect to server'
      };
    }
  },

  async executeQuery(assignmentId, query) {
    try {
      const response = await fetch(`${API_URL}/query/execute`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          assignmentId, 
          query 
        })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error executing query:', error);
      return {
        success: false,
        error: 'Failed to execute query. Make sure the backend is running.'
      };
    }
  },

  async getHint(assignmentId, userQuery) {
    try {
      const response = await fetch(`${API_URL}/query/hint/${assignmentId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          query: userQuery 
        })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error getting hint:', error);
      return {
        success: false,
        error: 'Failed to get hint'
      };
    }
  }
};
