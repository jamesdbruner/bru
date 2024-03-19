/**
 * Module for listing installed Deno modules.
 * This script asynchronously iterates over the directory entries in the Deno binary directory,
 * collecting the names of all entries (presumably Deno-installed modules). It then logs
 * the directory path and a comma-separated list of the module names.
 *
 * @module ListInstalledModules
 */

import { denoBin, log } from 'bru'

async function listInstalledModules() {
  const list = []
  for await (const dirEntry of Deno.readDir(denoBin)) {
    list.push(dirEntry.name)
  }
  log(`${denoBin}\n\n [${list.join(', ')}]`)
}

listInstalledModules()
