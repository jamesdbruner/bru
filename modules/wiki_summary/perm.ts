import type { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  net: true,
  env: true,
} as DenoPermissions

export const options = {
  name: 'wiki_summary',
  install: true,
  compile: false,
  ui: true,
  inputs: [
    {
      name: 'subject',
      type: 'textarea',
      prompt: 'Subject',
      defaultValue: 'Bayes Theorem',
    },
  ],
} as ModOptions
