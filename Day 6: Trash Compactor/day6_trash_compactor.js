/**
 * AoC 2025: Day 6: Trash Compactor

 * @file    day6_trash_compactor.js
 * @author  Raúl Gonzalez Acosta
 * @date    06/12/2025
 * @brief   Solves a trash compactor puzzle involving vertical and columnar problems.
 *          - Part 1: Parses and solves vertical problems.
 *          - Part 2: Parses and solves columnar problems.
 * @see     https://adventofcode.com/2025/day/6
 */

import fs from 'fs';

/**
 * @brief Parses the input into individual problems based on the given strategy.
 * @param {string} input - The raw input text.
 * @param {function} parseStrategy - The strategy function to parse each problem.
 * @returns {Array} - An array of parsed problems.
 */
function parseProblems(input, parseStrategy) {
  const lines = input.trim().split('\n');
  const width = Math.max(...lines.map(line => line.length));
  const paddedLines = lines.map(line => line.padEnd(width, ' '));
  
  const problems = [];
  let col = 0;
  
  while (col < width) {
    // Skip empty columns
    if (paddedLines.every(line => line[col] === ' ')) {
      col++;
      continue;
    }
    
    // Find problem width
    let problemWidth = 0;
    while (col + problemWidth < width && 
           paddedLines.some(line => line[col + problemWidth] !== ' ')) {
      problemWidth++;
    }
    
    // Parse problem using the given strategy
    const problem = parseStrategy(paddedLines, col, problemWidth);
    if (problem) problems.push(problem);
    
    col += problemWidth;
  }
  
  return problems;
}

/** * @brief Parses a vertical problem from the given lines and column.
 * @param {Array} paddedLines - The padded input lines.
 * @param {number} col - The starting column for the problem.
 * @param {number} width - The width of the problem.
 * @returns {Object|null} - The parsed problem or null if invalid.
 */
function parseVerticalProblem(paddedLines, col, width) {
  const problemLines = paddedLines
    .map(line => line.substring(col, col + width).trim())
    .filter(line => line);
  
  const numbers = [];
  let operator = null;
  
  for (const line of problemLines) {
    if (line === '+' || line === '*') {
      operator = line;
    } else if (!isNaN(line)) {
      numbers.push(parseInt(line, 10));
    }
  }
  
  return numbers.length > 0 && operator ? { numbers, operator } : null;
}

/** 
 * @brief Parses a columnar problem from the given lines and column.
 * @param {Array} paddedLines - The padded input lines.
 * @param {number} col - The starting column for the problem.
 * @param {number} width - The width of the problem.
 * @returns {Object|null} - The parsed problem or null if invalid.
 */
function parseColumnProblem(paddedLines, col, width) {
  const numbers = [];
  let operator = null;
  
  for (let c = col; c < col + width; c++) {
    const column = paddedLines
      .map(line => line[c])
      .filter(ch => ch !== ' ');
    
    if (column.length === 0) continue;
    
    const lastChar = column[column.length - 1];
    
    if (lastChar === '+' || lastChar === '*') {
      operator = lastChar;
      const digits = column.slice(0, -1).join('');
      if (digits) numbers.push(parseInt(digits, 10));
    } else {
      const digits = column.join('');
      if (digits) numbers.push(parseInt(digits, 10));
    }
  }
  
  return numbers.length > 0 && operator ? { numbers, operator } : null;
}

/**
 * @brief Calculates the total result for a list of problems.
 * @param {Array} problems - The list of problems to solve.
 * @returns {number} - The total result.
 */
function calculateTotal(problems) {
  return problems.reduce((grandTotal, { numbers, operator }) => {
    const result = numbers.reduce((acc, num) => 
      operator === '+' ? acc + num : acc * num
    );
    return grandTotal + result;
  }, 0);
}

// Read input file
const input = fs.readFileSync('input.txt', 'utf-8');

// Parse and solve problems for both parts
const part1Problems = parseProblems(input, parseVerticalProblem);
const part2Problems = parseProblems(input, parseColumnProblem);

// Print results
console.log('Part 1:', calculateTotal(part1Problems));
console.log('Part 2:', calculateTotal(part2Problems));