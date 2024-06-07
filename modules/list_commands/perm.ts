import { DenoPermissions, ModOptions } from '@/types.ts'

export default {
  read: true,
  env: true,
} as DenoPermissions

export const options = {
  name: 'blist', // bru list
  install: true,
  compile: true,
} as ModOptions
