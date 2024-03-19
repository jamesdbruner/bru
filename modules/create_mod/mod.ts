import $ from 'dax'
import { fs, log } from 'bru'
import { DenoPermissionName } from '@/types.ts'

// Available Deno permissions
const denoPermissions: DenoPermissionName[] = [
  'env',
  'sys',
  'hrtime',
  'net',
  'ffi',
  'read',
  'run',
  'write',
]

// Available module options
const moduleOptions = ['install', 'compile']

/**
 * Prompts the user for required permissions and generates a perm.ts file.
 *
 * @param {string} moduleDirPath - The directory path for the new module.
 */
async function createPermissionsFile(moduleDirPath: string) {
  // Prompt user to select required permissions
  const allowedPermissions = await $.multiSelect({
    message:
      'Select permission(s) to grant to this module (press space to select and enter to continue):',
    options: denoPermissions,
  })

  // Construct permissions object
  const allowedPermsObj = allowedPermissions.reduce<Record<string, boolean>>(
    (acc, perm) => {
      acc[denoPermissions[perm]] = true // Set each selected permission to true
      return acc
    },
    {},
  )

  // Prompt user to select required permissions
  const deniedPermissions = await $.multiSelect({
    message:
      'Select permission(s) to deny for this module (this will override your previous selected allowed permission selections):',
    options: denoPermissions,
  })

  const deniedPermsObj = deniedPermissions.reduce<Record<string, boolean>>(
    (acc, perm) => {
      acc[denoPermissions[perm]] = false // Set each selected permission to false
      return acc
    },
    {},
  )

  const permissionsObj = { ...allowedPermsObj, ...deniedPermsObj }

  // Prompt user to select required permissions
  const selectedOptions = await $.multiSelect({
    message:
      'Select compile and install options for this module (do you want to allow users to install and or compile this module via install/compile tasks?)',
    options: moduleOptions,
  })

  // Construct permissions object
  const optionsObj = selectedOptions.reduce<Record<string, boolean>>(
    (acc, perm) => {
      acc[moduleOptions[perm]] = true // Set each selected permission to true
      return acc
    },
    {},
  )

  // Construct the permissions file template string
  const permFileContent = `import { DenoPermissions } from "@/types.ts";

export default ${JSON.stringify(permissionsObj, null, 2)} as DenoPermissions;

export const options = ${JSON.stringify(optionsObj, null, 2)};\n`

  // Write to perm.ts in the module directory
  await Deno.writeTextFile(`${moduleDirPath}/perm.ts`, permFileContent)
}

/**
 * Creates a new deno.json file with prefilled name, version, and exports fields.
 */
async function createDenoJson(path: string, mod: string, version: string) {
  const scope = Deno.env.get('SCOPE') || `@${Deno.env.get('NAME')}`
  const denoJson = {
    name: `${scope}/${mod}`,
    version,
    exports: './mod.ts',
  }

  // Write the string to deno.json in the module directory
  await Deno.writeTextFile(
    `${path}/deno.json`,
    JSON.stringify(denoJson, null, 2),
  )
}

/**
 * Creates a new Deno module with selected permissions.
 */
async function main() {
  const moduleName = await $.prompt('Module name:')
  if (!moduleName) {
    log.error('Module name is required')
    return Deno.exit(1)
  }

  const useTemplate = Deno.args.includes('--template') ||
    Deno.args.includes('-t')
  const moduleDirPath = `modules/${moduleName}`

  await fs.ensureDir(moduleDirPath)
  await createPermissionsFile(moduleDirPath)
  await createDenoJson(moduleDirPath, moduleName, '0.1.0')

  const destinationPath = `${moduleDirPath}/mod.ts`
  if (useTemplate) {
    await Deno.copyFile('modules/create_mod/template.ts', destinationPath)
  } else {
    await Deno.writeTextFile(destinationPath, '')
  }

  log(`Module ${moduleName} created with selected permissions.`)
}

await main()
