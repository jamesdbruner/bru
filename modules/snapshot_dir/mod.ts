/**
 * Module for creating a directory snapshot with specified depth and ignore patterns.
 * It prompts the user for necessary inputs if they are not provided as arguments.
 *
 * @module DirectorySnapshot
 */

import { getArgs, log, snapshot } from 'bru'

const ignoreList = [
  '^node_modules',
  '^dist/',
  '^.hooks/',
  'CODE_OF_CONDUCT.md',
  'LICENSE.md',
  'CHANGELOG.md',
  'README.md',
  'CONTRIBUTING.md',
  '.git',
  '.DS_Store',
  'yarn.lock',
  'package-lock.json',
  '.prettierignore',
  '.gitignore',
  '.gitkeep',
  '.husky',
  'prettier.*',
  'babel.*',
  'lint-staged.*',
  'perm.ts',
]

export async function main() {
  // Use getArgs to prompt for any missing arguments
  const { path, depth, ignore, maxLines } = await getArgs({
    path: {
      arg: Deno.args[0] || '.',
      prompt: 'Enter the directory path to snapshot:',
    },
    depth: {
      arg: Deno.args[1] || '2',
      prompt: 'Enter the depth of snapshot (default is 2):',
    },
    ignore: {
      arg: Deno.args[2] || ignoreList,
      prompt: 'Enter paths to ignore, separated by commas (optional):',
    },
    maxLines: {
      arg: Deno.args[3] || '50',
      prompt:
        'Enter the maximum number of lines for the snapshot (default is 50):',
    },
  })

  // Convert 'depth' and 'maxLines' to numbers
  const depthNumber = parseInt(String(depth))
  const maxLinesNumber = parseInt(String(maxLines))

  log(`Ignoring: [${ignore.join(', ')}]`)

  // Execute the snapshot function with the provided arguments
  const snapshotResult = await snapshot(
    String(path),
    depthNumber,
    ignore,
    maxLinesNumber,
  )

  log(snapshotResult)
}

await main()
