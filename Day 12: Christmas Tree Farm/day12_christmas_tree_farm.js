/**
 * AoC 2025: Day 12: Christmas Tree Farm

 * @file    day12_christmas_tree_farm.js
 * @author  Raúl Gonzalez Acosta
 * @date    12/12/2025
 * @brief   Solves a puzzle involving a Christmas tree farm and gift distribution.
 *          - Part 1: Counts in a grid how many gifts can fit in each area.
 *          - Part 2: Admire your AoC and enjoy the holiday spirit.
 * @see     https://adventofcode.com/2025/day/12
 */

import fs from 'fs';

/**
 * @brief Parse input data into gifts and areas
 * @param {string[]} lines - Array of input lines
 * @returns {Object} Parsed gifts and areas
 */
const parseInput = (lines) => {
  const gifts = [];
  const areas = [];
  let currentId = null;
  let currentGrid = [];

  for (const line of lines) {
    // Gift ID line
    if (line.endsWith(':')) {
      currentId = parseInt(line.match(/\d+/)[0]);
    }
    // Grid line
    else if (line.startsWith('#') || line.startsWith('.')) {
      currentGrid.push(line.split(''));
    }
    // Empty line - end of gift
    else if (line === '') {
      if (currentId !== null) {
        gifts[currentId] = currentGrid;
        currentId = null;
        currentGrid = [];
      }
    }
    // Area line
    else {
      const match = line.match(/(\d+)x(\d+): ([\d ]+)/);
      if (match) {
        areas.push({
          width: parseInt(match[1]),
          height: parseInt(match[2]),
          gifts: match[3].split(' ').map(Number)
        });
      }
    }
  }

  return { gifts, areas };
};

/**
 * @brief Calculate gift size by counting '#' symbols
 * @param {string[][]} grid - 2D array representing the gift grid
 * @returns {number} The size of the gift
 */
const calculateGiftSize = (grid) => {
  return grid.reduce((total, row) => 
    total + row.filter(cell => cell === '#').length, 0
  );
};

/**
 * @brief Check if area can fit all gifts
 * @param {Object} area - The area object containing width, height, and gifts
 * @param {number[]} giftSizes - Array of gift sizes indexed by gift ID
 * @returns {boolean} True if the area can fit all gifts, false otherwise
 */
const canFitGifts = (area, giftSizes) => {
  const areaSize = area.width * area.height;
  const totalGiftsSize = area.gifts.reduce((sum, count, giftId) => 
    sum + (giftSizes[giftId] || 0) * count, 0
  );
  return areaSize >= totalGiftsSize;
};

/**
 * @brief Main Runner
 * @returns {Promise<void>}
 * @description Reads input, processes gifts and areas, and outputs results for both parts of the puzzle.
 * @throws {Error} If there is an issue reading the input or processing the data.
 */
export const run = async () => {
  const input = fs.readFileSync('input.txt', 'utf-8');
  const lines = input.trim().split('\n');
  
  const { gifts, areas } = parseInput(lines);
  const giftSizes = gifts.map(calculateGiftSize);
  
  const part1 = areas.filter(area => canFitGifts(area, giftSizes)).length;
  
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: Merry Christmas!`);
};

run().catch(err => {
  console.error('Error running the puzzle:', err);
});