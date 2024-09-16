/**
 * Runs a given module and updates the progress bar.
 *
 * @param {string} mod - The module to run.
 * @param {function(string): Promise<void>} run - The function to execute the module.
 * @param {ProgressBar} pb - The progress bar to update.
 * @returns {Promise<void>}
 */

import type { ProgressBar } from 'bru'
import { $, log, walk } from 'bru'

// Function to process a single file and update the progress bar
export async function runModule(
  mod: string,
  run: (mod: string) => Promise<void>,
  pb: ProgressBar,
) {
  try {
    await run(mod)
    pb.increment()
  } catch (error) {
    log.error(`Error running ${mod}: ${error}`)
  }
}

/**
 * Recursively processes files in a directory.
 *
 * @param {string} dir - The directory to walk through.
 * @param {function(string): Promise<void>} run - The function to execute for each file.
 * @param {string} [ext=/.ts/] - The file extension to filter by.
 * @param {string[]} [skipFiles=['perm.ts']] - Files to skip during processing.
 * @param {string} [message=`Walking ${dir}`] - The message to display with the progress bar.
 * @returns {Promise<void>}
 */

export async function walkMod(
  dir: string,
  run: (mod: string) => Promise<void>,
  ext: RegExp = /\.tsx?$/,
  skipFiles: (string | RegExp)[] = ['perm.ts'],
  message: string = `Walking ${dir}`,
) {
  const files = await collectAllFiles(dir, ext, skipFiles)
  const { length } = files

  const pb = $.progress(message, { length })

  await pb.with(async () => {
    for (const file of files) {
      await runModule(file, run, pb)
    }
  })
}

/**
 * Utility function to determine if a file should be skipped.
 *
 * @param {string} fileName - The name of the file to check.
 * @param {Array<string | RegExp>} skipPatterns - The list of patterns to skip (strings or regex).
 * @returns {boolean} - Returns true if the file should be skipped.
 */
export function shouldSkip(
  fileName: string,
  skipPatterns: Array<string | RegExp>,
): boolean {
  return skipPatterns.some((pattern) => {
    if (typeof pattern === 'string') {
      return pattern === fileName
    } else if (pattern instanceof RegExp) {
      return pattern.test(fileName)
    }
    return false
  })
}

/**
 * Collects all files in a directory matching the provided extension and excluding specific files.
 *
 * @param {string} dir - The directory to search.
 * @param {RegExp} ext - The file extension regex to match.
 * @param {Array<string | RegExp>} skipFiles - The files or patterns to exclude.
 * @returns {Promise<string[]>} - A promise that resolves to a list of file paths.
 */
export async function collectAllFiles(
  dir: string,
  ext: RegExp,
  skipFiles: Array<string | RegExp>,
): Promise<string[]> {
  const files: string[] = []
  for await (
    const entry of walk(dir, {
      match: [ext],
    })
  ) {
    if (entry.isFile && !shouldSkip(entry.name, skipFiles)) {
      files.push(entry.path)
    }
  }
  return files
}

export default walkMod
