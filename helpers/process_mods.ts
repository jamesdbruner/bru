/**
 * Processes multiple directories to apply a function to files matching a regex pattern.
 *
 * @param {string[]} dirs - The array of directory paths to process.
 * @param {function} func - The function to apply to each matching file.
 * @param {RegExp} [ext=/.tsx/] - The regular expression pattern for file extensions to filter by.
 * @param {string[]} [skipFiles=['perm.ts']] - The list of files to skip.
 * @param {string} message - The message to display during processing.
 * @returns {Promise<void>}
 */

import { walkMod } from 'bru'

export async function processMods(
  dirs: string[],
  func: (filePath: string, ext: string) => void,
  ext: RegExp = /.ts/,
  skipFiles: string[] = ['perm.ts'],
  message: string,
) {
  await Promise.all(dirs.map(async (dir) => {
    await walkMod(
      dir,
      async (filePath) => {
        if (
          new RegExp(ext).test(filePath) && !skipFiles.includes(filePath)
        ) {
          await func(filePath, filePath.split('.').pop() || '')
        }
      },
      ext,
      skipFiles,
      message,
    )
  }))
}

export default processMods
