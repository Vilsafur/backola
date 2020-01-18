import { backupOptions } from './interfaces/backup.d';
import { promises, stat, copyFile, existsSync, mkdirSync, createWriteStream } from 'fs';
import path, { dirname } from 'path';
import archiver from 'archiver';

export default function (options: backupOptions) {
  return new Promise((resolve, reject) => {
    switch (options.mode) {
      case "COPY":
        copy(options.src, options.dest)
          .then(() => { resolve() })
          .catch((e) => { reject(e) })
      break;

      case "ARCHIVE":
        archive(options.src, options.dest)
          .then(() => { resolve() })
          .catch((e) => { reject(e) });
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

async function archive(src: string, dest: string) {
  if (!existsSync(dirname(dest))) {
    mkdirSync(dirname(dest), { recursive: true });
  }

  const output = createWriteStream(dest);
  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  });

  archive.on('warning', (err) => {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  })

  archive.on('error', (err) => {
    throw err;
  })

  archive.pipe(output);

  archive.directory(src, false);

  await archive.finalize();
}