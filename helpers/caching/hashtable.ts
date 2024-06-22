import type { HashTable } from '@/types.ts'
import {
  basename,
  CACHE_PATH,
  existsSync,
  join,
  log,
  NAME,
  parseYaml,
  stringify,
} from 'bru'

export const HASHTABLE_PATH = join(CACHE_PATH, `${NAME}_hashtable.yml`)

/**
 * Updates the hash table with a new entry, maintaining a nested directory structure.
 *
 * @param {string} entry - The new entry to add to the hash table.
 * @returns {Promise<void>}
 */
export async function updateHashTable(entry: string): Promise<void> {
  try {
    const hashTable: HashTable = await ensureHashTable()

    const [category, ...pathParts] = entry.split('/')
    const subdir = pathParts.slice(0, -1).join('/')
    const fileName = basename(entry)

    if (!hashTable[category]) {
      hashTable[category] = {}
    }
    if (!hashTable[category][subdir || '']) {
      hashTable[category][subdir || ''] = []
    }
    if (!hashTable[category][subdir || ''].includes(fileName)) {
      hashTable[category][subdir || ''].push(fileName)
    }

    // Convert the updated hash table back into a YAML string
    try {
      const yamlData = stringify(hashTable, { lineWidth: -1, indent: 2 })

      await Deno.writeTextFile(HASHTABLE_PATH, yamlData)
    } catch (error) {
      log.error(`Failed to serialize or write hash table: ${error}`)
    }
  } catch (error) {
    log.error(`Error updating hash table: ${error}`)
  }
}

/**
 * Checks the hash table for a given key.
 *
 * @param {string} key - The key to check in the hash table.
 * @returns {Promise<string | null>} The file path if found, otherwise null.
 */
export async function checkHashTable(key: string): Promise<string | null> {
  try {
    const hashTable: HashTable = await ensureHashTable()

    const [category, ...pathParts] = key.split('/')
    const subdir = pathParts.slice(0, -1).join('/')
    const filename = basename(key)

    if (hashTable[category] && hashTable[category][subdir || '']) {
      if (hashTable[category][subdir || ''].includes(filename)) {
        return join(category, subdir, filename)
      }
    }
    return null
  } catch {
    // Treat errors as cache misses
    return null
  }
}

/**
 * Removes an entry from the hash table.
 *
 * @param {string} filePath - The full file path of the entry to remove.
 * @returns {Promise<void>}
 */
export async function removeFromHashTable(filePath: string): Promise<void> {
  try {
    const hashTable: HashTable = await ensureHashTable()

    const [category, ...pathParts] = filePath.split('/')
    const subdir = pathParts.slice(0, -1).join('/')
    const fileName = basename(filePath)

    const files = hashTable[category]?.[subdir]
    if (files) {
      const index = files.indexOf(fileName)
      if (index > -1) {
        files.splice(index, 1)
        if (files.length === 0) {
          delete hashTable[category][subdir]
          if (Object.keys(hashTable[category]).length === 0) {
            delete hashTable[category]
          }
        }
        await Deno.writeTextFile(
          HASHTABLE_PATH,
          stringify(hashTable, { lineWidth: -1, indent: 2 }),
        )
      }
    }
  } catch (error) {
    log.error(`Error removing item from hash table: ${error}`)
  }
}

/**
 * Ensures the hash table file exists, reads its content, and parses it into a HashTable object.
 *
 * @returns {Promise<HashTable>} The parsed hash table.
 */
export async function ensureHashTable(): Promise<HashTable> {
  let hashTable = {} as HashTable

  const hasHashTable = await existsSync(HASHTABLE_PATH)

  if (hasHashTable) {
    const yamlContent = await Deno.readTextFile(HASHTABLE_PATH)

    // Parse YAML content, handle empty or malformed YAML
    try {
      const parsedContent = parseYaml(yamlContent) || {}
      if (typeof parsedContent === 'object' && parsedContent !== null) {
        hashTable = parsedContent as HashTable
      }
    } catch (parseError) {
      log.error(`Failed to parse YAML content: ${parseError}`)
    }
  }

  return hashTable
}
