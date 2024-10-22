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
                max_tokens: 500  // Adjust as needed
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.choices[0]?.message?.content || "No text generated.";

        // Display the generated text immediately
        responseElement.textContent = generatedText;
    } catch (error) {
        console.error("There was an error with the API call:", error);
        responseElement.textContent = "An error occurred while generating the text.";
    }
}