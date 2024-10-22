// Custom function to stream text output into HTML element
async function streamtext(textChunks) {
  const responseDiv = document.getElementById("response");
  responseDiv.innerHTML = ''; // Clear previous content
  
  // Stream each chunk to the response div
  for (const chunk of textChunks) {
    responseDiv.innerHTML += chunk;
    await delay(10); // Add a slight delay to simulate streaming
  }
}

// Simulate a delay function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Main function to handle API call and stream response
async function generateText() {
  const promptElement = document.getElementById('prompt');
  const prompt = promptElement.value.trim();
  
  if (!prompt) {
    alert('Please enter a prompt.');
    return;
  }
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const fullResponse = data.choices[0]?.message?.content || "";
    
    // Break the response into smaller chunks for streaming
    const responseChunks = chunkText(fullResponse, 5); // Chunking with size of 5 characters
    
    // Stream the chunks in real-time to the HTML element
    await streamtext(responseChunks);
  } catch (error) {
    console.error("There was an error with the API call:", error);
    document.getElementById("response").innerHTML = "An error occurred while fetching the response.";
  }
}

// Helper function to chunk the text into smaller parts
function chunkText(text, size) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

// Make generateText function globally available
window.generateText = generateText;