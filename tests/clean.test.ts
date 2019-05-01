import removeDir from '../src/utils/clean'
import { writeFileSync } from 'fs';
const fs = require('fs')

const baseFolder = __dirname + '\\data'

beforeAll(() => {
  fs.promises.mkdir(baseFolder);
})

afterAll(async () => {
  await removeDir(baseFolder);
})

test('remove directory', function () {
  const path = baseFolder + '\\BasicFolder'
    
  if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
  }
  expect(fs.existsSync(path)).toBe(true);

  removeDir(path).then(() => {
    expect(fs.existsSync(path)).toBe(false);
  })
});

test('remove directory with sub folder', async function () {
  const path = baseFolder + '\\DirWithSubFolder'
    
  if (!fs.existsSync(path + '\\sub')) {
      fs.mkdirSync(path + '\\sub', {recursive: true});
  }
  expect(fs.existsSync(path)).toBe(true);

  await removeDir(path);
  expect(fs.existsSync(path)).toBe(false);
});

test ('remove directory with file', async function () {
  const path = baseFolder + '\\DirWithFile'
    
  if (!fs.existsSync(path + '\\sub')) {
      fs.mkdirSync(path + '\\sub', {recursive: true});
  }
  writeFileSync(path + '\\test.txt', 'test');
  expect(fs.existsSync(path)).toBe(true);

  await removeDir(path);
  expect(fs.existsSync(path)).toBe(false);
})
