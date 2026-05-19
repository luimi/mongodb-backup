const { ZipArchive } = require('archiver');
const extract = require('extract-zip');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    zipDirectory: (source, out) => {
        const archive = new ZipArchive({
            zlib: { level: 9 },
        });

        const stream = fs.createWriteStream(out);

        return new Promise((resolve, reject) => {
            archive
                .directory(source, false)
                .on('error', err => reject(err))
                .pipe(stream);

            stream.on('close', () => resolve());

            archive.finalize();
        });
    },
    unzipDirectory: async (zipFile, extractPath) => {
        // Extraer zip
        await extract(zipFile, {
            dir: path.resolve(extractPath)
        });
    },
    clearDirectory: (path) => {
        fs.rmSync(path, {
            recursive: true,
            force: true
        });
    },
    getBlobFromPath: async (filePath) => {
        const buffer = fs.readFileSync(filePath);
        return new Blob([buffer]);
    },
    runCommand: (command) => {
      return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            return reject(stderr);
          }
    
          resolve(stdout);
        });
      });
    }
}
