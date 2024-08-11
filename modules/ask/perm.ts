import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  write: true,
  net: true,
  env: true,
} as DenoPermissions

export const options = {
  install: true,
  compile: true,
  ui: true,
  inputs: [
    {
      name: 'prompt',
      type: 'textarea',
      prompt: 'Your question',
      defaultValue: 'What is the meaning of life?',
    },
    {
      name: 'code',
      type: 'toggle',
      prompt: 'Concise',
      defaultValue: false,
      description:
        'Will return a more concise response, good for when asking for code snippets or regex patterns.',
    },
  ],
} as ModOptions
