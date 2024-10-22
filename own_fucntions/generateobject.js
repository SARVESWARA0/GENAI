// Schema structure (for reference and validation)
const schemaStructure = {
    response: {
      message: "string",
      suggestions: ["string"],
      metadata: {
        confidence: "number",
        category: "string"
      }
    }
  };
  
  // Function to validate response against our schema
  function validateResponse(response) {
    if (typeof response.message !== 'string') {
      throw new Error('Invalid message type');
    }
    
    if (response.suggestions !== undefined && !Array.isArray(response.suggestions)) {
      throw new Error('Invalid suggestions type');
    }
    
    if (response.metadata !== undefined) {
      if (typeof response.metadata !== 'object' || response.metadata === null) {
        throw new Error('Invalid metadata structure');
      }
      if (typeof response.metadata.confidence !== 'number' || 
          response.metadata.confidence < 0 || 
          response.metadata.confidence > 1) {
        throw new Error('Invalid confidence value');
      }
      if (typeof response.metadata.category !== 'string') {
        throw new Error('Invalid category type');
      }
    }
    
    return response;
  }
  
  // Function to generate text based on the user's prompt
  async function generateText() {
      const promptElement = document.getElementById('prompt');
      const responseElement = document.getElementById('response');
      const prompt = promptElement.value.trim();
  
      if (!prompt) {
          alert('Please enter a prompt.');
          return;
      }
  
      responseElement.textContent = 'Generating...';
  
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
                  ],
                  max_tokens: 500
              })
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          
          // Structure the API response according to our schema
          const structuredResponse = {
              message: data.choices[0]?.message?.content || "No text generated.",
              suggestions: ["Follow-up question", "Ask for clarification", "Request an example"],
              metadata: {
                  confidence: 0.85,  // Example confidence score
                  category: "general"  // Example category
              }
          };
  
          // Validate the structured response
          const validatedResponse = validateResponse(structuredResponse);
  
          // Display the structured and validated response
          responseElement.textContent = JSON.stringify(validatedResponse, null, 2);
      } catch (error) {
          console.error("There was an error:", error);
          responseElement.textContent = "An error occurred while generating the text.";
      }
  }
  
  // Make generateText available globally
  window.generateText = generateText;