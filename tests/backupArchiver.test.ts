import { sep, dirname } from "path";
import { existsSync, promises, openSync } from "fs";
import removeDir from "../src/utils/clean";

const backup = require("../src/backup");

const baseFolder = __dirname + sep + "BackupArchive";
const srcFolder = baseFolder + sep + "src";
const destFolder = baseFolder + sep + "dest";

test("backup one file to archive", async function(done) {
  let src = srcFolder + sep + "BackupOneFile";
  let dest = destFolder + sep + "BackupOneFile" + sep + "archive.zip";

  if (existsSync(src)) {
    await removeDir(src);
  }
  promises.mkdir(src, { recursive: true });

  if (existsSync(dirname(dest))) {
    await removeDir(dirname(dest));
  }

  await promises.writeFile(src + sep + "test.txt", "test");
  const nbFilesSrcFolder = await promises
    .readdir(src)
    .then(files => files.length);

  expect(nbFilesSrcFolder).toBe(1);

  await backup({
    src,
    dest,
    mode: "ARCHIVE"
  });

  const folder = openSync(dirname(dest), "r");
  expect(folder).not.toBe(-1);

  const nbFilesDestFolder = await promises
    .readdir(dirname(dest))
    .then(files => files.length);

  expect(nbFilesDestFolder).toBe(1);

  removeDir(src);
  removeDir(dirname(dest));

  done();
});
