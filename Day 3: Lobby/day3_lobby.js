/**
 * AoC 2025: Day 3: Lobby

 * @file    day3_lobby.js
 * @author  Raúl Gonzalez Acosta
 * @date    03/12/2025
 * @brief   Solves a lobby puzzle involving digit selection.
 *          For each line of digits, finds the largest numbers formed by selecting:
 *          - Part 1: 2 digits
 *          - Part 2: 12 digits
 * @see     https://adventofcode.com/2025/day/3
 */

import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf-8').trim();
const data = input.split('\n').map(line => line.split('').map(Number));

/**
 * @brief Finds the largest number by selecting 'count' digits from 'digits' array.
 * @param {number[]} digits - Array of single-digit numbers.
 * @param {number} count - Number of digits to select.
 * @return {number} - The largest number formed by the selected digits.
 */
function findLargestNumber(digits, count) {
  let result = '';
  let startIndex = 0;
  
  for (let position = 0; position < count; position++) {
    // Calculate the valid range for the next digit
    let endIndex = digits.length - (count - position - 1);
    let maxDigit = -1;
    let maxIndex = -1;
    
    // Find the maximum digit in the valid range
    for (let i = startIndex; i < endIndex; i++) {
      if (digits[i] > maxDigit) {
        maxDigit = digits[i];
        maxIndex = i;
      }
    }
    
    result += maxDigit;
    startIndex = maxIndex + 1;
  }
  
  return parseInt(result);
}

let part1 = 0;
let part2 = 0;

for (const line of data) {
  part1 += findLargestNumber(line, 2);
  part2 += findLargestNumber(line, 12);
}

console.log('Part 1:', part1);
console.log('Part 2:', part2);