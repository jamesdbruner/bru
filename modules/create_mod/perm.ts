import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  write: true,
  net: true,
  env: true,
} as DenoPermissions

export const options = {
  name: 'cmod',
  install: true,
  compile: false,
} as ModOptions
