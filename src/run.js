const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { spawn, fork } = require('child_process');

const BASELINE = 100;
const inputFileName = 'book.txt';
const outputLocation = path.resolve(__dirname, '..', 'temp');
const outputFileName = `${outputLocation}/parse.txt`;

if (!fs.existsSync(outputLocation)) fs.mkdirSync(outputLocation);
if (fs.existsSync(outputFileName)) fs.unlinkSync(outputFileName);

const operation = (lines, forkNumber) =>
   new Promise((resolve, reject) => {
      try {
         const compute = fork(path.resolve(__dirname, 'translate.js'));
         compute.send({ lines, forkNumber });
         compute.on('message', result => {
            resolve(result);
         });
      } catch (error) {
         reject(error);
      }
   });

const promises = [];

/**
 *
 * @param lines
 * @description: spawn multiple process on baseline that we have set
 */
const runner = lines => {
   const rd = readline.createInterface({
      input: fs.createReadStream(path.resolve(__dirname, '..', 'pdf', inputFileName)),
   });

   let perseLine = 0;
   let forkNumber = 1;
   const linesArray = [];

   rd.on('line', line => {
      perseLine += 1;
      linesArray.push(line.toString());
      if (linesArray.length === BASELINE) {
         promises.push(operation(linesArray, (forkNumber += 1)));
         linesArray.length = 0;
      }

      if (perseLine === lines) {
         promises.push(operation(linesArray, (forkNumber += 1)));

         Promise.all(promises).then(record => {
            console.timeEnd('Complete');

            record.forEach(parsedLine => {
               fs.appendFileSync(outputFileName, parsedLine);
            });
            console.log(`Please visit this location for result: ${outputFileName}`);
            process.exit();
         });
      }
   });
};

// Get total number of line for a file
const wc = spawn('wc', ['-l', path.resolve(__dirname, '..', 'pdf', inputFileName)]);
wc.stdout.on('data', data => {
   const str = data.toString().trim();
   const totalLines = str.split(' ').shift();
   // performing operations base on totla line numbers
   console.time('Complete');
   runner(Number.parseInt(totalLines, 10));
});
