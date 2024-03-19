/**
 * This function initiates a stream with OpenAI and accumulates the generated content.
 * Writes the generated content directly to the stdout.
 *
 * @param {OpenAI} openai - The OpenAI instance
 * @param {OpenAI.ChatCompletionCreateParamsStreaming} chatCompletionParams - The chat completion parameters for streaming.
 * @returns {Promise<string>} Returns a promise that resolves with the accumulated generated content.
 */

import { OpenAI } from 'bru'

export default async function stream(
  openai: OpenAI,
  chatCompletionParams: OpenAI.ChatCompletionCreateParamsStreaming,
): Promise<string> {
  const stream = openai.chat.completions.create(chatCompletionParams)
  let generatedContent = ''

  for await (const message of await stream) {
    const content = message?.choices[0]?.delta?.content

    if (content !== undefined) {
      generatedContent += content

      // Directly write the content to stdout
      const encoder = new TextEncoder()
      const encodedContent = encoder.encode(String(content))
      await Deno.stdout.write(encodedContent)
    }
  }

  return generatedContent
}
