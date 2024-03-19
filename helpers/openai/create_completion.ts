/**
 * Generates content using the OpenAI API based on the provided parameters.
 * This function sends a request to OpenAI and waits for the complete response,
 * concatenating the parts of the response into a single string.
 *
 * @param {OpenAI} openai - The OpenAI instance.
 * @param {OpenAI.ChatCompletionCreateParamsNonStreaming} chatCompletionParams - The chat completion parameters.
 */
import { OpenAI } from 'bru'

export default async function generate(
  openai: OpenAI,
  chatCompletionParams: OpenAI.ChatCompletionCreateParamsNonStreaming,
) {
  return await openai.chat.completions.create(chatCompletionParams)
}
