/**
 * Executes an interactive chat session with OpenAI's chat model, streaming the responses
 * to standard output. It first constructs an initial set of messages including a system message
 * setting the context and a user message containing the provided prompt. It then initiates
 * a chat session with these messages, streaming the responses and handling them in a chat loop.
 *
 * @async
 * @function ask
 * @description Initiates an OpenAI chat session, streaming responses to stdout.
 * @returns {Promise<void>} A promise that resolves when the chat loop has completed.
 */

import {
  chatLoop,
  findArg,
  getArgs,
  instance,
  log,
  model,
  OpenAI,
  stream,
} from 'bru'

export async function ask() {
  const { prompt } = await getArgs({
    prompt: { arg: String(Deno.args.join(' ')), prompt: '[you]:' },
  })

  // concise code mode
  const code = findArg(Deno.args, '-c') || findArg(Deno.args, '--code')

  const systemMessage =
    "You're a helpful assistant that can generate a response to the following prompt from a user. You're a CLI tool that can be asked about anything."

  let userMessage = String(prompt).replace(/-c/, '').replace(/--code/, '')

  if (code) {
    userMessage +=
      'Only respond with the intended code snippet without any explanation or code fences.'
  }

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemMessage,
    },
    {
      role: 'user',
      content: userMessage,
    },
  ]

  const chatCompletionParams: OpenAI.ChatCompletionCreateParamsStreaming = {
    model,
    messages,
    stream: true,
  }

  log('\n', { name: 'ai' })

  const response = await stream(instance, chatCompletionParams)
  await chatLoop(messages, response)
}

ask()
