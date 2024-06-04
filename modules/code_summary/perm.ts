import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  write: true,
  net: true,
  env: true,
} as DenoPermissions

export const options = {
  name: 'codesum',
  install: true,
  compile: true,
} as ModOptions
