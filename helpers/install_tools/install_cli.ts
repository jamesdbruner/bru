/**
 * Installs the specified Deno module using the `deno install` command.
 * The module name and entry point are predefined, with the module name imported from an environment configuration
 * and the entry point set to `main.ts`. An import map (`import_map.json`) is also specified to resolve module imports.
 *
 * @async
 * @function installMod
 * @description Uses Deno's install command to install a module with full permissions.
 * @example
 * await installMod();
 */

import { $ } from 'bru'
import { NAME } from 'env'

export async function installMod() {
  await $`deno install -A --name ${NAME} main.ts --import-map=import_map.json -g -f`
}

installMod()
