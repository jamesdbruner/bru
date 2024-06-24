/**
 * Runs a given module and updates the progress bar.
 *
 * @param {string} mod - The module to run.
 * @param {function(string): Promise<void>} run - The function to execute the module.
 * @param {ProgressBar} pb - The progress bar to update.
 * @returns {Promise<void>}
 */

import { $, log, ProgressBar, walk } from 'bru'

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
  skipFiles: string[] = ['perm.ts'],
  message: string = `Walking ${dir}`,
) {
  const files = await collectAllFiles(dir, ext, skipFiles)
  const length = files.length - skipFiles.length
  const pb = $.progress(message, { length })

  await pb.with(async () => {
    for (const file of files) {
      await runModule(file, run, pb)
    }
  })
}

/**
 * Collects all files in a directory matching the provided extension and excluding specific files.
 *
 * @param {string} dir - The directory to search.
 * @param {RegEx} ext - The file extension regex to match.
 * @param {string[]} skipFiles - The files to exclude.
 * @returns {Promise<string[]>} - A promise that resolves to a list of file paths.
 */

export async function collectAllFiles(
  dir: string,
  ext: RegExp,
  skipFiles: string[],
): Promise<string[]> {
  const files: string[] = []
  for await (
    const entry of walk(dir, {
      match: [ext],
    })
  ) {
    if (entry.isFile && !skipFiles.includes(entry.name)) {
      files.push(entry.path)
    }
  }
  return files
}

export default walkMod
