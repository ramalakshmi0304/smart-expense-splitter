export const predictCategory = async (description) => {
  try {
    // Replace this with your actual API endpoint or direct LLM call
    const response = await fetch('/api/ai/categorize', {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
    const data = await response.json();
    return data.category; // e.g., "Food", "Travel", "Bills"
  } catch (error) {
    return "General"; // Fallback
  }
};