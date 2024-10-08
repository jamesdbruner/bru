import { join, NAME, parseYaml, stringify } from 'bru'

const CACHE_PATH = './.cache'

/**
 * Type definition for the configuration object.
 */
interface Config {
  cloneDir?: string
  outputDir?: string
  template?: string | void
  dirName?: string
  selectedDirs?: string[]
  manager?: 'yarn' | 'npm' | 'pnpm'
}

/**
 * Reads the configuration from the `<namespace>_config.yml` file.
 * Default namespace is `NAME` from your .env file.
 *
 * @returns {Promise<Config>} A promise that resolves to the configuration object.
 */
export async function readFromConfig(name: string = NAME): Promise<Config> {
  try {
    const content = await Deno.readTextFile(
      join(CACHE_PATH, `${name}_config.yml`),
    )
    return parseYaml(content) || {}
  } catch {
    return {}
  }
}

/**
 * Writes the given configuration to the `Deno.cwd()/.cache/<NAME>_config.yml` file.
 *
 * @param {string} name - The name of the configuration file.
 * @param {Config} config - The configuration object to write to the file.
 * @returns {Promise<void>} A promise that resolves when the file has been written.
 */
export async function writeToConfig(
  config: Config,
  name: string = NAME,
): Promise<void> {
  // Ensure the cache directory exists
  await Deno.mkdir(CACHE_PATH, { recursive: true })

  const yamlContent = stringify(config, { lineWidth: -1, indent: 2 })
  await Deno.writeTextFile(join(CACHE_PATH, `${name}_config.yml`), yamlContent)
}
