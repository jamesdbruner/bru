import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  env: true,
  net: true,
  ffi: true,
  read: true,
  run: true,
  write: true,
} as DenoPermissions

export const options = {
  install: true,
  compile: true,
  name: 'watch',
} as ModOptions
