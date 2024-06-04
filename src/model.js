// model.js
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a highly capable text summarizer. Please summarize the following text accurately and concisely. I'll send a text 'doc' in the middle of a conversation, it's a JS command on my end, ignore it, you are to analyze the text sent and answer any questions that follow about the text (doc):",
});
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

let storedDocument = null;
let storedSummary = null;

async function askAI(input) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Is there any PDF document you would like me to summarize ? 😊 \n" }],
      },
      {
        role: "user",
        parts: [{ text: "doc" }],
      },
      {
        role: "model",
        parts: [{ text: "Okay, I'm waiting for you to load your files. Please give me a few seconds to process them. 😄 \n" }],
      },
    ],
  });

  if (input.toLowerCase() === "doc") {
    // If the user sends "doc", assume they're providing the document text
    storedDocument = input;
    const result = await chatSession.sendMessage(storedDocument);
    storedSummary = result.response.text();
    console.log(storedSummary);
  } else {
    // If the user doesn't send "doc", assume they're asking a question about the previously summarized document
    if (storedDocument && storedSummary) {
      const result = await chatSession.sendMessage(`${storedDocument}\n\n${input}`);
      console.log(result.response.text());
    } else {
      console.log("No document has been summarized yet. Please provide a document first.");
    }
  }
}

export default askAI;
