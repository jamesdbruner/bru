import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  env: true,
} as DenoPermissions

export const options = {
  name: 'snap',
  install: true,
  compile: false,
} as ModOptions
