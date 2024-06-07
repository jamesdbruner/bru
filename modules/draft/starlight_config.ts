import { NAME } from 'env'
import { log } from 'bru'

interface SidebarConfig {
  label: string
  autogenerate: { directory: string }
}

/**
 * Generates the astro config string with dynamic sidebar directories.
 *
 * @param {string[]} directories - List of directories to include in the sidebar.
 * @returns {string} - The generated astro config string.
 */
export function generateStarlightConfig(directories: string[]): string {
  const sidebarConfig: SidebarConfig[] = directories.map((dir) => {
    const name = String(dir.split('/').pop())

    return ({
      label: name.charAt(0).toUpperCase() + name.slice(1),
      autogenerate: { directory: name },
    })
  })

  const output = `
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: '${NAME}',
			social: {
				github: 'https://github.com/jamesbruner/bru',
			},
			sidebar: ${JSON.stringify(sidebarConfig, null, 2)},
		}),
	],
});
`
  return output
}

/**
 * Writes the generated astro config to the astro.config.mjs file.
 *
 * @param {string} outputDir - The output directory to write the astro config to.
 * @param {string[]} directories - List of directories to include in the sidebar.
 * @returns {Promise<void>}
 */
export async function writeStarlightConfig(
  outputDir: string,
  directories: string[],
): Promise<void> {
  const configContent = generateStarlightConfig(directories)
  const configPath = outputDir + '/astro.config.mjs'

  try {
    await Deno.writeTextFileSync(configPath, configContent)
    console.log('\n')

    log(`Writing astro config to %c${configPath}`, {
      styles: 'color: blue;',
    })
  } catch (error) {
    log.error(`Error writing astro config: ${error}`)
  }
}
