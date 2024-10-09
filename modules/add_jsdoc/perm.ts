import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  write: true,
} as DenoPermissions

export const options = {
  name: 'jsdoc',
  install: true,
  compile: false,
  ui: false,
  inputs: [
    {
      name: 'path',
      type: 'text',
      prompt: 'File path',
      defaultValue: './modules/add_jsdoc/mod.ts',
    },
  ],
} as ModOptions
