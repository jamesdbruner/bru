/**
 * Asynchronously prompts the user about copying text to their clipboard
 * @param {string} text - The text to be copied to the clipboard
 * @returns {Promise<void>} A Promise that resolves when the action has been completed
 */

import { $, clipboardy, log } from 'bru'

async function clipboardPrompt(text: string): Promise<void> {
  const confirm = await $.confirm('Copy to clipboard?', {
    default: false,
  })

  if (confirm) {
    await clipboardy.write(text)
    log('✅ Copied to clipboard')
  }
}

export default clipboardPrompt
