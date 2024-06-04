import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  net: true,
  env: true,
} as DenoPermissions

export const options = {
  name: 'wikisum',
  install: true,
  compile: true,
} as ModOptions
