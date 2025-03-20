"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextMapping = extractTextMapping;
exports.saveJsonToFile = saveJsonToFile;
var fs = require("fs");
function extractTextMapping(data) {
    var count = 0;
    var result = {};
    // Recursive function to traverse the data
    function traverse(node) {
        if (Array.isArray(node)) {
            node.forEach(traverse);
        }
        else if (node !== null && typeof node === 'object') {
            if (node.text_result && Array.isArray(node.text_result.texts)) {
                node.text_result.texts.forEach(function (text) {
                    count++;
                    result[count] = text;
                });
            }
            // Continue traversing any other keys in the current object
            Object.keys(node).forEach(function (key) {
                traverse(node[key]);
            });
        }
    }
    traverse(data);
    return result;
}
function saveJsonToFile(data, filePath) {
    var newData = data;
    var jsonString = JSON.stringify(newData, null, 2);
    fs.writeFileSync(filePath, jsonString);
    console.log('Data written to file successfully.');
}
