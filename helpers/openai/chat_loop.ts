/**
 * This function asks the user if they want to refine the output and then continues the conversation based on the users response.
 *
 * @async
 * @function
 * @param {OpenAI.ChatCompletionMessageParam[]} messages - The array of chat completion message parameters.
 * @param {string} response - The response string.
 * @returns {void} No return value.
 */

import { $, chat, OpenAI, saveCopyExit } from 'bru'

async function chatLoop(
  messages: OpenAI.ChatCompletionMessageParam[],
  response: string,
) {
  // Ask user if they want to refine the output
  const confirm = await $.confirm(
    '\nRespond?',
    { default: true },
  )

  if (confirm) {
    await chat(
      [...messages, { role: 'system', content: response }],
      async (messages) => await saveCopyExit(messages),
    )
  } else {
    Deno.exit(0)
  }
}

export default chatLoop
