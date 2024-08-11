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

/*
 * The options available for a module.
 *
 * @param compile - Whether the module can be compiled.
 * @param install - Whether the module can be installed.
 * @param name - The name of the module.
 * @param ui - Whether the module should be executable in the user interface.
 * @param ui_prompt - Whether the module should prompt the user for an openai prompt in the ui.
 * @param inputs - An array of input objects defining the inputs required for the module.
 */
export interface ModOptions {
  compile?: boolean
  install?: boolean
  name?: string
  ui?: boolean
  ui_prompt?: boolean // deprecate soon (use inputs instead)
  inputs?: ModuleInput[]
}

/*
 * The structure of each input object in the inputs array.
 *
 * @param name - The name of the input.
 * @param type - The type of the input (e.g., 'text', 'number').
 * @param prompt - The prompt message to display to the user.
 * @param defaultValue - The default value for the input.
 * @param description - A description of the input.
 */
export interface ModuleInput {
  name: string
  type: 'text' | 'textarea' | 'number' | 'toggle' | 'folder'
  prompt: string
  defaultValue: string | number | boolean | undefined
  description?: string
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
