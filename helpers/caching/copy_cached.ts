/**
 * Copies cached files to the specified output directory.
 *
 * @param {string} path - The output directory path.
 * @param {string[]} selectedDirs - The directories to copy from the cache.
 * @param {string} ext - The file extension to filter by.
 * @returns {Promise<void>}
 */

import {
  $,
  CACHE_PATH,
  dirname,
  ensureDir,
  existsSync,
  HASHTABLE_PATH,
  join,
  log,
  parseYaml,
} from 'bru'
import type { HashTable } from '@/types.ts'

export async function copyCachedFiles(
  path: string,
  selectedDirs: string[],
) {
  // Ensure the base directory exists
  await Deno.mkdir(path, { recursive: true }).catch(
    (error) => {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        log.error(`Error creating directory: ${error}`)
        throw error
      }
    },
  )

  if (!existsSync(HASHTABLE_PATH)) {
    log.error(`Hash table path does not exist: ${HASHTABLE_PATH}`)
    return
  }

  const content = await Deno.readTextFile(HASHTABLE_PATH)
  const hashTable = parseYaml(content) as HashTable

  const relativeDirs = selectedDirs.map((dir) =>
    dir.replace(Deno.cwd(), '').replace(/^\//, '')
  )

  const progressBar = $.progress('Copying Cached Files', {
    length: relativeDirs.length,
  })

  try {
    await progressBar.with(async () => {
      for (const dir of relativeDirs) {
        if (hashTable[dir]) {
          for (const subdir in hashTable[dir]) {
            const files = hashTable[dir][subdir]
            for (const file of files) {
              const srcPath = join(CACHE_PATH, dir, subdir)
              const destPath = join(path, dir, subdir, file)

              try {
                await ensureDir(dirname(destPath))
                await Deno.copyFile(srcPath, destPath)
              } catch (error) {
                if (error instanceof Deno.errors.NotFound) {
                  log.error(`File not found: ${srcPath}`)
                } else {
                  log.error(
                    `Error copying file ${srcPath} to ${destPath}: ${error}`,
                  )
                  throw error
                }
              }
            }
          }
        }
        progressBar.increment()
      }
    })
  } catch (error) {
    log.error(`Error copying cached files: ${error}`)
  } finally {
    progressBar.finish()
  }
}

export default copyCachedFiles
