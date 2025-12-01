/**
 * AoC 2025: Day 1: Secret Entrance

 * @file    day1_secret_entrance.js
 * @author  Raúl Gonzalez Acosta
 * @date    01/12/2025
 * @brief   Solves a position tracking puzzle with floor crossings and zero crossings.
 *          Starting at position 50, processes movement commands (L/R with steps) to:
 *          - Part A: Count how many times position lands exactly at zero (multiples of 100)
 *          - Part B: Calculate total distance based on floor crossings and zero crossings.
 * @see     https://adventofcode.com/2025/day/1
 */

import fs from 'fs';

/**
 * @brief Solves the puzzle for given input file.
 * @param {string} filename 
 * @returns {{a: number, b: number}} Object with Part A (crossings) and Part B (totalDistance) results
 */
const solve = (filename) => {
  const lines = fs.readFileSync(filename, "utf8").trim().split("\n");
  
  let position = 50;
  let crossings = 0;
  let totalDistance = 0;

  for (const line of lines) {
    const direction = line[0];
    let steps = parseInt(line.slice(1));
    
    if (direction === "L") { steps = -steps; }
    
    const oldPosition = position;
    const oldFloor = Math.floor(oldPosition / 100);
    const wasAtZero = oldPosition % 100 === 0;
    
    position += steps;
    
    const newFloor = Math.floor(position / 100);
    const isAtZero = position % 100 === 0;
    
    // Count floor crossings
    totalDistance += Math.abs(newFloor - oldFloor);
    
    // Count zero crossings (excluding staying at zero)
    if (direction === "L") {
      totalDistance += (isAtZero ? 1 : 0) - (wasAtZero ? 1 : 0);
    }
    
    // Count times landing exactly at zero
    if (isAtZero) { crossings++; }
  }

  return { a: crossings, b: totalDistance };
};

const result = solve("input.txt");
console.log("Part A:", result.a);
console.log("Part B:", result.b);