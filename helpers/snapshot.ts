/**
 * This is an async function that constructs a snapshot of the given directory path.
 * The shapshot depth and ignored paths can be customized.
 * It will stop adding files to the snapshot once maxLines has been reached.
 *
 * @async
 * @function snapshot
 * @param {string} path - The starting directory path to snapshot.
 * @param {number} depth - Optional. The depth of snapshot. Default is 2.
 * @param {string[]} ignore - Optional. The list of directories or files to ignore during snapshot. Default is an empty array.
 * @param {number} maxLines - Optional. The maximum number of lines to be included in the snapshot. Default is 10.
 * @returns {Promise<string>} A promise that resolves to a string snapshot of the current working directory.
 */

/**
 * This is an async function that recursively traverses the given directory path.
 * It also checks and ignores paths specified.
 *
 * @async
 * @function traverseDir
 * @param {string} currentPath - The current directory path being traversed.
 * @param {string[]} ignore - The list of directories or files to ignore during traversal.
 * @param {number} depth - The depth of traversal.
 * @param {number} currentDepth - Optional. The current depth of traversal. Default is 0.
 * @returns {void} This function does not return a value.
 * @private
 */

import { walk } from 'fs'
import { relative } from 'https://deno.land/std@0.214.0/path/mod.ts'

async function snapshot(
  basePath: string,
  depth = 2,
  ignorePatterns: string[] = [],
  maxLines = 25,
): Promise<string> {
  let structure = `Snapshot of '${basePath}' (depth: ${depth})\n\n`
  let lineCount = 0

  // Convert ignorePatterns to RegExp array for the skip option
  const skipRegexes = ignorePatterns.map((pattern) => new RegExp(pattern))

  // Walk options including maxDepth and skip
  const walkOptions = { maxDepth: depth, skip: skipRegexes }

  for await (const entry of walk(basePath, walkOptions)) {
    if (lineCount >= maxLines) break // Stop if max lines reached

    const relativePath = relative(basePath, entry.path)
    const indentation = '  '.repeat(relativePath.split('/').length - 1)
    const entryName = entry.isDirectory ? `${entry.name}/` : entry.name

    structure += `${indentation}${entryName}\n`
    lineCount++
  }

  return structure
}

export default snapshot
