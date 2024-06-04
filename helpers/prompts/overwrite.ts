/**
 * Checks if a file already exists and confirms with the user if they want to overwrite it.
 *
 * @export
 * @async
 * @param {string} fileName The name of the file to check.
 * @param {string} [message=`File ${fileName} already exists. Overwrite?`] The message to display to the user.
 * @returns {Promise<boolean>} Promise that resolves to a boolean. If true, file should be overwritten. If false, operation should be aborted.
 */

import { $, existsSync } from 'bru'

export default async function promptOverwrite(
  fileName: string,
  message = `File ${fileName} already exists. Overwrite?`,
): Promise<boolean> {
  if (await existsSync(fileName)) {
    const overwrite = await $.confirm(
      message,
      {
        default: false,
      },
    )
    return overwrite
  }
  return true // If file doesn't exist, proceed
}
