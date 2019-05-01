import { sep } from "path";
import { rmdir } from "fs";

const fs = require('fs');

export default function removeDir(dirPath: string, root?: string) {
  return new Promise(async (resolve, reject) => {
    let files;
    try { files = fs.readdirSync(dirPath); }
    catch(e) { reject(e) }
    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + sep + files[i];
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
          await removeDir(filePath);
      }
    }
    rmdir(dirPath, () => {
      resolve();
    });
  })
}