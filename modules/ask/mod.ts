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

import { chatLoop, getArgs, instance, log, model, OpenAI, stream } from 'bru'

export async function ask() {
  const { prompt } = await getArgs({
    prompt: { arg: String(Deno.args.join(' ')), prompt: '[you]:' },
  })

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        "You're a helpful assistant that can generate a response to the following prompt from a user. You're a CLI tool that can be asked about anything.",
    },
    {
      role: 'user',
      content: String(prompt),
    },
  ]

  const chatCompletionParams: OpenAI.ChatCompletionCreateParamsStreaming = {
    model,
    messages,
    stream: true,
  }

  log('\n', 'ai')

  const response = await stream(instance, chatCompletionParams)
  await chatLoop(messages, response)
}

ask()
