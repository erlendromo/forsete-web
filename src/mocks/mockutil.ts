// utils/mockUtils.ts
import * as path from 'path';
import { readFileSync } from 'fs';

/**
 * Loads a JSON file from a relative path and returns the parsed object.
 * The relative path is resolved relative to this file, with the option
 * to traverse up directories.
 *
 * @param relativePath - The relative file path
 * @returns Parsed JSON object of type T, interfaces and others can be put here
 */
export function loadTestFile<T>(relativePath: string): T {
    const fullPath = path.join(process.cwd(), relativePath);
    const fileContent = readFileSync(fullPath, { encoding: 'utf8' });
    try {
        // Parse the JSON content
        return JSON.parse(fileContent) as T;
    } catch (error) {
        console.error('Error parsing JSON file:', error);
        throw error;
    }
}

/**
 * Generates the absolute file path given a relative path, 
 * by moving up three directories from the current working directory.
 *
 * @param relativePath - The file path relative to the base directory.
 * @returns The absolute file path.
 */
export function workDirPath(relativePath: string): string {
    // Get current working directory
    const currentDir = process.cwd();
  
    // Move up three directories
    const newPath = path.join(currentDir, '../../../');
    console.log(newPath);
  
    // Clean up the path to resolve it correctly (normalize removes redundant segments)
    const cleanPath = path.normalize(newPath);
  
    // Join the clean path with the provided relative path and return
    return path.join(cleanPath, relativePath);
  }
