import removeDir from "../src/utils/clean";
import { promises, existsSync, openSync } from "fs";
import { sep } from "path";

const backup = require("../src/backup");

const baseFolder = __dirname + sep + "Backup";
const srcFolder = baseFolder + sep + "src";
const destFolder = baseFolder + sep + "dest";

test("backup one file", async function(done) {
  let src = srcFolder + sep + "BackupOneFile";
  let dest = destFolder + sep + "BackupOneFile";

  if (existsSync(src)) {
    await removeDir(src);
  }
  promises.mkdir(src, { recursive: true });

  if (existsSync(dest)) {
    await removeDir(dest);
  }

  await promises.writeFile(src + sep + "test.txt", "test");
  const nbFilesSrcFolder = await promises
    .readdir(src)
    .then(files => files.length);

  expect(nbFilesSrcFolder).toBe(1);

  await backup({
    src,
    dest,
    mode: "COPY"
  });

  const folder = openSync(dest, "r");
  expect(folder).not.toBe(-1);

  const nbFilesDestFolder = await promises
    .readdir(dest)
    .then(files => files.length);

  expect(nbFilesDestFolder).toBe(1);

  removeDir(src);
  removeDir(dest);

  done();
});

test("complete backup 2 files", async function() {
  let src = srcFolder + sep + "BackupTwoFile";
  let dest = destFolder + sep + "BackupTwoFile";

  if (existsSync(src)) {
    await removeDir(src);
  }
  promises.mkdir(src, { recursive: true });

  if (existsSync(dest)) {
    await removeDir(dest);
  }

  if (!existsSync(src)) {
    await promises.mkdir(src, { recursive: true });
  }
  await promises.writeFile(src + sep + "test.txt", "test");
  await promises.writeFile(src + sep + "test2.txt", "test");
  const nbFilesSrcFolder = await promises
    .readdir(src)
    .then(files => files.length);

  expect(nbFilesSrcFolder).toBe(2);

  await backup({
    src,
    dest,
    mode: "COPY"
  });

  const folder = openSync(dest, "r");
  expect(folder).not.toBe(-1);

  const nbFilesDestFolder = await promises
    .readdir(dest)
    .then(files => files.length);

  expect(nbFilesDestFolder).toBe(2);

  removeDir(src);
  removeDir(dest);
});
