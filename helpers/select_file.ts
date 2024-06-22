import { $, join } from 'bru'

/**
 * Recursively navigates directories and selects a file.
 *
 * @param {string} currentDir - The current directory path.
 * @returns {Promise<string>} - The selected file path.
 */
async function navigateAndSelect(currentDir: string): Promise<string> {
  while (true) {
    const contents = []
    for await (const dirEntry of Deno.readDir(currentDir)) {
      if (!dirEntry.name.startsWith('.')) { // Hide dot files
        contents.push({
          name: dirEntry.name,
          isDirectory: dirEntry.isDirectory,
        })
      }
    }

    // Sort folders on top and then files, both alphabetically
    contents.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1
      if (!a.isDirectory && b.isDirectory) return 1
      return a.name.localeCompare(b.name)
    })

    const choices = contents.map((entry) => ({
      name: entry.name + (entry.isDirectory ? '/' : ''),
      value: entry.name,
    }))

    choices.unshift({ name: '..', value: '..' })

    const selectedIndex = await $.select({
      message: 'Select a file',
      options: choices.map((choice) => choice.name),
    })

    const selected = choices[selectedIndex].value

    if (selected === '..') {
      currentDir = join(currentDir, '..')
    } else {
      const selectedPath = join(currentDir, selected)
      const stat = await Deno.stat(selectedPath)
      if (stat.isDirectory) {
        currentDir = selectedPath
      } else {
        return selectedPath
      }
    }
  }
}

/**
 * Creates a UI for navigating directories and selecting a file.
 *
 * @returns {Promise<string>} - The selected file path.
 */
export default async function selectFile(): Promise<string> {
  const currentDir = Deno.cwd()
  const selectedFile = await navigateAndSelect(currentDir)
  return selectedFile
}
