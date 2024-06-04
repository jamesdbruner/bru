import {
  $,
  addFrontmatter,
  checkHashTable,
  codeFence,
  createCompletion,
  dirname,
  ensureDir,
  existsSync,
  instance,
  join,
  log,
  model,
  OpenAI,
  parseYaml,
  readFromCache,
  relative,
  removeFromCache,
  removeFromHashTable,
  selectFolders,
  updateHashTable,
  walkMod,
  writeToCache,
} from 'bru'
import { HASHTABLE_PATH } from 'helpers/caching/hashtable.ts'
import { CACHE_PATH } from 'helpers/caching/cache.ts'
import { writeStarlightConfig } from './starlight_config.ts'
import type { HashTable } from '@/types.ts'
import { readConfig, writeConfig } from 'helpers/caching/config.ts'

async function getModuleMDX(file: string, ext: string) {
  const fileKey = relative(Deno.cwd(), file)
  const cached = await checkHashTable(fileKey)

  if (cached) {
    return await readFromCache(fileKey, '.md')
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

          Here are some example components you can use to enhance the documentation:

          ### Tabs
          \`\`\`mdx
          import { Tabs, TabItem } from '@astrojs/starlight/components';

          <Tabs>
            <TabItem label="pnpm">pnpm astro</TabItem>
            <TabItem label="yarn">yarn astro</TabItem>
          </Tabs>
          \`\`\`

          ### Card Grid
          \`\`\`mdx
          import { Card, CardGrid } from '@astrojs/starlight/components';

          <CardGrid>
            <Card title="Card 1">Content for Card 1</Card>
            <Card title="Card 2">Content for Card 2</Card>
          </CardGrid>
          \`\`\`

          ### Aside
          \`\`\`mdx
          import { Aside } from '@astrojs/starlight/components';

          <Aside type="tip" title="Tip">
            This is a tip
          </Aside>
          \`\`\`

          ### Code Example
          \`\`\`mdx
          import { Code } from '@astrojs/starlight/components';

          <Code code={\`console.log('Hello, world!');\`} lang="js" />
          \`\`\`

          ### FileTree
          \`\`\`mdx
          import { FileTree } from '@astrojs/starlight/components';

          <FileTree>
          - src/
            - content/
              - docs/
                - hello-world.md
                - reference/
                  - faq.md
          </FileTree>
          \`\`\`

          ### Steps
          \`\`\`mdx
          import { Steps } from '@astrojs/starlight/components';

          <Steps>
            1. Import the component into your MDX file:
            \`\`\`js
            import { Steps } from '@astrojs/starlight/components';
            \`\`\`

            2. Wrap \`<Steps>\` around your ordered list items.
          </Steps>
          \`\`\`
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
    moduleName || 'module',
    'placeholder',
  )

  await updateHashTable(fileKey)
  await writeToCache(fileKey, result, '.md')
}

async function processModules(dirs: string[], ext: string = '.tsx') {
  await Promise.all(dirs.map(async (dir) => {
    await walkMod(
      dir,
      async (filePath) => {
        await getModuleMDX(filePath, ext)
      },
      ext,
      ['perm.ts'],
      'Generating Markdown',
    )
  }))
}

async function copyCachedFiles(
  path: string = './docs/src/content/docs/',
  selectedDirectories: string[],
  ext: string = '.ts',
) {
  // Ensure the base directory exists
  await Deno.mkdir(`${Deno.cwd()}/${path}`, { recursive: true }).catch(
    (error) => {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        log.error(`Error creating directory: ${error}`)
        throw error
      }
    },
  )

  await existsSync(HASHTABLE_PATH)

  const content = await Deno.readTextFile(HASHTABLE_PATH)
  const hashTable = parseYaml(content) as HashTable

  const relativeDirectories = selectedDirectories.map((dir) =>
    dir.replace(Deno.cwd(), '').replace(/^\//, '')
  )

  const progressBar = $.progress('Copying Cached Files', {
    length: relativeDirectories.length,
  })

  try {
    await progressBar.with(async () => {
      for (const dir of relativeDirectories) {
        if (hashTable[dir]) {
          for (const subdir in hashTable[dir]) {
            const files = hashTable[dir][subdir]
            for (const file of files) {
              const fileMD = file.replace(ext, '.md')
              const srcPath = join(CACHE_PATH, dir, subdir, fileMD)
              const destPath = join(path, dir, subdir, fileMD)

              await ensureDir(dirname(destPath))
              await Deno.copyFile(srcPath, destPath)
            }
          }
        }
        progressBar.increment()
      }
    })
  } catch (error) {
    log.error(`Error copying cached files: ${error}`)
  } finally {
    progressBar.finish()
  }
}

async function main(cacheRemoveFileName?: string) {
  log(`%cPouring...`, { styles: 'color: green;' })

  if (cacheRemoveFileName) {
    try {
      await removeFromCache(cacheRemoveFileName, '.md')
      await removeFromHashTable(cacheRemoveFileName)

      log(`Successfully removed from cache: %c${cacheRemoveFileName}`, {
        styles: 'color: red; ',
      })
    } catch (error) {
      log.error(`Error removing file from cache: ${error}`)
    }
  }

  const config = await readConfig('draft')

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
  await writeConfig(
    { cloneDir, template, outputDir, selectedDirectories, manager },
    'draft',
  )

  await processModules(selectedDirectories)

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

export const fileName =
  Deno.args.find((arg) => arg.startsWith('--cache-remove='))
    ?.split('=')[1] ?? ''

await main(fileName)
