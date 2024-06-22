import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  net: true,
  read: true,
  write: true,
  env: true,
} as DenoPermissions

export const options = {
  install: true,
  compile: true,
  name: 'creadme',
} as ModOptions
