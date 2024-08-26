import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  env: true,
  net: true,
  read: true,
  write: true,
} as DenoPermissions

export const options = {
  name: 'jtest',
  install: true,
  compile: true,
} as ModOptions
