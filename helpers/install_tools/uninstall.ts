import { $, denoBin, fs, log } from 'bru'

const src = './modules'
const timeout = parseInt(Deno.args[0]) || 0 // Timeout can be passed as a Deno argument

async function listInstalledModules() {
  const installed = new Set()
  for await (const dirEntry of Deno.readDir(denoBin)) {
    installed.add(dirEntry.name)
  }
  return installed
}

async function uninstall(name: string): Promise<string | null> {
  await new Promise((resolve) => setTimeout(resolve, timeout)) // Artificial delay

  try {
    await $`deno uninstall ${name}`.quiet()
    return null // Indicates successful uninstallation
  } catch (error) {
    return `Failed to uninstall ${name}: ${error.message}`
  }
}

async function uninstallAll() {
  const installedModules = await listInstalledModules()
  const modulesToUninstall = []
  const errors = []

  for await (const entry of fs.walk(src, { maxDepth: 1 })) {
    if (entry.isDirectory && installedModules.has(entry.name)) {
      modulesToUninstall.push(entry.name)
    }
  }

  const pb = $.progress('Uninstalling modules', {
    length: modulesToUninstall.length,
  })

  for (const name of modulesToUninstall) {
    const result = await uninstall(name)
    if (result) errors.push(result)
    pb.increment()
  }

  pb.finish()

  if (errors.length > 0) {
    log('Errors occurred during uninstallation:')
    errors.forEach((e) => log(e))
  }

  log(
    `✓ Uninstall complete \n\nRun "deno task list" to see available commands`,
  )
}

await uninstallAll()
