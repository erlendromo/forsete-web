import { validateFileSize, validateFileType } from "../src/services/index/validationService";

describe("Validation Service", () => {
    describe("validateFileSize", () => {
        // Positive test cases
        it("should return true for file size within the limit", () => {
            const fileSize = 10 * 1024 ** 2; // 10MB
            expect(validateFileSize(fileSize)).toBe(true);
        });

        it("should return false for file size exceeding the limit", () => {
            const fileSize = 40 * 1024 ** 2; // 40MB
            expect(validateFileSize(fileSize)).toBe(false);
        });

        it("should return true for file size exactly at the limit", () => {
            const fileSize = 32 * 1024 ** 2; // 32MB
            expect(validateFileSize(fileSize)).toBe(true);
        });
        // Negative test cases
        it("should return false for 0", () => {
            const fileSize = 0;
            expect(validateFileSize(fileSize)).toBe(false);
        });
        it("should return false for -1", () => {
            const fileSize = -1;
            expect(validateFileSize(fileSize)).toBe(false);
        });
    });

    describe("validateFileType", () => {
        // Positve test cases
        it("should return true for allowed file type 'image/jpeg'", () => {
            const fileType = "image/jpeg";
            expect(validateFileType(fileType)).toBe(true);
        });

        it("should return true for allowed file type 'application/pdf'", () => {
            const fileType = "application/pdf";
            expect(validateFileType(fileType)).toBe(true);
        });
        // Negative test cases
        it("should return false for disallowed file type 'text/plain'", () => {
            const fileType = "text/plain";
            expect(validateFileType(fileType)).toBe(false);
        });

        it("should return false for an empty file type", () => {
            const fileType = "";
            expect(validateFileType(fileType)).toBe(false);
        });

        it("should return false for a completely invalid file type", () => {
            const fileType = "invalid/type";
            expect(validateFileType(fileType)).toBe(false);
        });
    });
});