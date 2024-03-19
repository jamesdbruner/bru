import { $ } from 'bru'
import { NAME } from 'env'

export async function uninstallMod() {
  await $`deno uninstall ${NAME}`
}

uninstallMod()
