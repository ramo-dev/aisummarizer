// chat.js
import askAi from "./model.js";
import readDoc from "./pdf.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let doc;

console.log("---Hello there to talk to ai-summarizer, type below\n , to exit type 'bye'---");

async function main(call) {
  rl.question(call, async (input) => {
    if (input.toLowerCase() === "bye") {
      rl.close();
    } else if (input.toLowerCase().includes("doc")) {
      if (!doc) {
        console.log("Please load a document first by typing 'load' and providing the file path.");
        main(`\n>>> `);
        return;
      }
      await askAi(`doc\n\n${doc}`);
      main(`\n>>> `);
    } else {
      await askAi(input);
      main(`\n>>> `);
    }
  });
}

async function loadDocument() {
  rl.question("Enter the file path of the document to load: ", async (filepath) => {
    try {
      doc = await readDoc(filepath);
      console.log("Document loaded successfully.");
      main(`\n>>> `);
    } catch (error) {
      console.error("Error loading document:", error);
      loadDocument();
    }
  });
}

loadDocument();
