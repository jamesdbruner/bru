/**
 * Module for generating MDX documentation, managing caching, and configuring Astro site setup.
 *
 * @module DraftModule
 */

import {
  $,
  addFrontmatter,
  checkHashTable,
  codeFence,
  copyCachedFiles,
  createCompletion,
  dirname,
  ensureDir,
  existsSync,
  findArg,
  instance,
  join,
  log,
  model,
  OpenAI,
  processMods,
  readFromCache,
  relative,
  removeFromCache,
  removeFromHashTable,
  selectFolders,
  toCapitalCase,
  updateHashTable,
  walkMod,
  writeToCache,
} from 'bru'
import { CACHE_PATH } from 'helpers/caching/cache.ts'
import { readFromConfig, writeToConfig } from 'helpers/caching/config.ts'
import { writeStarlightConfig } from './starlight_config.ts'

/**
 * Generates MDX documentation for a given file using OpenAI's language model.
 *
 * @param {string} file - The path to the file to generate documentation for.
 * @param {string} ext - The file extension to replace with `.mdx` for the output.
 * @returns {Promise<void>}
 */
async function getModuleMDX(file: string, ext: string) {
  const fileKey = relative(Deno.cwd(), file)
  const cached = await checkHashTable(fileKey)

  if (cached) {
    return await readFromCache(fileKey, '.mdx')
  }

  await ensureDir(join(CACHE_PATH, dirname(fileKey)))

  const content = await Deno.readTextFile(file)
  const chatCompletionParams: OpenAI.ChatCompletionCreateParams = {
    model,
    messages: [
      {
        role: 'system',
        content: `
          You are an expert technical writer specializing in Markdown and MDX documentation. Your task is to generate clear, accurate, and well-structured MDX documentation for the given file.

          The MDX document should include the following sections:
          - **Purpose**: Briefly describe the purpose of the module and its high-level functionality.
          - **Features**: List the key features of the module concisely.
          - **Usage**: Provide a simple code example demonstrating the most common use case.
          - **Parameters**: Describe important parameters, including data types and default values.
          - **Example**: Include a minimal, illustrative example of how to use the module effectively with a Markdown code block.

          Use the following built-in React MDX components from the '@astrojs/starlight/components' package to enhance the documentation:
          - **<Tabs> and <TabItem>**: For displaying tabbed interfaces.
          - **<Card> and <CardGrid>**: For styled content boxes.
          - **<LinkCard>**: For prominent links to different pages.
          - **<Aside>**: For secondary information alongside the main content.
          - **<Code>**: For syntax-highlighted code.
          - **<FileTree>**: For displaying directory structures.
          - **<Steps>**: For numbered task lists.

          Avoid lengthy introductions or conclusions. The content should be straightforward, technically informative, and directly related to the provided file contents.
          Avoid code fences for markdown e.g. using "\`\`\`mdx" or "\`\`\`markdown" in the response. Only use code fences for code examples.
          Component imports should be come at the very start of the response. Do not include a title for the document.


          Notes:
            - You can only use built-in components from '@astrojs/starlight/components'
            - Refrain from using (Required<NpmCommands>) or similar TypeScript syntax in the response
            - Refrain from using jsdoc comments in the response
            - Refrain from using tags that are not part of the Astro documentation or valid HTML5, meaning wrapping text brackets e.g "React.HTMLAttributes<HTMLDivElement>"

          Here are some example components you can use to enhance the documentation:

          ### Tabs
          import { Tabs, TabItem } from '@astrojs/starlight/components';

          <Tabs>
            <TabItem label="pnpm">pnpm create astro</TabItem>
            <TabItem label="yarn">yarn create astro</TabItem>
          </Tabs>

          ### Card Grid
          import { Card, CardGrid } from '@astrojs/starlight/components';

          <CardGrid>
            <Card title="Card 1">Content for Card 1</Card>
            <Card title="Card 2">Content for Card 2</Card>
          </CardGrid>

          ### Aside
          import { Aside } from '@astrojs/starlight/components';

          <Aside type="tip" title="Tip">
            This is a tip
          </Aside>

          ### Code Example
          \`\`\`jsx
            <Code code={\`console.log('Hello, world!');\`} lang="js" />
          \`\`\`

          ### FileTree
          import { FileTree } from '@astrojs/starlight/components';

          <FileTree>
          - src/
            - content/
              - docs/
                - hello-world.mdx
                - reference/
                  - faq.mdx
          </FileTree>

          ### Steps
          import { Steps } from '@astrojs/starlight/components';

          <Steps>
            <ol>
              <li>
                Import the component into your MDX file:
                \`\`\`js
                  import { Steps } from '@astrojs/starlight/components';
                \`\`\`
              </li>
              <li>
                Define the object or parameters
              </li>
              <li>
                An example of usage
                \`\`\`jsx
                  <Code code={\`<Component />\`} lang="js" />
                \`\`\`
              </li>
            </ol>
          </Steps>
        `,
      },
      {
        role: 'user',
        content: `
          Using the content provided below, create an MDX file that describes the module and its functionality for the file "${file}". Include sections on usage and parameters based on the actual contents of the file: ${
          codeFence(content)
        }`,
      },
    ],
    max_tokens: 850,
    temperature: 0.45,
  }

  const response = await createCompletion(instance, chatCompletionParams)
  const moduleName = String(file)
    .replace(Deno.cwd(), '')
    .replace(ext, '')
    .split('/')
    .at(-1)

  const result = addFrontmatter(
    String(response?.choices[0]?.message?.content?.trim()),
    toCapitalCase(moduleName || 'module'),
    'placeholder',
  )

  await updateHashTable(fileKey)
  await writeToCache(fileKey, result, '.mdx')
}

/**
 * Main function to manage the overall process of generating documentation,
 * managing cache, and configuring the Astro site.
 *
 * @param {string} [cacheRemoveFileName] - The file name to remove from the cache.
 * @returns {Promise<void>}
 */
async function main(cacheRemoveFileName?: string) {
  log(`%cPouring...`, { styles: 'color: green;' })

  if (cacheRemoveFileName) {
    try {
      await removeFromCache(cacheRemoveFileName, '.mdx')
      await removeFromHashTable(cacheRemoveFileName)

      log(`Successfully removed from cache: %c${cacheRemoveFileName}`, {
        styles: 'color: red; ',
      })
    } catch (error) {
      log.error(`Error removing file from cache: ${error}`)
    }
  }

  const config = await readFromConfig('draft')

  if (!config.cloneDir) {
    config.cloneDir = await $.prompt('where to draft', { default: 'web' })
  }

  if (!config.template) {
    config.template = await $.prompt('template', { default: 'starlight' })
  }

  if (!config.outputDir) {
    config.outputDir = await $.prompt('where to output generated content', {
      default: `${config.cloneDir}/src/content/docs`,
    })
  }

  if (!config.selectedDirectories) {
    config.selectedDirectories = await selectFolders()
  }

  if (!config.manager) {
    config.manager = await $.prompt('package manager', { default: 'pnpm' }) as
      | 'yarn'
      | 'npm'
      | 'pnpm'
  }

  const { cloneDir, template, outputDir, selectedDirectories, manager } = config

  // Save the config file
  await writeToConfig(
    { cloneDir, template, outputDir, selectedDirectories, manager },
    'draft',
  )

  await processMods(
    selectedDirectories,
    () =>
      walkMod(
        '.',
        async (filePath) => {
          await getModuleMDX(filePath, '.tsx')
        },
      ),
    '.tsx',
    ['perm.ts'],
    'MDX documentation',
  )

  // Clone the repository if it doesn't exist and set up the documentation directory
  try {
    const docsExist = existsSync(cloneDir + '/package.json')
    if (!docsExist) {
      await $`${manager} create astro --template ${template} ${cloneDir} -y`
    }

    await copyCachedFiles(outputDir, selectedDirectories, '.tsx')

    if (String(template) === 'starlight') {
      await writeStarlightConfig(cloneDir, selectedDirectories)
    }

    await Deno.chdir(`./${cloneDir}`)

    log('Running %castro dev', { styles: 'color: green;' })

    await $`${manager} run start;`
  } catch (error) {
    log.error(`Error setting up the documentation directory: ${error}`)
  }
}

const fileName = findArg(Deno.args, '--cache-remove=')

await main(fileName)
