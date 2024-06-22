import { $, NAME } from 'bru'

export async function uninstallMod() {
  await $`deno uninstall ${NAME}`
}

uninstallMod()
