import { createCompletion, fs, instance, model, OpenAI } from 'bru'

async function summarizeFile(file: string) {
  const content = await Deno.readTextFile(file)

  const chatCompletionParams: OpenAI.ChatCompletionCreateParams = {
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant designed to provide concise summaries.',
      },
      {
        role: 'user',
        content:
          `Please briefly yet accurately summarize the purpose of this file: \n\n${content}`,
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
  }

  const response = await createCompletion(instance, chatCompletionParams)

  // Process the response to extract summary as a string
  const summaryText = response?.choices[0]?.message?.content?.trim()

  // Append to summary.json in the specified format
  const summaryPath = `${Deno.cwd()}/summary.json`
  await fs.ensureFile(summaryPath)

  const existingData = await Deno.readTextFile(summaryPath)
  const summaries = existingData ? JSON.parse(existingData) : []
  summaries.push({ file, response: summaryText })

  await Deno.writeTextFile(summaryPath, JSON.stringify(summaries, null, 2))
}

export default summarizeFile
