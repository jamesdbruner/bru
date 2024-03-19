import { DenoPermissions } from '@/types.ts'

export default {
  read: true,
  write: true,
  net: true,
} as DenoPermissions

export const options = {
  install: false,
  compile: false,
}
