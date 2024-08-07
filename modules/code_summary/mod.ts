/**
 * Module for summarizing TypeScript files and generating a project overview.
 * The module walks through specified directories, summarizes files, and provides a brief overview.
 * It uses OpenAI's language model for generating summaries and overviews.
 *
 * @module SummaryModule
 */

import {
  $,
  codeFence,
  getArgs,
  instance,
  join,
  log,
  model,
  OpenAI,
  processDirs,
  snapshot,
  stream,
  summarizeFile,
} from 'bru'

export type Summary = {
  file: string
  response: string
}

/**
 * Summarizes the current directory and generates an overview based on file summaries.
 *
 * @returns {Promise<void>}
 */
async function summarizeDir() {
  const summaryPath = './summary.json'

  const snapshotPath = '.'
  const snapshotDepth = 3
  const maxLines = 20

  let cwdSnapshot = ''
  const cwd = Deno.cwd()

  /**
   * Constructs the ignore list for files and directories to exclude from the snapshot.
   *
   * @returns {string[]} - The array of paths to ignore.
   */
  function constructIgnoreList(): string[] {
    const ignoreNames = [
      '.git',
      'node_modules',
      'dist',
      '.cache',
      '.vscode',
      '.idea',
      '.DS_Store',
      'yarn.lock',
      'package-lock.json',
      '.gitignore',
      '.gitkeep',
      '.hooks',
      '.husky',
    ]

    return ignoreNames.map((name) => join(cwd, name))
  }

  const ignoreList = constructIgnoreList()

  cwdSnapshot = await snapshot(
    snapshotPath,
    snapshotDepth,
    ignoreList,
    maxLines,
  )

  try {
    const jsonContent = await Deno.readTextFile(summaryPath)
    const summaryData = JSON.parse(jsonContent)
    const summaries = summaryData.map((summary: Summary) => summary.response)
      .join(
        '\n',
      )

    const chatCompletionParams: OpenAI.ChatCompletionCreateParamsStreaming = {
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant. Please provide a brief overview or purpose of the following project based on the following summaries from the user:',
        },
        {
          role: 'user' as const,
          content: `File structure \n ${codeFence(cwdSnapshot)}`,
        },
        {
          role: 'user',
          content: summaries,
        },
      ],
      max_tokens: 300,
      temperature: 0.8,
      stream: true,
    }

    await stream(instance, chatCompletionParams)
  } catch (error) {
    log.error(`Error: ${error}`)
  }
}

const { dirs } = await getArgs({ dirs: { arg: Deno.args } })

await processDirs(dirs, summarizeFile, /.ts/, `Summarizing files in ${dirs}`)
await summarizeDir()

if (
  await $.confirm('\n\nDo you want to remove the summary.json file?', {
    default: true,
  })
) {
  try {
    await Deno.remove('./summary.json')
    log.info('✅ Removed summary.json')
  } catch (error) {
    log.error(`Error removing summary.json: ${error.message}`)
  }
}
