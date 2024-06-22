/**
 * Module for generating a single README file that documents the functionality and purpose of all files in selected directories.
 *
 * @module CreadmeModule
 */

import {
  $,
  checkHashTable,
  codeFence,
  createCompletion,
  ensureDir,
  findArg,
  instance,
  join,
  log,
  model,
  NAME,
  OpenAI,
  processMods,
  readFromCache,
  readFromConfig,
  relative,
  removeFromCache,
  removeFromHashTable,
  selectFolders,
  toCapitalCase,
  updateHashTable,
  writeToCache,
  writeToConfig,
} from 'bru'

/**
 * Generates a summary for a given file using OpenAI's language model.
 *
 * @param {string} file - The path to the file to generate a summary for.
 * @returns {Promise<string>} The generated summary.
 */
async function getFileSummary(file: string): Promise<string> {
  const fileKey = relative(Deno.cwd(), file)
  const cached = await checkHashTable(fileKey)

  if (cached) {
    return await readFromCache(fileKey, '.md')
  }

  const content = await Deno.readTextFile(file)

  const chatCompletionParams: OpenAI.ChatCompletionCreateParams = {
    model,
    messages: [
      {
        role: 'system',
        content: `
          You are an expert technical writer. Your task is to generate a concise, clear, and accurate summary of the given file.
          The summary should include:
          - **Purpose**: Briefly describe the purpose of the file.
          - **Functionality**: Summarize the main functionality provided by the file.
          - **Key Functions**: List key functions or classes and their roles.

          Avoid lengthy introductions or conclusions. The content should be straightforward and technically informative. You can include the file name e.g. file.ts but dont include the full path.
        `,
      },
      {
        role: 'user',
        content: `
          Using the content provided below, create a summary for the file "${file}": ${
          codeFence(content)
        }`,
      },
    ],
    max_tokens: 500,
    temperature: 0.5,
  }

  const response = await createCompletion(instance, chatCompletionParams)
  const result = String(response?.choices[0]?.message?.content?.trim())

  await updateHashTable(fileKey)
  await writeToCache(fileKey, result, '.md')

  return result
}

/**
 * Main function to manage the overall process of generating a README file, managing cache, and configuring output directory.
 *
 * @param {string} [cacheRemoveFileName] - The file name to remove from the cache.
 * @returns {Promise<void>}
 */
async function main(cacheRemoveFileName?: string) {
  log(`%cGenerating README...`, { styles: 'font-weight: bold; ' })

  if (cacheRemoveFileName) {
    try {
      await removeFromCache(cacheRemoveFileName, '.md')
      await removeFromHashTable(cacheRemoveFileName)

      log(`Successfully removed from cache: %c${cacheRemoveFileName}`, {
        styles: 'color: red;',
      })
    } catch (error) {
      log.error(`Error removing file from cache: ${error}`)
    }
  }

  const config = await readFromConfig('creadme')

  if (!config.outputDir) {
    config.outputDir = await $.prompt('Where to output the README file?', {
      default: `.`,
    })
  }

  if (!config.selectedDirs) {
    config.selectedDirs = await selectFolders()
  }

  const { outputDir, selectedDirs } = config

  // Save the config file
  await writeToConfig(
    { outputDir, selectedDirs },
    'creadme',
  )

  const summaries: { [key: string]: string[] } = {}

  await processMods(
    selectedDirs,
    async (filePath) => {
      const summary = await getFileSummary(filePath)
      const dirName = filePath.split('/').slice(-2, -1)[0]
      const fileName = toCapitalCase(
        String(filePath.split('/').pop()?.replace(/.tsx?$/, '')),
      )

      if (!summaries[dirName]) {
        summaries[dirName] = []
      }

      summaries[dirName].push(`### ${fileName}\n\n${summary}`)
    },
    /\.tsx?$/,
    ['perm.ts'],
    'Generating content...',
  )

  const title = selectedDirs.map((dir) =>
    toCapitalCase(dir.split('/').pop() || '')
  ).join(', ')

  // Combine summaries into a single README file
  const readmeContent = `
  # ${title} Documentation

  ${
    Object.entries(summaries).map(([dir, files]) =>
      `## ${toCapitalCase(dir)}\n\n${files.join('\n\n')}`
    ).join('\n\n')
  }

generated by **${NAME}** using openai **${model}**`

  await ensureDir(outputDir)
  await Deno.writeTextFile(join(outputDir, 'README.md'), readmeContent)

  await ensureDir(outputDir)
  await Deno.writeTextFile(join(outputDir, 'README.md'), readmeContent)

  log(`%cFile created successfully`, { styles: 'font-weight: bold; ' })
}

const fileName = findArg(Deno.args, '--cache-remove=')

await main(fileName)