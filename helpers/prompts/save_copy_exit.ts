/**
 * Async function for handling a message SaveCopyExit. Presents the user with
 * several options for what they can do with the message content.
 * Options include saving to file, copying to Clipboard, and exiting the program.
 *
 * @async
 * @function
 * @param {OpenAI.ChatCompletionMessageParam | string} message - The message or string that triggers the SaveCopyExit.
 */

import { clipboard, type OpenAI, saveFile, select } from 'bru'

async function SaveCopyExit(
  message: OpenAI.ChatCompletionMessageParam | string,
) {
  const content = typeof message === 'string'
    ? message
    : String(message.content)

  const options = [
    { label: 'Exit' }, // No action needed for exit, so we can omit the 'action' property
    { label: 'Save to File', action: async () => await saveFile(content) },
    {
      label: 'Copy to Clipboard',
      action: async () => await clipboard(content),
    },
  ]

  await select(options)
}

export default SaveCopyExit
