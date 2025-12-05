/**
 * AoC 2025: Day 5: Cafeteria

 * @file    day5_cafeteria.js
 * @author  Raúl Gonzalez Acosta
 * @date    05/12/2025
 * @brief   Solves a cafeteria puzzle involving fruit ranges.
 *          - Part 1: Counts how many fruits fall within given ranges.
 *          - Part 2: Calculates the total number of integers covered by the ranges.
 * @see     https://adventofcode.com/2025/day/5
 */

import fs from 'fs';

// Read input file
const input = fs.readFileSync('input.txt', 'utf-8').trim();

// Separate ranges and fruits
const [rangesSection, fruitsSection] = input.split('\n\n');

// Parse and merge ranges
function mergeRanges(rangesText) {
  const ranges = rangesText
    .split('\n')
    .map(line => line.split('-').map(Number));
  
  // Ordenar por inicio de rango
  ranges.sort((a, b) => a[0] - b[0]);
  
  const merged = [ranges[0]];
  
  for (let i = 1; i < ranges.length; i++) {
    const current = ranges[i];
    const last = merged[merged.length - 1];
    
    // If ranges overlap or are contiguous, merge them
    if (current[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push([current[0], current[1]]);
    }
  }
  
  return merged;
}

// Check if a number is within any range
function isInRanges(number, ranges) {
  return ranges.some(([start, end]) => start <= number && number <= end);
}

// Count total numbers within the ranges
function countNumbersInRanges(ranges) {
  return ranges.reduce((total, [start, end]) => total + (end - start + 1), 0);
}

// Process data
const mergedRanges = mergeRanges(rangesSection);
const fruits = fruitsSection.split('\n').map(Number);

// Part 1: Count how many fruits are within the ranges
const fruitsInRanges = fruits.filter(fruit => isInRanges(fruit, mergedRanges)).length;
console.log('Fruits in ranges:', fruitsInRanges);

// Part 2: Total numbers within the ranges
const totalNumbers = countNumbersInRanges(mergedRanges);
console.log('Total numbers in ranges:', totalNumbers);