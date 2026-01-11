// Install first:
// npm install @google/genai mime
// (Optional) npm install -D @types/node

import { GoogleGenAI } from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY, // works only in Node environment
  });

  const tools = [
    { codeExecution: {} }
  ];

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
    tools,
  };

  const model = 'gemini-2.5-flash-lite';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: "INSERT_INPUT_HERE",
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  for await (const chunk of response) {
    const part = chunk?.candidates?.[0]?.content?.parts?.[0];
    if (!part) continue;

    if (part.text) console.log(part.text);
    if (part.executableCode) console.log(part.executableCode);
    if (part.codeExecutionResult) console.log(part.codeExecutionResult);
  }
}

main();
