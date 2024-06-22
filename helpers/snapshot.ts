/**
 * This is an async function that constructs a visual snapshot of the given directory path.
 * The shapshot depth and ignored paths can be customized. Useful for describing a directory structure to openai
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

import { relative, walk } from 'bru'

async function snapshot(
  basePath: string,
  depth = 2,
  ignorePatterns: string[] = [],
  maxLines = 25,
): Promise<string> {
  let structure = `Snapshot of '${basePath}' (depth: ${depth})\n\n`
  let lineCount = 0

  const skipRegexes = ignorePatterns.map((pattern) => new RegExp(pattern))
  const walkOptions = { maxDepth: depth, skip: skipRegexes }

  for await (const entry of walk(basePath, walkOptions)) {
    // Stop if max lines reached
    if (lineCount >= maxLines) break

    const relativePath = relative(basePath, entry.path)
    const indentation = '  '.repeat(relativePath.split('/').length - 1)
    const entryName = entry.isDirectory ? `${entry.name}/` : entry.name

    structure += `${indentation}${entryName}\n`
    lineCount++
  }

  return structure
}

export default snapshot
