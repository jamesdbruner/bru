import { $, denoBin, getModulePermissions, log, walk } from 'bru'

const src = './modules'
// Timeout can be passed as a Deno argument
const timeout = parseInt(Deno.args[0]) || 0

async function listInstalledModules() {
  const installed = new Set()
  for await (const dirEntry of Deno.readDir(denoBin)) {
    installed.add(dirEntry.name)
  }
  return installed
}

async function uninstall(name: string): Promise<string | null> {
  // Artificial delay
  await new Promise((resolve) => setTimeout(resolve, timeout))

  try {
    await $`deno uninstall ${name} -g`.quiet()
    // Indicates successful uninstallation
    return null
  } catch (error) {
    return `Failed to uninstall ${name}: ${error.message}`
  }
}

async function uninstallAll() {
  const installedModules = await listInstalledModules()
  const modulesToUninstall: string[] = []
  const errors: string[] = []

  for await (const entry of walk(src, { maxDepth: 1 })) {
    if (!entry.isDirectory || entry.name === 'modules') continue
    const permFileURL = new URL(
      `../../modules/${entry.name}/perm.ts`,
      import.meta.url,
    )
    const permissions = await getModulePermissions(permFileURL.href)
    const moduleName = permissions.options.name || entry.name

    if (installedModules.has(moduleName)) {
      modulesToUninstall.push(moduleName)
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
