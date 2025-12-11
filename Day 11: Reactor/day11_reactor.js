/**
 * AoC 2025: Day 11: Reactor

 * @file    day11_reactor.js
 * @author  Raúl Gonzalez Acosta
 * @date    11/12/2025
 * @brief   Solves a puzzle involving a reactor network and pathfinding.
 *          - Part 1: Counts distinct paths from 'you' to 'out'.
 *          - Part 2: Counts distinct paths from 'svr' to 'out' visiting 'dac' and 'fft'.
 * @see     https://adventofcode.com/2025/day/11
 */

import fs from 'fs';

/**
 * @brief Loads lines from a file.
 * @param {string} filename - The name of the file to read.
 * @returns {string[]} An array of lines from the file.
 */
function loadLines(filename) {
  return fs.readFileSync(filename, 'utf-8').trim().split('\n');
}

/**
 * @brief Parses the input lines into a graph representation.
 * @param {string[]} lines - The input lines.
 * @returns {Object} The graph as an adjacency list.
 */
function parseGraph(lines) {
  const graph = {};
  for (const line of lines) {
    const nodes = line.match(/\w{3}/g);
    if (nodes && nodes.length > 0) {
      const [device, ...outputs] = nodes;
      graph[device] = outputs;
    }
  }
  return graph;
}

/**
 * @brief Counts the number of distinct paths from a starting node to 'out'.
 * @param {string} node - The current node.
 * @param {Set<string>} [requiredNodes=null] - Nodes that must be visited.
 * @param {Map} [memo=new Map()] - Memoization map.
 * @param {Set<string>} [visited=new Set()] - Set of currently visited nodes.
 * @returns {number} The number of distinct paths to 'out'.
 */
function countPaths(node, requiredNodes = null, memo = new Map(), visited = new Set()) {
  // Base case: reached output
  if (node === 'out') {
    return !requiredNodes || requiredNodes.size === 0 ? 1 : 0;
  }

  // Detect cycles
  if (visited.has(node)) return 0;

  // Memoization key
  const memoKey = requiredNodes 
    ? `${node}:${[...requiredNodes].sort().join(',')}` 
    : node;
  
  if (memo.has(memoKey)) {
    return memo.get(memoKey);
  }

  // Update required nodes
  const updatedRequired = requiredNodes ? new Set(requiredNodes) : null;
  if (updatedRequired) {
    updatedRequired.delete(node);
  }

  // Explore neighbors
  visited.add(node);
  const neighbors = graph[node] || [];
  let totalPaths = 0;
  
  for (const neighbor of neighbors) {
    totalPaths += countPaths(neighbor, updatedRequired, memo, visited);
  }
  
  visited.delete(node);

  memo.set(memoKey, totalPaths);
  return totalPaths;
}

// Load and parse the graph from input file
const graph = parseGraph(loadLines('input.txt'));
// Display results
console.log("Part 1:", countPaths('you'))
console.log("Part 2:", countPaths('svr', new Set(['dac', 'fft'])))