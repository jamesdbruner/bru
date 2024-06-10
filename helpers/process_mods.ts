import { walkMod } from 'bru'

/**
 * Processes multiple directories to generate MDX documentation for TypeScript files.
 *
 * @param {string[]} dirs - The array of directory paths to process.
 * @param {string} [ext='.tsx'] - The file extension to filter by.
 * @returns {Promise<void>}
 */
export async function processMods(
  dirs: string[],
  func: (filePath: string, ext: string) => void,
  ext: string = '.tsx',
  skipFiles: string[] = ['perm.ts'],
  message: string,
) {
  await Promise.all(dirs.map(async (dir) => {
    await walkMod(
      dir,
      async (filePath) => {
        await func(filePath, ext)
      },
      ext,
      skipFiles,
      message,
    )
  }))
}

export default processMods
