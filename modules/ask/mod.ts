/**
 * Executes an interactive chat session with OpenAI's chat model, streaming the responses
 * to standard output. It first constructs an initial set of messages including a system message
 * setting the context and a user message containing the provided prompt. It then initiates
 * a chat session with these messages, streaming the responses and handling them in a chat loop.
 *
 * @async
 * @function ask
 * @description Initiates an OpenAI chat session, streaming responses to stdout or returning the result.
 * @param {string} [initialPrompt] - An optional prompt to start the session.
 * @param {boolean} [interactive=true] - Whether to run interactively (with chat loop) or return the response directly.
 * @returns {Promise<void | string>} A promise that resolves when the chat loop has completed or returns the response directly.
 */

import {
  chatLoop,
  getArgs,
  instance,
  log,
  model,
  type OpenAI,
  stream,
} from 'bru'

export async function ask(
  initialPrompt?: string,
  code?: boolean,
  interactive: boolean = false,
): Promise<void | string> {
  const promptArg = initialPrompt || (await getArgs({
    prompt: { arg: String(Deno.args.join(' ')), prompt: '[you]:' },
  })).prompt

  const systemMessage =
    "You're a helpful assistant that can generate a response to the following prompt from a user. You're a CLI tool that can be asked about anything."

  let userMessage = String(promptArg).replace(/-c/, '').replace(/--code/, '')

  if (code) {
    userMessage +=
      'Only respond with the intended code snippet without any explanation or code fences.'
  }

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage },
  ]

  const chatCompletionParams: OpenAI.ChatCompletionCreateParamsStreaming = {
    model,
    messages,
    stream: true,
  }

  log('\n', { name: 'ai' })

  if (interactive) {
    const response = await stream(instance, chatCompletionParams)
    await chatLoop(messages, response)
  } else {
    const response = await stream(instance, chatCompletionParams)
    let result = ''
    for await (const chunk of response) {
      result += chunk
    }
    return result
  }
}

if (import.meta.main) {
  const code: boolean = Deno.args[1] ? Boolean(JSON.parse(Deno.args[1])) : false

  await ask(
    Deno.args[0] || '',
    code,
  )
}
