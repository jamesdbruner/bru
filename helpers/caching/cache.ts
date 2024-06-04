import { basename, dirname, extname, join, log, removeFromHashTable } from 'bru'

export const CACHE_PATH = join(Deno.cwd(), '/.cache/')

export async function writeToCache(
  filePath: string,
  content: string,
  ext: string = '.txt',
): Promise<void> {
  const baseName = basename(filePath, extname(filePath)) + ext
  const fullCachePath = join(CACHE_PATH, dirname(filePath), baseName)

  await Deno.writeTextFile(fullCachePath, content)
}

export async function readFromCache(
  filePath: string,
  ext: string = '.txt',
): Promise<string> {
  const baseName = basename(filePath, extname(filePath)) + ext
  const fullCachePath = join(CACHE_PATH, dirname(filePath), baseName)

  try {
    return await Deno.readTextFile(fullCachePath)
  } catch {
    throw new Error('Cache miss')
  }
}

export async function removeFromCache(
  filePath: string,
  ext: string = '.txt',
): Promise<void> {
  const baseName = basename(filePath, extname(filePath)) + ext
  const fullCachePath = join(CACHE_PATH, dirname(filePath), baseName)

  try {
    // Remove the file from the filesystem
    await Deno.remove(fullCachePath)
    log(`Removed file from cache: ${fullCachePath}`)
    await removeFromHashTable(dirname(filePath))
  } catch (error) {
    throw new Error('Failed to remove item from cache: ' + error)
  }
}
