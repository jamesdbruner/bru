import { getArgs, log, snapshot } from 'bru'
import { options } from './perm.ts'
import { ModuleInput } from '@/types.ts'
import { ArgConfig } from 'helpers/prompts/get_args.ts'

interface SnapshotInputs {
  path: string
  depth: string
  maxLines: string
}

export const ignoreList = [
  '^node_modules',
  '^dist/',
  '^.hooks/',
  'CODE_OF_CONDUCT.md',
  'LICENSE.md',
  'CHANGELOG.md',
  'README.md',
  'CONTRIBUTING.md',
  '.git',
  '.DS_Store',
  'yarn.lock',
  'package-lock.json',
  '.prettierignore',
  '.gitignore',
  '.gitkeep',
  '.husky',
  'prettier.*',
  'babel.*',
  'lint-staged.*',
  'perm.ts',
  '.env',
  '.cache',
  'dist',
  'coverage',
  'yarn-error.log',
  '.vscode',
  '.github',
  '.hooks',
  'log.*',
  'tsconfig.*',
  'd.ts',
  'temp',
]

export async function snap(inputs: SnapshotInputs) {
  const opts = { inputs: [], ...options }

  if (!opts || !opts.inputs) {
    log.error(
      'Options or inputs are not defined in the module permissions file.',
    )
    return
  }

  const argsMap: Record<string, ArgConfig> = (opts.inputs ?? []).reduce(
    (acc: Record<string, ArgConfig>, input: ModuleInput) => {
      const defaultValue = input.defaultValue !== undefined
        ? String(input.defaultValue)
        : ''
      const argValue =
        Deno.args[(opts.inputs ?? []).indexOf(input)] !== undefined
          ? String(Deno.args[(opts.inputs ?? []).indexOf(input)])
          : defaultValue

      acc[input.name] = {
        arg: argValue,
        prompt: input.prompt,
      }
      return acc
    },
    {},
  )

  const { path, depth, maxLines } = await getArgs(argsMap)

  const depthNumber = parseInt(String(depth || inputs.depth))
  const maxLinesNumber = parseInt(String(maxLines || inputs.maxLines))

  const snapshotResult = await snapshot(
    path[1] || inputs.path,
    depthNumber,
    ignoreList,
    maxLinesNumber,
  )

  log(snapshotResult)
}

if (import.meta.main) {
  await snap({
    path: Deno.args[0] || '.',
    depth: Deno.args[1] || '2',
    maxLines: Deno.args[2] || '50',
  })
}
