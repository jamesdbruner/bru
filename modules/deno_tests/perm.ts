import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  all: true,
} as DenoPermissions

export const options = {
  name: 'dtest',
  install: true,
  compile: false,
} as ModOptions
