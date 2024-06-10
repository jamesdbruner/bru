/**
 * @module TestGenerator
 * Module for generating unit tests for Deno modules using OpenAI.
 */

import {
  getArgs,
  instance,
  log,
  model,
  OpenAI,
  processDirs,
  saveFile,
} from 'bru'

const {
  dirs,
  output = '.',
} = await getArgs({
  dirs: { arg: Deno.args[0] },
  output: { arg: Deno.args[1], prompt: 'Enter output directory:' },
})

/**
 * Generates unit tests for a given TypeScript file using OpenAI.
 *
 * @param {string} file - The path to the TypeScript file for which to generate tests.
 * @returns {Promise<void>}
 */
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

// Flatten and process dirs, handling both single and multiple paths
// Splits string input on commas and trims whitespace to ensure clean directory paths
await processDirs(
  [dirs].flatMap((dir) =>
    String(dir)
      .split(',')
      .map((d) => d.trim())
  ),
  (file: string) => generateTests(file),
  '.ts',
  `Generating tests in ${dirs}`,
)

log(`✓ Tests written to ${output}`)
