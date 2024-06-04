/**
 * Module for compiling Deno modules for different target platforms.
 * It walks through the modules directory, checks each module's permissions,
 * and compiles them for the specified target platform using Deno's compile command.
 *
 * The compilation target can be specified via command-line arguments when running this script.
 *
 * @module ModuleCompiler
 */

import type { DenoPermissions } from '@/types.ts'
import {
  $,
  binDir,
  ensureDir,
  getModulePermissions,
  log,
  srcDir,
  walk,
} from 'bru'

/**
 * Gets a friendly target name based on the provided target string.
 *
 * @param {string} target - The target string.
 * @returns {string} - The friendly target name.
 */
function getFriendlyTargetName(target: string): string {
  const targetMap: { [key: string]: string } = {
    'x86_64-apple-darwin': 'macos',
    'x86_64-unknown-linux-gnu': 'linux',
    'x86_64-pc-windows-msvc': 'windows',
  }
  return targetMap[target] || target
}

/**
 * Compiles a Deno module with the specified permissions for the target platform.
 *
 * @param {string} filePath - The path to the module file.
 * @param {string} moduleName - The name of the module.
 * @param {string} target - The target platform.
 * @param {DenoPermissions} permissions - The permissions required for the module.
 * @returns {Promise<void>}
 */
async function compileModule(
  filePath: string,
  moduleName: string,
  target: string,
  permissions: DenoPermissions,
): Promise<void> {
  const commandArgs = constructDenoCompileCommandArgs(
    filePath,
    moduleName,
    target,
    permissions,
  )

  try {
    await $`deno compile ${commandArgs}`.quiet()
  } catch (error) {
    log.error(`Failed to compile ${moduleName}: ${error.message}`)
  }
}

/**
 * Constructs the command arguments for compiling a Deno module.
 *
 * @param {string} filePath - The path to the module file.
 * @param {string} moduleName - The name of the module.
 * @param {string} target - The target platform.
 * @param {DenoPermissions} permissions - The permissions required for the module.
 * @returns {string[]} - The command arguments.
 */
function constructDenoCompileCommandArgs(
  filePath: string,
  moduleName: string,
  target: string,
  permissions: DenoPermissions,
): string[] {
  const permissionArgs = Object.entries(permissions).reduce(
    (flags: string[], [perm, allowed]) => {
      if (allowed) {
        flags.push(`--allow-${perm}`)
      }
      return flags
    },
    [],
  )

  return [
    ...permissionArgs,
    `--output=${binDir}/${getFriendlyTargetName(target)}/${moduleName}`,
    `--target=${target}`,
    filePath,
  ]
}

/**
 * Compiles all Deno modules found in the src directory for the specified target platform.
 *
 * @param {string} target - The target platform.
 * @returns {Promise<void>}
 */
async function compileModules(target: string): Promise<void> {
  await ensureDir(binDir)

  const modules: string[] = []
  for await (const entry of walk(srcDir, { maxDepth: 1 })) {
    if (!entry.isDirectory || entry.name === 'modules') continue
    modules.push(entry.name)
  }

  const pb = $.progress(
    `Compiling modules for ${getFriendlyTargetName(target)}`,
    { length: modules.length },
  )

  await pb.with(async () => {
    for (const name of modules) {
      const moduleFilePath = new URL(
        `../../modules/${name}/mod.ts`,
        import.meta.url,
      )
      const permFilePath = new URL(
        `../../modules/${name}/perm.ts`,
        import.meta.url,
      )

      const result = await getModulePermissions(permFilePath.href)
      const { options, default: perms } = result

      // Compile module if compile option is true
      if (options.compile) {
        await compileModule(
          moduleFilePath.href,
          name,
          target,
          perms,
        )
      }
      pb.increment()
    }
  })

  pb.finish()
}

const target = Deno.args.find((arg) => arg.startsWith('--target='))
  ?.split('=')[1] ?? ''

await compileModules(target)

log('✓ Compilation complete')
