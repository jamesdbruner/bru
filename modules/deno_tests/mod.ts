import OpenAI from 'openai'
import instance from 'helpers/openai/init.ts'
import model from 'helpers/openai/model.ts'
import walkMod from 'helpers/walk_mod.ts'
import getArgs from '../../helpers/prompts/get_args.ts'
import saveFile from 'helpers/save_file.ts'
import log from 'log'

const {
  dirs,
  output = '.',
} = await getArgs({
  dirs: { arg: Deno.args[0] },
  output: { arg: Deno.args[1], prompt: 'Enter output directory:' },
})

async function generateTests(file: string) {
  const code = await Deno.readTextFile(file)
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        "You are a helpful assistant that generates Deno unit tests based on the provided code. Write tests using Deno's standard testing library. Respond only with valid test code.",
    },
    {
      role: 'user',
      content:
        `Analyze the following code and write appropriate unit tests for the following code, ignore writing tests about permissions:\n\n${code}`,
    },
    {
      role: 'system',
      content:
        'Remove any code fences from your response. Do NOT respond with explainations. Valid code only.',
    },
  ]

  const chatCompletionParams: OpenAI.ChatCompletionCreateParams = {
    model,
    messages,
  }

  const response = await instance.chat.completions.create(chatCompletionParams)

  // Extract the file name from the path and replace the extension with .test.ts
  // This will give you 'jsdoc' from modules/jsdoc/mod.ts
  const moduleName = file.split('/').slice(-2, -1)[0]
  const fileName = `${moduleName}.test.ts` // jsdoc.test.ts

  // Use the output directory and the modified file name to create the path for the test file
  const filePath = `${output}${fileName}`

  await saveFile(String(response.choices[0].message.content), filePath)
}

async function processDirs(dirs: string[]) {
  for (const dir of dirs) {
    await walkMod(
      dir,
      (file: string) => generateTests(file),
      '.ts',
      ['perm.ts'],
      `Generating tests in ${dir}`,
    )
  }
}

// Flatten and process dirs, handling both single and multiple paths
// Splits string input on commas and trims whitespace to ensure clean dir paths
await processDirs(
  [dirs].flatMap((dir) => String(dir).split(',').map((d) => d.trim())),
)

log(`✓ Tests written to ${output}`)
