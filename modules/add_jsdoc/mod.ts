import {
  $,
  getArgs,
  instance,
  log,
  model,
  OpenAI,
  saveFile,
  stream,
  walkMod,
} from 'bru'

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
          'Focus on function/class definitions and their methods and parameters. Ignore import statements. Do NOT respond with explanations. Do NOT include a code fence.',
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

  const response = await stream(instance, chatCompletionParams)

  // Optionally prompt the user to append the JSDoc comment to the file
  const confirm = await $.confirm('Append JSDoc comment to the file?', {
    default: true,
  })

  if (confirm) {
    const updatedCode = response + '\n' + code
    await saveFile(updatedCode, file)
    log(`JSDoc comment added to ${file}`)
  }
}

async function processDirs(dirs: string[]) {
  for (const dir of dirs) {
    await walkMod(
      dir,
      jsdoc, // Pass function directly
      '.ts',
      ['perm.ts'], // Adjust as needed
      `Generating JSDoc comments in ${dir}`,
    )
  }
}

export async function main() {
  const { targetPath } = await getArgs({
    targetPath: { arg: Deno.args[0] },
  })
  const path = String(targetPath)

  const stat = await Deno.stat(path)
  if (stat.isFile) {
    await jsdoc(path)
  } else if (stat.isDirectory) {
    await processDirs([path])
  } else {
    log('The provided path is neither a file nor a directory.')
  }
}

main()
