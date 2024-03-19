/**
 * Module for compiling Deno modules for different target platforms.
 * It walks through the modules directory, checks each module's permissions,
 * and compiles them for the specified target platform using Deno's compile command.
 *
 * The compilation target can be specified via command-line arguments when running this script.
 *
 * @module ModuleCompiler
 */

import { DenoPermissions } from '@/types.ts'
import { $, binDir, fs, getModulePermissions, log, srcDir } from 'bru'

function getFriendlyTargetName(target: string): string {
  const targetMap: { [key: string]: string } = {
    'x86_64-apple-darwin': 'macos',
    'x86_64-unknown-linux-gnu': 'linux',
    'x86_64-pc-windows-msvc': 'windows',
  }
  return targetMap[target] || target
}

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

function constructDenoCompileCommandArgs(
  filePath: string,
  moduleName: string,
  target: string,
  permissions: DenoPermissions,
): string[] {
  const permissionArgs = Object.entries(permissions).flatMap(
    ([perm, value]) => {
      if (Array.isArray(value)) {
        return value.map((val) => `--allow-${perm}=${val}`)
      } else if (value) {
        return [`--allow-${perm}`]
      }
      return []
    },
  )
  return [
    ...permissionArgs,
    `--output=${binDir}/${getFriendlyTargetName(target)}/${moduleName}`,
    filePath,
  ]
}

async function compileModules(target: string) {
  await fs.ensureDir(binDir)

  const modules: string[] = []
  for await (const entry of fs.walk(srcDir, { maxDepth: 1 })) {
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
