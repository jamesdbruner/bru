/**
 * Asynchronously saves content to a file.
 *
 * @async
 * @function saveFile
 * @param {string} content - The content to save.
 * @param {string} [name] - An optional name for the file. If not provided, the user will be prompted for a name.
 * @returns {Promise<void>} Returns a Promise that fulfills when the file is saved or fails with an error.
 */

import { $, fs, log, overwrite } from 'bru'

async function saveFile(content: string, name?: string) {
  const fileName = name ||
    await $.prompt('Enter the file name (including extension):')
  const filePath = `${Deno.cwd()}/${fileName}`

  // Check if the file exists before confirming overwrite
  if (await fs.exists(filePath)) {
    if (!(await overwrite(filePath))) {
      log('Exiting without overwriting the file')
      Deno.exit(1)
    }
  }

  // Write to the file
  try {
    await Deno.writeTextFile(filePath, content)
    log(`Response saved to ${fileName}`)
  } catch (error) {
    log.error(`An error occurred while saving the file: ${error.message}`)
  }
}

export default saveFile
