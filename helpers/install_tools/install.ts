/**
 * Deno module for installing other Deno modules with specified permissions.
 * The module reads permission requirements from separate permission files and installs each module
 * using Deno's install command, applying the necessary permission flags.
 *
 * @module ModuleInstaller
 */

import { $, getModulePermissions, log, srcDir, walk } from 'bru'

const timeout = parseInt(Deno.args[0]) || 10

/**
 * Installs a Deno module with the specified permissions.
 *
 * @param {string} name - The name of the module to install.
 * @param {boolean} [force=false] - Whether to force the installation.
 * @returns {Promise<string | null>} - A message if installation fails or is skipped, otherwise null.
 */
async function install(name: string, force = false): Promise<string | null> {
  const moduleURL = new URL(`../../modules/${name}/mod.ts`, import.meta.url)
  const permFileURL = new URL(`../../modules/${name}/perm.ts`, import.meta.url)
  const permissions = await getModulePermissions(permFileURL.href)

  const modName = permissions.options.name || name

  if (!permissions.options.install) return `skip ${name}`

  await new Promise((resolve) => setTimeout(resolve, timeout))

  const permissionFlags = Object.entries(permissions.default).reduce(
    (flags: string[], [perm, allowed]) => {
      if (allowed) {
        flags.push(`--allow-${perm}`)
      }
      return flags
    },
    [],
  )

  try {
    await $`deno install -n ${modName} ${permissionFlags} ${
      force ? '-f' : ''
    } ${moduleURL.href} --import-map=import_map.json -g`.quiet()
    return null
  } catch (error) {
    if (!force) {
      return install(name, true)
    } else {
      return `Failed to install ${modName}: ${error.message}`
    }
  }
}

/**
 * Installs all Deno modules found in the src directory.
 *
 * @returns {Promise<void>}
 */
async function installMods(): Promise<void> {
  const modules: string[] = []
  const errors: string[] = []
  const skipped: string[] = []

  for await (const entry of walk(srcDir, { maxDepth: 1 })) {
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
    log(`Skipped modules: ${skipped.join(', ')}`)
  }

  log(
    '✅ Installation complete \n\nRun "deno task list" to see available commands',
  )
}

await installMods()
