let isAlgoNeeded = false;

function translatePigLatin(str) {
   let pigLatinStr = '';
   const regex = /[aeiou]/gi;
   if (str[0].match(regex)) {
      pigLatinStr = `${str}way`;
   } else {
      const vowelIndice = str.match(regex) ? str.indexOf(str.match(regex)[0]) : -1;
      if (vowelIndice > -1)
         pigLatinStr = `${str.substr(vowelIndice) + str.substr(0, vowelIndice)}ay`;
      else pigLatinStr = `${str}ay`;
   }

   return pigLatinStr;
}

/**
 *
 * @param str: As a line string
 */
const pigLatin = str => {
   const words = str.split(' ');
   return words
      .map(w => {
         if (w) {
            return isAlgoNeeded ? translatePigLatin(w) : `${w}(PL)`;
         }
         return w;
      })
      .join(' ');
};

/**
 *
 * @param lines: Number of lines as an array
 */
const parse = lines =>
   lines
      .map(l => {
         const patt = new RegExp(/^\s/);
         const res = patt.test(l);
         if (res) return l;
         return pigLatin(l);
      })
      .join('\n');

/**
 * parent/caller and the child process comunucation
 */
process.on('message', ({ lines, forkNumber, isAlgo = false }) => {
   console.time(`ForkNumber: ${forkNumber}`);
   isAlgoNeeded = isAlgo;
   const result = parse(lines);
   console.timeEnd(`ForkNumber: ${forkNumber}`);
   process.send(result);
});
