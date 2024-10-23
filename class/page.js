const Ai = require("./functions");
const { z } = require("zod");


function initializeAi() {
  const api_key = "AIzaSyC2t7S8OSjkb3tH3zILnHdh0EnCJcF2CqE";
  const system_prompt = "You are a chatbot to help the user.";
  return new Ai("google", api_key, system_prompt);
}

const cal = initializeAi();


async function generateText(prompt) {
  try {
    const result = await cal.generate({
      type: "text",
      stream: false, 
      model_name: "gemini-1.5-flash",
      prompt: [{ role: "user", content: prompt }],
    });
    console.log(result.text); 
  } catch (error) {
    console.error("Error generating text:", error);
  }
}


async function streamText(prompt) {
  try {
    const result = await cal.generate({
      type: "text",
      stream: true, 
      model_name: "gemini-1.5-flash",
      prompt: [{ role: "user", content: prompt }],
    });

    for await (const chunk of result) {
      console.log(chunk);  
    }
  } catch (error) {
    console.error("Error streaming text:", error);
  }
}


async function generateObject(prompt) {
    try {
      const result = await cal.generate({
        type: "object",
        stream: false, 
        model_name: "gemini-1.5-flash",
        prompt: [{ role: "user", content: prompt }],
        object_schema: z.object({
          query: z.string(),
          your_response: z.array(z.string()),
        }),
      });
  
      
      const { query, your_response } = result.object;
      console.log("Query:", query);
      console.log("Your Response:", your_response.join(" ")); 
    } catch (error) {
      console.error("Error generating object:", error);
    }
  }
  
  
async function streamObject(prompt) {
  try {
    const result = await cal.generate({
      type: "object",
      stream: true, 
      model_name: "gemini-1.5-flash",
      prompt: [{ role: "user", content: prompt }],
      object_schema: z.object({
        query: z.string(),
        your_response: z.array(z.string()),
        
      }),
    });

    for await (const chunk of result) {
      console.log(chunk);  
    }
  } catch (error) {
    console.error("Error streaming object:", error);
  }
}

streamText("give breif about ai");
