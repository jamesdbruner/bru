import { $, dirname, ensureDir, existsSync, join, log, parseYaml } from 'bru'
import { CACHE_PATH } from 'helpers/caching/cache.ts'
import { HashTable } from '@/types.ts'
import { HASHTABLE_PATH } from 'helpers/caching/hashtable.ts'

export async function copyCachedFiles(
  path: string = './docs/src/content/docs/',
  selectedDirectories: string[],
  ext: string = '.ts',
) {
  // Ensure the base directory exists
  await Deno.mkdir(`${Deno.cwd()}/${path}`, { recursive: true }).catch(
    (error) => {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        log.error(`Error creating directory: ${error}`)
        throw error
      }
    },
  )

  await existsSync(HASHTABLE_PATH)

  const content = await Deno.readTextFile(HASHTABLE_PATH)
  const hashTable = parseYaml(content) as HashTable

  const relativeDirectories = selectedDirectories.map((dir) =>
    dir.replace(Deno.cwd(), '').replace(/^\//, '')
  )

  const progressBar = $.progress('Copying Cached Files', {
    length: relativeDirectories.length,
  })

  try {
    await progressBar.with(async () => {
      for (const dir of relativeDirectories) {
        if (hashTable[dir]) {
          for (const subdir in hashTable[dir]) {
            const files = hashTable[dir][subdir]
            for (const file of files) {
              const fileMD = file.replace(ext, '.mdx')
              const srcPath = join(CACHE_PATH, dir, subdir, fileMD)
              const destPath = join(path, dir, subdir, fileMD)

              await ensureDir(dirname(destPath))
              await Deno.copyFile(srcPath, destPath)
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
