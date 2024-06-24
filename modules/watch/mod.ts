import { log, selectFolders } from 'bru'

/**
 * Watches specified directories for file changes and triggers a callback function.
 *
 * @param {string[]} dirs - The directories to watch.
 * @param {(path: string, changeCount: number) => Promise<void>} callback - The callback function to trigger on file change.
 * @returns {Promise<void>}
 */
async function watchDirs(
  dirs: string[],
  callback: (path: string, changeCount: number) => Promise<void>,
) {
  let changeCount = 0
  const changedFiles = new Set<string>()

  for (const dir of dirs) {
    const watcher = Deno.watchFs(dir)
    log(`Watching directory: ${dir}`)

    for await (const event of watcher) {
      for (const path of event.paths) {
        if (!changedFiles.has(path)) {
          changeCount++
          changedFiles.add(path)
          console.clear()
          await callback(path, changeCount)
          setTimeout(() => changedFiles.delete(path), 100)
        }
      }
    }
  }
}

/**
 * Example callback function to handle file changes.
 *
 * @param {string} path - The path of the changed file.
 * @param {number} changeCount - The count of file changes.
 * @returns {Promise<void>}
 */
async function handleFileChange(path: string, changeCount: number) {
  // Implement your file change handling logic here
  log(`Changed file: %c${path}`, {
    styles: 'font-weight: bold;color: blue; ',
  })
  log(`Number of changes: %c${changeCount}`, {
    styles: 'font-weight: bold;color: yellow; ',
  })
}

export async function main() {
  const path = String((await selectFolders({ single: true }))[0])

  // Check if the path is a file or a directory
  const stat = await Deno.stat(path)
  if (stat.isDirectory) {
    await watchDirs([path], handleFileChange)
  } else {
    log('The provided path is not a directory.')
  }
}

main()
