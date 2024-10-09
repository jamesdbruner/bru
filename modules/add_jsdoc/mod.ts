import type { ModuleInput } from '@/types.ts'
import {
  $,
  instance,
  log,
  model,
  type OpenAI,
  processDirs,
  saveCopyExit,
  saveFile,
  stream,
} from 'bru'
import { options } from './perm.ts'

interface JsDocInputs {
  path: string
}

async function jsdoc(file: string, interactive: boolean) {
  const code = await Deno.readTextFile(file)

  const chatCompletionParams: OpenAI.ChatCompletionCreateParams = {
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that generates JSDoc style comments for TypeScript files. You only respond with valid JSDoc 3 comments for the given TypeScript code.',
      },
      {
        role: 'system',
        content:
          'Focus on function/class definitions and their methods and parameters. Ignore import statements. Do NOT respond with explanations. Do NOT include a code fence. Do NOT include code examples outside of the jsdoc comments or under the jsdoc comments.',
      },
      {
        role: 'user',
        content:
          `Try to generate around 2 to 5 JSDoc comments for the following TypeScript functions, classes, and methods:\n\n${code}`,
      },
    ],
    stream: true,
  }

  log('\n', { name: 'ai' })

  const response: string = await stream(instance, chatCompletionParams)

  if (interactive) {
    // Optionally prompt the user to append the JSDoc comment to the file
    const confirm = await $.confirm('Append JSDoc comment to the file?', {
      default: true,
    })

    if (confirm) {
      const updatedCode = response + '\n' + code
      await saveFile(updatedCode, file)
      log(`JSDoc comment added to ${file}`)
    }
    saveCopyExit(response)
  }
}

export async function main(inputs?: JsDocInputs) {
  const interactive = !Deno.args.includes('--non-interactive')
  const opts = { inputs: [], ...options }

  const argsMap = (opts.inputs ?? []).reduce(
    (
      acc: Record<string, { arg: string; prompt: string }>,
      input: ModuleInput,
    ) => {
      const inputName = input.name as keyof JsDocInputs
      acc[input.name] = {
        arg: inputs?.[inputName] || Deno.args[opts.inputs.indexOf(input)] ||
          String(input.defaultValue || ''),
        prompt: input.prompt,
      }
      return acc
    },
    {},
  )

  const path = argsMap.path.arg

  try {
    // Check if the path is a file or a directory
    const stat = await Deno.stat(path)
    if (stat.isFile) {
      await jsdoc(path, interactive)
    } else if (stat.isDirectory) {
      await processDirs(
        [path],
        (file) => jsdoc(file, interactive),
        /.ts/,
        `Generating JSDoc comments in ${path}`,
      )
    } else {
      log('The provided path is neither a file nor a directory.')
    }
  } catch (error) {
    log(`Error: ${error.message}`)
  }
}

if (import.meta.main) {
  await main({
    path: Deno.args[0] || '',
  })
}
