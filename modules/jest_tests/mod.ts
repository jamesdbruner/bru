/**
 * Module for generating Jest tests for all files in a selected directory.
 *
 * @module JestTestGenerator
 */

import {
  codeFence,
  createCompletion,
  instance,
  log,
  model,
  OpenAI,
  selectFile,
  selectFolders,
  walkMod,
} from 'bru'

/**
 * Generates Jest tests for a given file using OpenAI's language model.
 *
 * @param {string} file - The path to the file to generate tests for.
 * @returns {Promise<void>}
 */
async function generateJestTests(file: string, fileRefContent: string) {
  const content = await Deno.readTextFile(file)
  const chatCompletionParams: OpenAI.ChatCompletionCreateParams = {
    model,
    messages: [
      {
        role: 'system',
        content: `
          You are an expert test writer specializing in Jest testing. Your task is to generate clear and comprehensive Jest tests for the provided file content.

          The generated tests should cover various scenarios, including edge cases, and should be structured in a way that follows Jest's testing conventions.

          Use the following reference test file as a guide for the structure and style of tests: ${
          codeFence(fileRefContent)
        }

          Avoid lengthy introductions or explanations. The content should be straightforward, technically informative, and directly related to the provided file contents.

          Don't include any code fences in your response. Focus on writing the Jest tests based on the given TypeScript code.
        `,
      },
      {
        role: 'user',
        content: `
          Using the content provided below, create Jest tests for the file "${file}": ${
          codeFence(content)
        }`,
      },
    ],
    max_tokens: 850,
    temperature: 0.45,
  }

  const response = await createCompletion(instance, chatCompletionParams)
  const result = String(response?.choices[0]?.message?.content?.trim())

  Deno.writeTextFile(file.replace('.ts', '.test.ts'), result)
}

/**
 * Main function to manage the overall process of generating Jest tests
 * for files in a selected directory.
 *
 * @returns {Promise<void>}
 */
async function main() {
  log(`%cGenerating Jest tests...`, { styles: 'color: green;' })

  const selectedDirs = await selectFolders({ single: true })

  const selectedDir = selectedDirs[0]
  if (!selectedDir) {
    log.error('No directory selected.')
    return
  }

  const fileRef = await selectFile()

  if (!fileRef) {
    log.error('No reference file selected.')
    return
  }

  await walkMod(
    selectedDirs[0],
    async (filePath) => {
      await generateJestTests(filePath, fileRef)
    },
    /.ts$/,
    ['node_modules', '.git', 'dist', 'build'],
    'Generating jest tests',
  )
}

await main()
