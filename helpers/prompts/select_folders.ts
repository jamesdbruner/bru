/**
 * Presents a multi-select prompt to the user for selecting directories within a specified path.
 * Only visible directories (i.e., those not starting with a dot) are listed for selection.
 * This function is useful for interactive applications where users need to choose one or more directories
 * from the current working directory or a specified path.
 *
 * @export
 * @async
 * @param {Object} params - The parameters for the function.
 * @param {boolean} [params.single=false] - If true, only allow the selection of one directory and immediately return the selection.
 * @param {string} [params.currentPath=Deno.cwd()] - The directory path where the selection will begin. Defaults to the current working directory.
 * @returns {Promise<string[]>} A promise that resolves to an array of the full paths of the selected directories.
 * Each selected directory's full path is constructed by joining the `currentPath` with the selected directory name.
 * @example
 * selectFolders({ currentPath: '/path/to/start', single: true }).then(selectedPaths => {
 *   console.log('Selected directories:', selectedPaths);
 * }).catch(error => {
 *   console.error('Error selecting folders:', error);
 * });
 */

import { $, join } from 'bru'

interface SelectFoldersParams {
  single?: boolean
  currentPath?: string
}

export async function selectFolders({
  single = false,
  currentPath = Deno.cwd(),
}: SelectFoldersParams = {}): Promise<string[]> {
  const entries: string[] = []

  // Read the current directory and filter for visible folders only
  for await (const entry of Deno.readDir(currentPath)) {
    // Skip hidden files and folders (those starting with a dot)
    if (entry.isDirectory && !entry.name.startsWith('.')) {
      entries.push(entry.name)
    }
  }

  if (entries.length === 0) {
    throw new Error(`No directories found in ${currentPath}`)
  }

  if (single) {
    // Show a select prompt to the user to select one directory
    const selectedIndex = await $.select({
      message: `Select a directory (${currentPath}):`,
      options: entries,
    })

    // Return the full path of the selected folder
    return [join(currentPath, entries[selectedIndex])]
  } else {
    // Show a multi-select prompt to the user to select directories
    const selectedIndices = await $.multiSelect({
      message: `Select at least one directory (${currentPath}):`,
      options: entries,
    })

    // Gather selected folder paths based on indices
    const selectedFolders = selectedIndices.map((index) => entries[index])

    // Return the full paths of selected folders
    return selectedFolders.map((folder) => join(currentPath, folder))
  }
}

export default selectFolders
