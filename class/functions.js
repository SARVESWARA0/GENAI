const {
    generateText,
    generateObject,
    streamObject,
    streamText,
    convertToCoreMessages,
  } = require("./node_modules/ai");
  const { createOpenAi } = require("@ai-sdk/openai");
  const { createGoogleGenerativeAI } = require("@ai-sdk/google");
  const { createGroq } = require("@ai-sdk/groq");  
    
  
  class fun {
    constructor(provider, key, system_prompt) {
      this.API_KEY = key;
      this.usecase = system_prompt;
      this.genAI = this.createProviderInstance(provider);
    }
  
    createProviderInstance(provider) {
      switch (provider) {
        case "openai":
          return createOpenAi({
            api_key: this.API_KEY,
            compatibility: "strict",
          });
        case "google":
          return createGoogleGenerativeAI({ apiKey: this.API_KEY });
        case "groq":
          return createGroq({ apiKey: this.API_KEY }); 
        default:
          throw new Error("Unsupported provider");
      }
    }
  
    async generate({
      type = "text",
      stream = false,
      model_name,
      prompt,
      object_schema = null,
      system_prompt = this.usecase,
      temp = 0.3,
      max_steps = 5,
    }) {
      const model = this.genAI(model_name);
      const messages = convertToCoreMessages(prompt);
  
      if (type === "text") {
        if (stream) {
          return this.streamResponse({
            method: streamText,
            model,
            messages,
            system_prompt,
            temp,
            max_steps,
          });
        } else {
          return generateText({
            model,
            messages,
            system: system_prompt,
            temperature: temp,
            maxSteps: max_steps,
          });
        }
      } else if (type === "object") {
        if (!object_schema) throw new Error("Object schema required for object generation");
  
        if (stream) {
          return this.streamResponse({
            method: streamObject,
            model,
            messages,
            system_prompt,
            temp,
            max_steps,
            object_schema,
          });
        } else {
          return generateObject({
            model,
            schema: object_schema,
            messages,
            system: system_prompt,
            temperature: temp,
            maxSteps: max_steps,
          });
        }
      }
    }
  
    async streamResponse({ method, model, messages, system_prompt, temp, max_steps, object_schema = null }) {
      const result = await method({
        model,
        messages,
        system: system_prompt,
        temperature: temp,
        maxSteps: max_steps,
        schema: object_schema || undefined,
      });
  
      const stream = object_schema ? result.partialObjectStream : result.textStream;
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return chunks;
    }
  }
  
  module.exports = fun;
  
