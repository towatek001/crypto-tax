import { readFile, appendToFile } from './utils/files.mjs';
import { processCsvRow } from './process-celsius-csv.helper.mjs';

const { TAX_YEAR, SOURCE_FILE_PATH, DEST_FILE_PATH } = process.env;

if (!TAX_YEAR || !SOURCE_FILE_PATH || !DEST_FILE_PATH) {
  console.error(`env vars not defined`);
  process.exit(-1);
}

const processedData = [];

console.log('reading input csv file');
const inputData = await readFile(SOURCE_FILE_PATH);

const headerRow = `${Object.keys(inputData[0]).join(',')}, CAD Value`;

console.log(`writing csv header ${headerRow}`);
await appendToFile([headerRow], DEST_FILE_PATH);

console.log(`start generating new csv data`);
for (const data of inputData) {
  const year = new Date(data[' Date and time']).getFullYear().toString();
  if (year === process.env.TAX_YEAR) {
    const newData = await processCsvRow(data);
    const csvLine = Object.values(newData).map(d => `"${d}"`).join(',');
    processedData.push(csvLine);
  }
}

console.log(`write ${processedData.length} new csv data to file`);
await appendToFile(processedData, DEST_FILE_PATH);
