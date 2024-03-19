/**
 * Deno module for installing other Deno modules with specified permissions.
 * The module reads permission requirements from separate permission files and installs each module
 * using Deno's install command, applying the necessary permission flags.
 *
 * @module ModuleInstaller
 */

import { $, fs, log } from 'bru'

const src = './modules'
const timeout = parseInt(Deno.args[0]) || 10

async function getModulePermissions(
  permFileURL: URL,
): Promise<Record<string, string>> {
  try {
    const permissionsModule = await import(permFileURL.href)
    return permissionsModule.default || {}
  } catch (error) {
    log.error(
      `Error reading permissions from ${permFileURL.href}: ${error.message}`,
    )
    return {}
  }
}

async function install(name: string, force = false): Promise<string | null> {
  const moduleURL = new URL(`../../modules/${name}/mod.ts`, import.meta.url)
  const permFileURL = new URL(`../../modules/${name}/perm.ts`, import.meta.url)
  const permissions = await getModulePermissions(permFileURL)

  if (permissions.skipInstall) return `skip ${name}`

  await new Promise((resolve) => setTimeout(resolve, timeout))

  const permissionFlags = Object.entries(permissions).reduce(
    (flags: string[], [perm, allowed]) => {
      if (allowed) {
        flags.push(`--allow-${perm}`)
      }
      return flags
    },
    [],
  )

  try {
    await $`deno install -n ${name} ${permissionFlags} ${
      force ? '-f' : ''
    } ${moduleURL.href} --import-map=import_map.json`.quiet()
    return null
  } catch (error) {
    if (!force) {
      return install(name, true)
    } else {
      return `Failed to install ${name}: ${error.message}`
    }
  }
}

// The rest of your installMods and supporting functions would remain unchanged.

async function installMods() {
  const modules = []
  const errors = []
  const skipped: string[] = []

  for await (const entry of fs.walk(src, { maxDepth: 1 })) {
    if (!entry.isDirectory || entry.name === 'modules') continue
    modules.push(entry.name)
  }

  const pb = $.progress('Installing modules', { length: modules.length })

  for (const name of modules) {
    const result = await install(name)
    if (result) {
      if (result.startsWith('skip')) {
        skipped.push(result.replace('skip ', ''))
      } else {
        errors.push(result)
      }
    }
    pb.increment()
  }

  pb.finish()

  if (errors.length > 0) {
    log('Errors:')
    errors.forEach((e) => log(e))
  }

  if (skipped.length > 0) {
    log(`Skipped modules: ${skipped.map((s) => s.split(', '))}`)
  }

  log(
    '✓ Installation complete \n\nRun "deno task list" to see available commands',
  )
}

await installMods()
