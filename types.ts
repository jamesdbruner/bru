export type DenoPermissionName =
  | 'env'
  | 'sys'
  | 'hrtime'
  | 'net'
  | 'ffi'
  | 'read'
  | 'run'
  | 'write'

export type DenoPermissions = {
  [Key in DenoPermissionName]?: boolean | string[]
}

export interface ModOptions {
  compile?: boolean
  install?: boolean
  name?: string
}

export interface ModulePermissions {
  default: DenoPermissions
  options: ModOptions
}

export type HashTable = {
  [key: string]: {
    [subdir: string]: string[]
  }
}
