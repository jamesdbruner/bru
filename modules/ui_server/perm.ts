import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  write: true,
  net: true,
  env: true,
  run: true,
} as DenoPermissions

export const options = {
  name: 'ui_server',
  install: true,
  compile: false,
  ui: false,
} as ModOptions
