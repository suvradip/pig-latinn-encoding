/**
 *
 * @param str: As a line string
 */
const pigLatin = str => {
   const words = str.split(' ');
   return words.map(w => (w ? `${w}(PL)` : w)).join(' ');
};

/**
 *
 * @param lines: Number of lines as an array
 */
const parse = lines => lines.map(l => pigLatin(l)).join('\n');

/**
 * parent/caller and the child process comunucation
 */
process.on('message', ({ lines, forkNumber }) => {
   console.time(`ForkNumber: ${forkNumber}`);
   const result = parse(lines);
   console.timeEnd(`ForkNumber: ${forkNumber}`);
   process.send(result);
});
