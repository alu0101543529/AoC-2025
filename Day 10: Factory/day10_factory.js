/**
 * AoC 2025: Day 10: Factory

 * @file    day10_factory.js
 * @author  Raúl Gonzalez Acosta
 * @date    10/12/2025
 * @brief   Solves a puzzle involving factory light controls and button presses.
 *          - Part 1: Finds the minimum number of button presses to reach a target light state.
 *          - Part 2: Finds the minimum number of button presses to reach a target joltage configuration.
 * @see     https://adventofcode.com/2025/day/10
 */

import fs from 'fs';

/**
 * @brief Parses a line of input into its components.
 * @param {string} line - The input line to parse.
 * @returns {Object} An object containing the light state, button configurations, and target joltage.
 */
function parseLine(line) {
  const lightsMatch = line.match(/\[([.#]+)\]/);
  const state = lightsMatch 
    ? lightsMatch[1].split('').map(c => c === '#' ? 1 : 0)
    : [];
  
  const buttons = [];
  const buttonsSection = line.match(/\] (.+) \{/);
  if (buttonsSection) {
    const buttonMatches = [...buttonsSection[1].matchAll(/\(([0-9,]+)\)/g)];
    buttons.push(...buttonMatches.map(m => m[1].split(',').map(Number)));
  }
  
  const joltageMatch = line.match(/\{([0-9,]+)\}/);
  const joltage = joltageMatch ? joltageMatch[1].split(',').map(Number) : [];
  
  return { state, buttons, joltage };
}

/**
 * @brief Toggles the lights based on button presses.
 * @param {number[]} state - Current state of the lights.
 * @param {number[]} buttonIndices - Indices of lights to toggle.
 * @returns {number[]} New state of the lights after toggling.
 */
function toggleLights(state, buttonIndices) {
  const newState = [...state];
  for (const idx of buttonIndices) {
    if (idx < newState.length) {
      newState[idx] ^= 1;
    }
  }
  return newState;
}

/**
 * @brief Finds the minimum number of button presses to reach the target light state.
 * @param {number[]} targetState - Desired state of the lights.
 * @param {number[][]} buttons - Button configurations.
 * @returns {number} Minimum number of presses, or -1 if unreachable.
 */
function findMinimumPresses(targetState, buttons) {
  const target = targetState.join(',');
  const initial = new Array(targetState.length).fill(0);
  
  if (initial.join(',') === target) return 0;
  
  const queue = [[initial, 0]];
  const visited = new Set([initial.join(',')]);
  
  while (queue.length > 0) {
    const [current, presses] = queue.shift();
    
    for (const button of buttons) {
      const next = toggleLights(current, button);
      const key = next.join(',');
      
      if (key === target) return presses + 1;
      
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([next, presses + 1]);
      }
    }
  }
  
  return -1;
}

/**
 * @brief Calculates the current counter values based on button presses.
 * @param {number[][]} buttons - Button configurations.
 * @param {number[]} presses - Number of times each button has been pressed.
 * @param {number} numCounters - Total number of counters.
 * @returns {number[]} Current values of the counters.
 */
function calculateCounters(buttons, presses, numCounters) {
  const counters = new Array(numCounters).fill(0);
  
  for (let i = 0; i < buttons.length; i++) {
    if (presses[i] === 0) continue;
    for (const counter of buttons[i]) {
      if (counter < numCounters) {
        counters[counter] += presses[i];
      }
    }
  }
  
  return counters;
}

/**
 * @brief Finds the minimum number of button presses to reach the target joltage.
 * @param {number[][]} buttons - Button configurations.
 * @param {number[]} targetJoltage - Desired joltage values for each counter.
 * @returns {number} Minimum number of presses, or -1 if unreachable.
 * @details Uses A* search algorithm for optimization.
 */
function findMinimumJoltagePresses(buttons, targetJoltage) {
  const numCounters = targetJoltage.length;
  const numButtons = buttons.length;
  
  // Priority queue: [priority, button_presses[], total_presses]
  const pq = [[0, new Array(numButtons).fill(0), 0]];
  const visited = new Set();
  
  // Heuristic: sum of remaining joltage needed
  const estimateRemaining = (counters) => {
    return counters.reduce((sum, val, i) => 
      sum + Math.max(0, targetJoltage[i] - val), 0
    );
  };
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [, presses, total] = pq.shift();
    
    const key = presses.join(',');
    if (visited.has(key)) continue;
    visited.add(key);
    
    const counters = calculateCounters(buttons, presses, numCounters);
    
    // Check if target reached
    if (counters.every((val, i) => val === targetJoltage[i])) {
      return total;
    }
    
    // Prune if any counter exceeds target
    if (counters.some((val, i) => val > targetJoltage[i])) {
      continue;
    }
    
    // Try pressing each button
    for (let i = 0; i < numButtons; i++) {
      // Only press buttons that can help reach the target
      const isUseful = buttons[i].some(counter => 
        counter < numCounters && counters[counter] < targetJoltage[counter]
      );
      
      if (!isUseful) continue;
      
      const newPresses = [...presses];
      newPresses[i]++;
      const newKey = newPresses.join(',');
      
      if (!visited.has(newKey)) {
        const newCounters = calculateCounters(buttons, newPresses, numCounters);
        const priority = total + 1 + estimateRemaining(newCounters);
        pq.push([priority, newPresses, total + 1]);
      }
    }
  }
  
  return -1;
}

/**
 * @brief Solves Part 1 of the problem.
 * @param {string[]} input - Array of input lines.
 * @returns {number} Sum of minimum button presses for all lines.
 */
function solvePart1(input) {
  return input.reduce((sum, line) => {
    const { state, buttons } = parseLine(line);
    const presses = findMinimumPresses(state, buttons);
    return sum + (presses !== -1 ? presses : 0);
  }, 0);
}

/**
 * @brief Solves Part 2 of the problem.
 * @param {string[]} input - Array of input lines.
 * @returns {number} Sum of minimum joltage presses for all lines.
 */
function solvePart2(input) {
  return input.reduce((sum, line) => {
    const { buttons, joltage } = parseLine(line);
    const presses = findMinimumJoltagePresses(buttons, joltage);
    return sum + (presses !== -1 ? presses : 0);
  }, 0);
}

/** 
 * @brief Main function to read input and solve both parts.
 */
function solve() {
  const input = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');
  
  console.log('Part 1:', solvePart1(input));
  console.log('Part 2:', solvePart2(input));
}

solve();