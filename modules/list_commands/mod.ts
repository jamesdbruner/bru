/**
 * Lists all installed Deno commands by reading the Deno installation directory.
 * It checks the directory for executable files and prints their names.
 *
 * @async
 * @function listCommands
 * @description Lists all installed Deno commands.
 * @returns {Promise<void>} A promise that resolves when the command list is printed.
 */

import { denoBin, log, NAME, walk } from 'bru'

/**
 * Lists all installed Deno commands by reading the Deno bin directory.
 *
 * @async
 * @function listInstalledCommands
 * @returns {Promise<void>} A promise that resolves when the command list is printed.
 */
async function listInstalledCommands(): Promise<void> {
  if (!denoBin) {
    log.error('Deno bin directory not found')
    return
  }

  log(`${NAME} commands installed in %c${denoBin}`, {
    styles: 'font-weight: bold; color: green; ',
  })
  const commands: string[] = []

  for await (const entry of walk(denoBin, { maxDepth: 1 })) {
    if (entry.isFile) {
      commands.push(entry.name)
    }
  }

  if (commands.length === 0) {
    log('No commands found')
    return
  }

  log.info(commands.join(', '))
}

listInstalledCommands().catch((err) =>
  log.error(`Error listing commands: ${err.message}`)
)
