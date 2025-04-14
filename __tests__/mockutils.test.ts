import { workDirPath } from '../src/mocks/mockutil';
import { loadTestFile } from '../src/mocks/mockutil';
import { ImageData } from '../src/interfaces/htrInterface';

describe('workDirPath', () => {
  it('should display the correct working directory path', async () => {
    
    const relativePath = "__tests__/mockutils.test.ts";
    const absolutePath = workDirPath(relativePath);

    expect(absolutePath.endsWith(relativePath));

    // 'Absolute path:' /root/__tests__/mockutils.test.ts
    console.log('Absolute path:', absolutePath);

  });
});

describe('loadTestFile', () => {
  let obj: ImageData;

  // Before any test runs, load the JSON fixture. Ensure that the path is correct.
  beforeAll(() => {
    obj = loadTestFile<ImageData>("__tests__/testData/dummyData.json");
  });

  it('should load the file and parse file_name correctly', () => {
    // Positive test
    const expectedSubstring = "Tipsskjema_Kriminalpolitisentralen-2";
    expect(obj.file_name).toMatch(expectedSubstring);

    // Negative test
    const notExpected = "error";
    expect(obj.file_name).not.toMatch(notExpected);
  });

  it('should load the file and parse image_path correctly', () => {
    // Check that image_path contains the expected directory and filename.
    const expectedPathFragment = "/tmp/gradio/";
    expect(obj.image_path).toMatch(expectedPathFragment);
    expect(obj.image_path).toMatch("Tipsskjema_Kriminalpolitisentralen-2.png");

    // Negative test
    expect(obj.image_path).not.toMatch("wrong_path");
  });

  it('should load the file and parse image_name correctly', () => {
    // image_name is expected to be exactly "Tipsskjema_Kriminalpolitisentralen-2"
    expect(obj.image_name).toBe("Tipsskjema_Kriminalpolitisentralen-2");
    expect(obj.image_name).not.toBe("errorName");
  });

  it('should load the file and parse label correctly', () => {
    // label is expected to match exactly as given.
    expect(obj.label).toBe("Tipsskjema_Kriminalpolitisentralen-2");
    expect(obj.label).not.toBe("unexpectedLabel");
  });

  it('should have a non-empty contains array', () => {
    // Check that contains is an array and is not empty.
    expect(Array.isArray(obj.contains)).toBe(true);
    expect(obj.contains.length).toBeGreaterThan(0);
  });

  it('should correctly parse nested properties in the first element of contains', () => {
    // Assuming the JSON has at least one element in "contains"
    const firstContain = obj.contains[0];

    // Check that the first contained object has a segment and a label.
    expect(firstContain).toHaveProperty('segment');
    expect(firstContain).toHaveProperty('label');

    // Segment interface test
    const segment = firstContain.segment;
    expect(segment).toHaveProperty('bbox');
    expect(segment).toHaveProperty('polygon');
    expect(typeof segment.score).toBe('number');
    expect(segment).toHaveProperty('class_label');
    expect(Array.isArray(segment.orig_shape)).toBe(true);
    expect(segment).toHaveProperty('data');

    expect(segment.bbox).toHaveProperty('xmin');
    expect(segment.bbox).toHaveProperty('ymin');
    expect(Array.isArray(segment.polygon.points)).toBe(true);
  });
});