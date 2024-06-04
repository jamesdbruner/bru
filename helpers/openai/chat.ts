/**
 * Asynchronous function that manages a conversation with OpenAI.
 *
 * @async
 * @param initialMessages - Initial messages to start the conversation.
 * @param callback - Callback function to execute when the conversation ends.
 * @returns Returns the last message from the conversation.
 */

import { $, instance, log, model, OpenAI, stream } from 'bru'

async function chat(
  initialMessages: OpenAI.ChatCompletionMessageParam[],
  callback: (
    message: OpenAI.ChatCompletionMessageParam,
  ) => Promise<void> | void,
) {
  const messages: OpenAI.ChatCompletionMessageParam[] = [...initialMessages]

  while (true) {
    const userMessage = await $.prompt('[you]:')
    log(userMessage, { name: 'you' })

    messages.push({ role: 'user', content: userMessage })

    const chatCompletionParams: OpenAI.ChatCompletionCreateParamsStreaming = {
      model,
      messages,
      stream: true,
    }

    log('\n', { name: 'ai' })
    const response = await stream(instance, chatCompletionParams)

    console.log('\n')

    messages.push({ role: 'system', content: response })

    const continueConversation = await $.confirm(
      '\nRespond?',
      { default: true },
    )

    if (!continueConversation) {
      await callback(messages[messages.length - 1])
      break
    }
  }

  return messages[messages.length - 1]
}

export default chat
