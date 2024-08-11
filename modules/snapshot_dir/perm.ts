import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  env: true,
} as DenoPermissions

export const options = {
  name: 'snap',
  install: true,
  compile: false,
  ui: true,
  inputs: [
    {
      name: 'path',
      type: 'text',
      prompt: 'Enter the directory path to snapshot',
      defaultValue: '.',
    },
    {
      name: 'depth',
      type: 'number',
      prompt: 'Enter the depth of snapshot (default is 2)',
      defaultValue: 2,
    },
    {
      name: 'maxLines',
      type: 'number',
      prompt:
        'Enter the maximum number of lines for the snapshot (default is 50)',
      defaultValue: 50,
    },
  ],
} as ModOptions
