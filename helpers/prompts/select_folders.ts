/**
 * Presents a multi-select prompt to the user for selecting directories within a specified path.
 * Only visible directories (i.e., those not starting with a dot) are listed for selection.
 * This function is useful for interactive applications where users need to choose one or more directories
 * from the current working directory or a specified path.
 *
 * @export
 * @async
 * @param {string} [currentPath=Deno.cwd()] The directory path where the selection will begin. Defaults to the current working directory.
 * @returns {Promise<string[]>} A promise that resolves to an array of the full paths of the selected directories.
 * Each selected directory's full path is constructed by joining the `currentPath` with the selected directory name.
 * @example
 * selectFolders('/path/to/start').then(selectedPaths => {
 *   console.log('Selected directories:', selectedPaths);
 * }).catch(error => {
 *   console.error('Error selecting folders:', error);
 * });
 */

import { $, join } from 'bru'

interface Entry {
  text: string
  value: string
}

export async function selectFolders(
  currentPath: string = Deno.cwd(),
): Promise<string[]> {
  const entries: Entry[] = []

  // Read the current directory and filter for visible folders only
  for await (const entry of Deno.readDir(currentPath)) {
    // Skip hidden files and folders (those starting with a dot)
    if (entry.isDirectory && !entry.name.startsWith('.')) {
      entries.push({
        text: entry.name,
        value: entry.name,
      })
    }
  }

  if (entries.length === 0) {
    throw new Error(`No directories found in ${currentPath}`)
  }

  // Show a multi-select prompt to the user to select directories
  const selectedIndices = await $.multiSelect({
    message: `Select at least one directory (${currentPath}):`,
    options: entries,
  })

  // Gather selected folder paths based on indices
  const selectedFolders = selectedIndices.map((index) => entries[index].value)

  // Return the full paths of selected folders
  return selectedFolders.map((folder) => join(currentPath, folder))
}

export default selectFolders
