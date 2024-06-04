import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  write: true,
  net: true,
  run: true,
  env: true,
} as DenoPermissions

export const options = {
  install: true,
  compile: false,
} as ModOptions
