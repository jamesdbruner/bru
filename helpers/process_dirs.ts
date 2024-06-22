/**
 * Processes multiple directories to generate output for files with the specified extension.
 *
 * @param {string[]} dirs - The array of directory paths to process.
 * @param {Function} fileProcessor - The function to process each file.
 * @param {RegExp} ext - The file extension to filter by.
 * @param {string} message - The progress message.
 * @returns {Promise<void>}
 */

import { walkMod } from 'bru'

export async function processDirs(
  dirs: string[],
  fileProcessor: (filePath: string, ext: RegExp) => Promise<void>,
  ext: RegExp = /.tsx/,
  message: string,
) {
  await Promise.all(dirs.map(async (dir) => {
    await walkMod(
      dir,
      async (filePath) => {
        await fileProcessor(filePath, ext)
      },
      ext,
      ['perm.ts'],
      message,
    )
  }))
}

export default processDirs
