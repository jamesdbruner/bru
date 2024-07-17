/**
 * This function asks the user if they want to refine the output and then continues the conversation based on the user's response.
 * If the user declines, it saves the response and exits.
 *
 * @async
 * @function chatLoop
 * @param {OpenAI.ChatCompletionMessageParam[]} messages - The array of chat completion message parameters.
 * @param {string} response - The response string.
 * @returns {Promise<void>} A promise that resolves when the chat loop completes or the response is saved and the process exits.
 */

import { $, chat, OpenAI, saveCopyExit } from 'bru'

async function chatLoop(
  messages: OpenAI.ChatCompletionMessageParam[],
  response: string,
): Promise<void> {
  const message: OpenAI.ChatCompletionMessageParam[] = [
    ...messages,
    { role: 'system', content: response },
  ]

  console.log('\n')

  // Ask user if they want to refine the output
  const confirm = await $.confirm(
    'Respond?',
    { default: true },
  )

  if (confirm) {
    await chat(
      message,
      async (msgs) => await saveCopyExit(msgs),
    )
  } else {
    await saveCopyExit(message[2])
  }
}

export default chatLoop
