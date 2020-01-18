import { backupOptions, backupMode } from './interfaces/backup.d';
import { promises, stat, copyFile, existsSync, mkdirSync } from 'fs';
import path from 'path';

export default function (options: backupOptions) {
  return new Promise((resolve, reject) => {
    switch (options.mode) {
      case "COPY":
        copy(options.src, options.dest)
          .then(() => { resolve() })
          .catch((e) => { reject(e) })
      break;
      
      default:
      break;
    }
  });
}

function copy(src: string, dest: string) {
  return new Promise(async(resolve, reject) => {
    let files = await promises.readdir(src)
    .then((files) => files)
    .catch((e) => reject(e))
    
    files = (files === undefined) ? [] : files;

    for (let i = 0; i < files.length; i++) {
      const srcFilePath = src + path.sep + files[i];
      const destFilePath = dest + path.sep + files[i];

      stat(srcFilePath, async (err, stat) => {
        if (err) {
          reject(err);
        }
        if (stat.isFile()) {
          if (!existsSync(dest)) {
            mkdirSync(dest, { recursive: true });
          }
          copyFile(srcFilePath, destFilePath, (err) => {
            if (err) {
              reject(err);
            }
            resolve();
          })
        } else {
          copy(srcFilePath, destFilePath)
        }
      })
    }
  })
}