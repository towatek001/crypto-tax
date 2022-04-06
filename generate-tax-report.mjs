import { readFile } from './utils/files.mjs';
import { generateReport, processCsvRow } from './process-celsius-csv.helper.mjs';

const { TAX_YEAR, SOURCE_FILE_PATH } = process.env;

if (!TAX_YEAR || !SOURCE_FILE_PATH) {
  console.error(`env vars not defined`);
  process.exit(-1);
}

const processedData = [];

console.log('reading input csv file');
const inputData = await readFile(SOURCE_FILE_PATH);

console.log(`start processing data`);
for (const data of inputData) {
  const year = new Date(data[' Date and time']).getFullYear().toString();
  if (year === process.env.TAX_YEAR) {
    const newData = await processCsvRow(data);
    processedData.push(newData);
  }
}

console.log(`generating report`);
const report = generateReport(processedData);
console.log(report);
