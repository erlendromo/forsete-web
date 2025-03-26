import data from './testData/dummyData.json';
import { extractTextMapping } from '../src/ts/jsonFormatter';


describe('extractTextMapping', () => {
    it('should count and map text keys correctly', () => {
        // Setup
        const result = extractTextMapping(data);
        // Positive
        expect(result[1]).toBe("Kriminalpolitisentralen");
        expect(Object.keys(result).length).toBe(44);
        expect(result[2]).toBe("Tips-Norat");
        // Negative
        expect(Object.keys(result).length).not.toBe(5);
        expect(result[5]).not.toBe("Tips-Norat");
        expect(result[1]).not.toBe("Wrong");
    });
});