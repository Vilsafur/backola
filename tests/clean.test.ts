import removeDir from "../src/utils/clean";
import { writeFileSync } from "fs";
import { sep } from "path";
const fs = require("fs");

const baseFolder = __dirname + sep + "data";

beforeAll(() => {
  fs.promises.mkdir(baseFolder);
});

afterAll(async () => {
  await removeDir(baseFolder);
});

test("remove directory", function() {
  const path = baseFolder + sep + "BasicFolder";

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  expect(fs.existsSync(path)).toBe(true);

  removeDir(path).then(() => {
    expect(fs.existsSync(path)).toBe(false);
  });
});

test("remove directory with sub folder", async function() {
  const path = baseFolder + sep + "DirWithSubFolder";

  if (!fs.existsSync(path + sep + "sub")) {
    fs.mkdirSync(path + sep + "sub", { recursive: true });
  }
  expect(fs.existsSync(path)).toBe(true);

  await removeDir(path);
  expect(fs.existsSync(path)).toBe(false);
});

test("remove directory with file", async function() {
  const path = baseFolder + sep + "DirWithFile";

  if (!fs.existsSync(path + sep + "sub")) {
    fs.mkdirSync(path + sep + "sub", { recursive: true });
  }
  writeFileSync(path + sep + "test.txt", "test");
  expect(fs.existsSync(path)).toBe(true);

  await removeDir(path);
  expect(fs.existsSync(path)).toBe(false);
});
