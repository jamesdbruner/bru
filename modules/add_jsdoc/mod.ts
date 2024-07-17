import {
  $,
  instance,
  log,
  model,
  OpenAI,
  processDirs,
  saveCopyExit,
  saveFile,
  selectFile,
  stream,
} from 'bru'

/**
 * Generates JSDoc comments for a given TypeScript file using OpenAI's language model.
 *
 * @param {string} file - The path to the TypeScript file.
 * @returns {Promise<void>}
 */
async function jsdoc(file: string) {
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

  // Optionally prompt the user to append the JSDoc comment to the file
  const confirm = await $.confirm('Append JSDoc comment to the file?', {
    default: true,
  })

  if (confirm) {
    const updatedCode = response + '\n' + code
    await saveFile(updatedCode, file)
    log(`JSDoc comment added to ${file}`)
  }

  log(`response: \n${response}`)

  saveCopyExit(response)
}

export async function main() {
  const path = String(Deno.args[0] || await selectFile())

  // Check if the path is a file or a directory
  const stat = await Deno.stat(path)
  if (stat.isFile) {
    await jsdoc(path)
  } else if (stat.isDirectory) {
    await processDirs(
      [path],
      jsdoc,
      /.ts/,
      `Generating JSDoc comments in ${path}`,
    )
  } else {
    log('The provided path is neither a file nor a directory.')
  }
}

main()
