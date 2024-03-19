import {
  $,
  codeFence,
  getArgs,
  instance,
  join,
  log,
  model,
  OpenAI,
  snapshot,
  stream,
  summarizeFile,
  walkMod,
} from 'bru'

export type Summary = {
  file: string
  response: string
}

async function processDirs(dirs: string[]) {
  for (const dir of dirs) {
    await walkMod(
      dir,
      summarizeFile,
      '.ts',
      ['perm.ts'],
      `Summarizing files in ${dir}`,
    )
  }
}

async function summarizeDir() {
  const summaryPath = './summary.json'

  const snapshotPath = '.'
  const snapshotDepth = 3
  const maxLines = 20

  let cwdSnapshot = ''
  const cwd = Deno.cwd()

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

  log(cwdSnapshot)

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

await processDirs(dirs)
await summarizeDir()

if (
  await $.confirm('\n\nDo you want to remove the summary.json file?', {
    default: true,
  })
) {
  try {
    await Deno.remove('./summary.json')
    log.info('✓ summary.json file has been removed')
  } catch (error) {
    log.error(`Error removing summary.json: ${error.message}`)
  }
} else {
  log.info('summary.json file will be kept')
}
