import { DenoPermissions } from '@/types.ts'

export default {
  read: true,
  net: true,
  run: true,
  env: true,
} as DenoPermissions

export const options = {
  install: true,
  compile: true,
}