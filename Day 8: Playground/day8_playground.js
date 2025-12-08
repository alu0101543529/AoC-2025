/**
 * AoC 2025: Day 8: Playground

 * @file    day8_playground.js
 * @author  Raúl Gonzalez Acosta
 * @date    07/12/2025
 * @brief   Solves a puzzle involving junction boxes in 3D space.
 *          - Part 1: Calculates the product of the sizes of the three largest circuits after 1000 connections.
 *          - Part 2: Calculates the product of the x-coordinates of the last connected junction boxes.
 * @see     https://adventofcode.com/2025/day/8
 */

import fs from "fs";

/**
 * @brief Parse a line of coordinates into an object
 * @param {string} line The line containing coordinates in "x,y,z" format
 * @returns {{x: number, y: number, z: number}} The parsed coordinates
 */
const parseCoordinates = (line) => {
  const [x, y, z] = line.split(",").map(Number);
  return { x, y, z };
};

/**
 * Calculate Euclidean distance between two junction boxes
 * @param {{x: number, y: number, z: number}} boxA First junction box
 * @param {{x: number, y: number, z: number}} boxB Second junction box
 * @returns {number} The Euclidean distance
 */
const calculateDistance = (boxA, boxB) => {
  const dx = boxA.x - boxB.x;
  const dy = boxA.y - boxB.y;
  const dz = boxA.z - boxB.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Generate all pairwise distances between junction boxes
 * @param {{x: number, y: number, z: number}[]} boxes Array of junction boxes
 * @returns {{dist: number, boxes: [number, number]}[]} Sorted array of distances with box indices
 */
const generateDistances = (boxes) => {
  const distances = [];
  
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      distances.push({
        dist: calculateDistance(boxes[i], boxes[j]),
        boxes: [i, j],
      });
    }
  }
  
  return distances.sort((a, b) => a.dist - b.dist);
};

/**
 * @brief Main function to run the solution
 * @param {string[]} fileContents Array of lines from the input file
 * @returns {{part1: number, part2: number}} The results for part 1 and part 2
 */
export const run = (fileContents) => {
  const junctionBoxes = fileContents.map(parseCoordinates);
  const distanceArray = generateDistances(junctionBoxes);
  
  const circuitsArray = [];
  const circuitsMap = new Map();
  const unusedBoxes = new Set([...junctionBoxes.keys()]);
  let lastConnection;
  let part1;

  for (let x = 0; x < distanceArray.length; x++) {
    // Solve for part 1 if the 1000th connection has been made
    if (x === 1000) {
      part1 = Array.from(new Set(circuitsMap.values()))
        .map((circuit) => circuitsArray[circuit].size)
        .sort((a, b) => b - a)
        .splice(0, 3)
        .reduce((total, val) => total * val, 1);
    }

    const connection = distanceArray[x];
    let circuits = connection.boxes.map((box) => {
      if (unusedBoxes.has(box)) unusedBoxes.delete(box);
      if (circuitsMap.has(box)) return circuitsMap.get(box);
    });

    if (unusedBoxes.size === 0) {
      lastConnection = connection;
      break;
    }

    if (circuits[0] != null && circuits[0] === circuits[1]) continue;

    circuits = circuits.filter((circuit) => circuit != null);

    if (circuits.length === 0) {
      connection.boxes.forEach((box) =>
        circuitsMap.set(box, circuitsArray.length)
      );
      circuitsArray.push(new Set([...connection.boxes]));
    } else if (circuits.length === 1) {
      connection.boxes.forEach((box) => {
        circuitsMap.set(box, circuits[0]);
        circuitsArray[circuits[0]].add(box);
      });
    } else {
      const circuitA = circuitsArray[circuits[0]];
      const circuitB = circuitsArray[circuits[1]];
      const joinedCircuit = new Set([...circuitA.keys(), ...circuitB.keys()]);
      joinedCircuit.forEach((box) =>
        circuitsMap.set(box, circuitsArray.length)
      );
      circuitsArray.push(joinedCircuit);
    }
  }

  const part2 = lastConnection.boxes.reduce(
    (total, box) => total * junctionBoxes[box].x,
    1
  );

  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
  
  return { part1, part2 };
};

const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n");
run(input);
