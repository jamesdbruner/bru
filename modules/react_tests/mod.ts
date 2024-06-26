/**
 * Module for generating unit tests using OpenAI's language model.
 * The module reads a specified file, detects the language used, and generates unit tests using appropriate frameworks/libraries.
 * It uses OpenAI's API to generate the initial unit test code and allows for refining the output through a conversational loop.
 *
 * @module UnitTestGenerator
 */

import { chatLoop, instance, log, model, OpenAI, selectFile, stream } from 'bru'

const file = String(Deno.args[0] || await selectFile())
const code = await Deno.readTextFile(file)

const messages: OpenAI.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content:
      'You are a helpful assistant that generates unit tests with a proficiency in react testing library and jest but detect the language used in the code from the user and write the appropriate unit test in the correct frameworks/libs. You only respond with valid code that is to be used in a test file. Do NOT respond with explainations. Do NOT include a code fence.',
  },
  {
    role: 'user',
    content:
      `Take a deep breath and concentrate. Given the following code, analyze what unit tests should be written and attempt to write them. ${code}`,
  },
]

const chatCompletionParams: OpenAI.ChatCompletionCreateParamsStreaming = {
  model,
  messages,
  stream: true,
}

// Get the initial response from openai
log('\n', { name: 'ai' })
const response = await stream(instance, chatCompletionParams)

// Refine the output by having a conversation with OpenAI
// has a built in callback func that results in the user selecting what to do with the output
await chatLoop(messages, response)
