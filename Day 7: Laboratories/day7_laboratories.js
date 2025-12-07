/**
 * AoC 2025: Day 7: Laboratories

 * @file    day7_laboratories.js
 * @author  Raúl Gonzalez Acosta
 * @date    07/12/2025
 * @brief   Solves a tachyon manifold puzzle involving beam splitting and quantum timelines.
 *          - Part 1: Calculates the number of beam splits.
 *          - Part 2: Calculates the total number of quantum timelines.
 * @see     https://adventofcode.com/2025/day/7
 */

import fs from 'fs';

/** * @brief Solves the tachyon manifold to count beam splits.
 * @param {string} input - The raw input text.
 * @returns {number} - The number of times the beam is split.
 */
function solveTachyonManifold(input) {
  const lines = input.trim().split('\n');
  const grid = lines.map(line => line.split(''));
  
  // Find starting position (S)
  let startCol = -1;
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col] === 'S') {
      startCol = col;
      break;
    }
  }
  
  let splitCount = 0;
  // Track visited positions to avoid infinite loops
  const visited = new Set(); 
  
  // Queue: [row, col]
  const queue = [[0, startCol]];
  
  while (queue.length > 0) {
    const [row, col] = queue.shift();
    
    // Create unique key for this position
    const key = `${row},${col}`;
    if (visited.has(key)) continue;
    visited.add(key);
    
    // Check if out of bounds
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      continue;
    }
    
    const cell = grid[row][col];
    
    if (cell === '^') {
      // Split the beam
      splitCount++;
      // Add left and right positions to queue
      queue.push([row, col - 1]);
      queue.push([row, col + 1]);
    } else {
      // Empty space or S - continue downward
      queue.push([row + 1, col]);
    }
  }
  
  return splitCount;
}

/**
 * @brief Counts the total number of quantum timelines.
 * @param {string} input - The raw input text.
 * @returns {number} - The total number of timelines.
 */
function countQuantumTimelines(input) {
  const lines = input.trim().split('\n');
  const grid = lines.map(line => line.split(''));
  
  // Find starting position (S)
  let startCol = -1;
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col] === 'S') {
      startCol = col;
      break;
    }
  }
  
  // Track unique endpoints instead of full paths
  const endpoints = new Set();
  
  // Queue: [row, col]
  // Use BFS with position tracking only
  const queue = [[0, startCol]];
  const visited = new Map(); // position -> count of times visited
  
  while (queue.length > 0) {
    const [row, col] = queue.shift();
    
    // Check if out of bounds - this is an endpoint
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      endpoints.add(`${row},${col}`);
      continue;
    }
    
    const key = `${row},${col}`;
    
    // Limit revisits to avoid exponential explosion
    const visitCount = visited.get(key) || 0;
    if (visitCount > 100) continue; // Adjust threshold as needed
    visited.set(key, visitCount + 1);
    
    const cell = grid[row][col];
    
    if (cell === '^') {
      // Quantum split - particle goes both ways
      queue.push([row, col - 1]);
      queue.push([row, col + 1]);
    } else {
      // Empty space or S - continue downward
      queue.push([row + 1, col]);
    }
  }
  
  // Count paths using memoized DFS instead
  const memo = new Map();
  
  function countPaths(row, col) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      return 1; // One path exits here
    }
    
    const key = `${row},${col}`;
    if (memo.has(key)) return memo.get(key);
    
    const cell = grid[row][col];
    let count = 0;
    
    if (cell === '^') {
      count = countPaths(row, col - 1) + countPaths(row, col + 1);
    } else {
      count = countPaths(row + 1, col);
    }
    
    memo.set(key, count);
    return count;
  }
  
  return countPaths(0, startCol);
}

// Read input from file
const input = fs.readFileSync('input.txt', 'utf8');

// Print results
console.log(`Part 1: `, solveTachyonManifold(input));
console.log(`Part 2: `, countQuantumTimelines(input));