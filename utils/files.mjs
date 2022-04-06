import fs from 'fs';
import csv from 'csv-parser';

export const readFile = (path) => {
  return new Promise((resolve, reject) => {
    const fileData = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', row => {
        fileData.push(row);
      })
      .on('end', () => resolve(fileData))
      .on('error', error => reject(error));
  });
}

export const appendToFile = (rows, path) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(path, { flags: 'a' });
    rows.forEach(row => stream.write(`${row}\n`)); // TODO: backpressure and drain
    stream.on('close', () => resolve());
    stream.on('error', error => reject(error));
    stream.end();
  });
}
