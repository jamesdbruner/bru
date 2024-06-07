/**
 * Asynchronously saves content to a file.
 *
 * @async
 * @function saveFile
 * @param {string} content - The content to save.
 * @param {string} [name] - An optional name for the file. If not provided, the user will be prompted for a name.
 * @returns {Promise<void>} Returns a Promise that fulfills when the file is saved or fails with an error.
 */

import { $, log, overwrite } from 'bru'

async function saveFile(content: string, name?: string): Promise<void> {
  const fileName = name ||
    await $.prompt('Enter the file name (including extension):')
  const filePath = `${Deno.cwd()}/${fileName}`

  // Check if the file exists before confirming overwrite
  try {
    await Deno.stat(filePath)
    // If the file exists, ask for confirmation to overwrite
    if (!(await overwrite(filePath))) {
      log('Exiting without overwriting the file')
      Deno.exit(1)
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // No action needed; the file does not exist, so we can proceed to write it
    } else {
      // An unexpected error occurred
      log.error(
        `An error occurred while checking the ${filePath} ${error.message}`,
      )
      Deno.exit(1)
    }
  }

  console.log('\n')

  // Write to the file
  try {
    await Deno.writeTextFile(filePath, content)
    log(`File saved %c${filePath}`, {
      styles: 'font-weight: bold; color: blue;',
    })
  } catch (error) {
    log.error(`An error occurred while saving ${filePath} ${error.message}`)
  }
}

export default saveFile
