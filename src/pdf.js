import fs from 'fs/promises';
import pdf from 'pdf-parse';

let doc;


async function readDoc(filepath) {
  try {
    const file = await fs.readFile(filepath);
    const data = await pdf(file);
    doc = data;
    return doc.text;
  } catch (error) {
    throw error;
  }
}

export default readDoc;
