/**
 * Creates symbolic links for the selected dirs in the specified output directory.
 *
 * @param {string[]} dirs - The dirs to link.
 * @param {string} outputDir - The output directory path.
 * @returns {Promise<void>}
 */

import { $, log } from 'bru'

export async function linkDirs(
  dirs: string[],
  outputDir: string,
) {
  const progressBar = $.progress('Linking dirs...', {
    length: dirs.length,
  })

  log(`Linking dirs to ${outputDir}`)

  try {
    await progressBar.with(async () => {
      for (const dir of dirs) {
        try {
          log(`Linking ${dir} to ${outputDir}`)
          await Deno.symlink(dir, outputDir)
        } catch (error) {
          if (error instanceof Deno.errors.NotFound) {
            log.error(`Directory not found: ${dir}`)
          } else if (error instanceof Deno.errors.AlreadyExists) {
            log.error(`Link already exists: ${outputDir}`)
          } else {
            log.error(`Error linking ${dir} to ${outputDir}: ${error}`)
            throw error
          }
        }
        progressBar.increment()
      }
    })
  } catch (error) {
    log.error(`Error linking dirs: ${error}`)
  } finally {
    progressBar.finish()
  }
}

export default linkDirs
