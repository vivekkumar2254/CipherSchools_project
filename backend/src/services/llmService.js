export const generateHint = async (assignment, userQuery) => {
  if (!assignment.hints || assignment.hints.length === 0) {
    return {
      success: false,
      error: 'No hints available for this assignment'
    };
  }

  const randomIndex = Math.floor(Math.random() * assignment.hints.length);
  const hint = assignment.hints[randomIndex];

  return {
    success: true,
    data: {
      hint,
      message: 'Try to solve it yourself first! This hint should guide your thinking.'
    }
  };
};
