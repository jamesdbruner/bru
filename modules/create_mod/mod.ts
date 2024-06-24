import {
  $,
  codeFence,
  createCompletion,
  dirname,
  ensureDir,
  fromFileUrl,
  instance,
  log,
  model,
  OpenAI,
  selectFolders,
} from 'bru'
import type { DenoPermissionName } from '@/types.ts'

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
  const alias: string = await $.prompt(
    'Enter an alias for this module (this is the name for the terminal command once installed):',
    {
      default: '',
    },
  )

  // Prompt user to select required permissions
  const allowedPermissions = await $.multiSelect({
    message:
      'Select permission(s) to grant to this module (press space to select and enter to continue):',
    options: denoPermissions,
  })

  // Construct permissions object
  const allowedPermsObj = allowedPermissions.reduce<Record<string, boolean>>(
    (acc, perm) => {
      // Set each selected permission to true
      acc[denoPermissions[perm]] = true
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
      // Set each selected permission to false
      acc[denoPermissions[perm]] = false
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

  // Construct options object
  const optionsObj = selectedOptions.reduce<Record<string, boolean | string>>(
    (acc, option) => {
      // Set each selected option to true
      acc[moduleOptions[option]] = true
      return acc
    },
    {},
  )

  // Add alias to options object
  if (alias) optionsObj.name = `'${alias}'`

  // Construct the permissions file template string
  const permFileContent =
    `import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  ${
      Object.entries(permissionsObj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(',\n  ')
    }
} as DenoPermissions

export const options = {
  ${
      Object.entries(optionsObj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(',\n  ')
    }
} as ModOptions
`

  // Write to perm.ts in the module directory
  await Deno.writeTextFile(`${moduleDirPath}/perm.ts`, permFileContent)
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

  // Determine the absolute path to the current script's directory
  // go back one directory
  const scriptDir = dirname(fromFileUrl(import.meta.url)) // go back one directory

  // join then pop off the last directory then join again
  const modulesDirPath = scriptDir.split('/').slice(0, -1).join('/')

  const moduleDirs = []
  for await (const dirEntry of Deno.readDir(modulesDirPath)) {
    if (dirEntry.isDirectory) {
      moduleDirs.push(dirEntry.name)
    }
  }

  const selectedTemplate = await $.select({
    message: 'Select an existing module as a template:',
    options: moduleDirs,
  })

  selectFolders({
    single: true,
    currentPath: modulesDirPath,
  })

  const userPrompt = await $.prompt(
    'What do you want your new module to do?',
  )

  const moduleTemplateContent = await Deno.readTextFile(
    `modules/${moduleDirs[selectedTemplate]}/mod.ts`,
  )

  const chatCompletionParams: OpenAI.ChatCompletionCreateParams = {
    model,
    messages: [
      {
        role: 'system',
        content: `
          You are an expert Deno module developer. Your task is to create a new Deno module based on the user's requirements and an existing module template.

          Do NOT include any explainations or anything other than valid code and JSDoc comments. The user will be prompted to provide the purpose and functionality of the module. You should only provide the code structure and implementation.
          Do NOT include any code fences in your response.
        `,
      },
      {
        role: 'user',
        content: `
          Here is an example of an existing modules code:

          ${codeFence(moduleTemplateContent)}

          Based on the above example, create a new module that does the following: ${userPrompt}
        `,
      },
    ],
    max_tokens: 850,
    temperature: 0.45,
  }

  const response = await createCompletion(instance, chatCompletionParams)
  const moduleDirPath = `modules/${moduleName}`

  await ensureDir(moduleDirPath)
  await createPermissionsFile(moduleDirPath)

  const destinationPath = `${moduleDirPath}/mod.ts`
  const generatedModuleContent = String(
    response?.choices[0]?.message?.content?.trim(),
  )

  await Deno.writeTextFile(destinationPath, generatedModuleContent)

  log(`Created %c${moduleName}`, { styles: 'font-weight: bold; ' })
}

await main()
