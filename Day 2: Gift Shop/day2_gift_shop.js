/**
 * AoC 2025: Day 2: Gift Shop

 * @file    day2_gift_shop.js
 * @author  Raúl Gonzalez Acosta
 * @date    02/12/2025
 * @brief   Solves a gift shop puzzle involving number patterns.
 *          Processes ranges of numbers and identifies those matching specific digit patterns:
 *          - Part A: Sum of numbers matching the pattern (digit)(same digit)
 *          - Part B: Sum of numbers matching the pattern (digit)(same digit)+
 * @see     https://adventofcode.com/2025/day/2
 */

import fs from 'fs';

/**
 * @brief Solves the puzzle for given input file.
 */
const filename = 'input.txt';
const data = fs.readFileSync(filename, 'utf8')
  .trim()
  .split(',')
  .map(item => item.split('-'))
  .map(item => [
    parseInt(item[0], 10),
    parseInt(item[1], 10)
  ])
  .flatMap(([first, second]) => 
    [...Array(second - first + 1)].map((_, i) => i + first)
  );

// Part A: Filter numbers with pattern (digit)(same digit)
const partA = data
  .filter(item => `${item}`.match(/^(\d+)\1$/))
  .reduce((sum, num) => sum + num, 0);

// Part B: Filter numbers with pattern (digit)(same digit)+
const partB = data
  .filter(item => `${item}`.match(/^(\d+)\1+$/))
  .reduce((sum, num) => sum + num, 0);

console.log('Part A:', partA);
console.log('Part B:', partB);