// Install first:
// npm install @google/genai mime
// (Optional) npm install -D @types/node

// Import the GoogleGenAI class from the SDK
import { GoogleGenAI } from '@google/genai';

// Define an async function (because API calls are async)
async function main() {

  // Create an AI client instance
  const ai = new GoogleGenAI({
    // API key is taken from environment variable
    // IMPORTANT: This only works in backend (Node.js), NOT frontend
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Define tools that the model can use
  const tools = [
    { codeExecution: {} } // Allows model to generate and run code
  ];

  // Configuration object for model behavior
  const config = {
    thinkingConfig: {
      thinkingBudget: 0, 
      // 0 = no "thinking mode" (faster, cheaper, less reasoning)
    },
    tools, // attach tools defined above
  };

  // Choose which Gemini model to use
  const model = 'gemini-2.5-flash-lite';
  // Flash-lite = fast + cheap but less powerful

  // Input you send to the model
  const contents = [
    {
      role: 'user', // message is from user
      parts: [
        {
          text: "INSERT_INPUT_HERE", 
          // Replace this with your actual prompt
        },
      ],
    },
  ];

  // Call Gemini API with streaming response
  const response = await ai.models.generateContentStream({
    model,   // which model to use
    config,  // config settings
    contents // user input
  });

  // Loop over streamed chunks (real-time output)
  for await (const chunk of response) {

    // Extract first candidate → content → first part
    const part = chunk?.candidates?.[0]?.content?.parts?.[0];

    // Skip if no valid data
    if (!part) continue;

    // If response contains normal text → print it
    if (part.text) console.log(part.text);

    // If model generated executable code → print it
    if (part.executableCode) console.log(part.executableCode);

    // If code was executed → print result
    if (part.codeExecutionResult) console.log(part.codeExecutionResult);
  }
}

// Run the main function
main();
/*
1. You create a Gemini AI client using your API key.
2. You define tools (here: code execution → model can write + run code).
3. You configure how the model behaves (speed vs thinking).
4. You send a user prompt ("INSERT_INPUT_HERE").
5. The model processes it.
6. Instead of waiting for full output → you stream it chunk by chunk.
7. For each chunk:
   - If it's text → print it
   - If it's code → print it
   - If it's execution result → print it
8. End result: real-time AI response (like ChatGPT typing effect).
*/