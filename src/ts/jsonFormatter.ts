import * as fs from 'fs';

interface TextMapping {
  [key: number]: string;
}

export function extractTextMapping(data: any): TextMapping {
  let count = 0;
  const result: TextMapping = {};

  // Recursive function to traverse the data
  function traverse(node: any): void {
    if (Array.isArray(node)) {
      node.forEach(traverse);
    } else if (node !== null && typeof node === 'object') {
      if (node.text_result && Array.isArray(node.text_result.texts)) {
        node.text_result.texts.forEach((text: string) => {
          count++;
          result[count] = text;
        });
      }
      // Continue traversing any other keys in the current object
      Object.keys(node).forEach(key => {
        traverse(node[key]);
      });
    }
  }

  traverse(data);
  return result;
}

export function saveJsonToFile(data: any, filePath: string) {
  const newData = data;
  const jsonString = JSON.stringify(newData, null, 2);
  fs.writeFileSync(filePath, jsonString);
  console.log('Data written to file successfully.');
}