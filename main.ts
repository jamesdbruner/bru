import { $, log, walk } from 'bru'

const formatName = (name: string) =>
  name.replace(/\/mod$/, '').replace(/\.ts$/, '').split('/').pop() || ''

// Use new URL() to construct a path relative to the current script's location
const scriptDir = new URL('.', import.meta.url).pathname
const modulesDir = `${scriptDir}modules/`

async function listModules(directory: string): Promise<string[]> {
  const scripts = new Set<string>()

  for await (
    const entry of walk(directory, { exts: ['.ts'], maxDepth: 2 })
  ) {
    if (entry.isFile) {
      if (entry.name === 'mod.ts' || entry.path.split('/').length === 2) {
        const formattedPath = entry.path
          .replace(directory + '/', '')
          .replace('.ts', '')
          .replace('modules/', '')
        scripts.add(formattedPath)
      }
    }
  }

  return Array.from(scripts)
}

async function main() {
  const modules = await listModules(modulesDir)
  const options = modules.map(formatName)

  const selected = await $.select({
    message: 'Select a module to run:',
    options,
  })

  if (selected !== null) {
    const modPath =
      new URL(`./modules/${options[selected]}/mod.ts`, import.meta.url).href

    await import(modPath)
  } else {
    throw new Error('No module selected or module does not exist.')
  }
}

// Error handling wrapper
async function withErrorHandling(fn: () => Promise<void>) {
  try {
    await fn()
  } catch (error) {
    log.error(error)
    throw error
  }
}

if (import.meta.main) {
  await withErrorHandling(main)
}
