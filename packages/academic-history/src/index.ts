import path from 'path';
import fs from 'fs';
import pdf2table from 'pdf2table';

const RELATIVE_PATH = './historico_170105342.pdf';

const absolutePath = path.resolve(__dirname, RELATIVE_PATH);
const file = fs.readFileSync(absolutePath);

function callback(error: unknown, rows: unknown) {
  if (error) {
    return console.log(error);
  }

  console.log(rows);
}

pdf2table.parse(file, callback);
