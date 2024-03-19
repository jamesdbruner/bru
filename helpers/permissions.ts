/**
 * Fetches permissions for a given module from its permissions file.
 *
 * @param permsFilePath - The path to the permissions file.
 * @returns A promise that resolves to the permissions object for the module.
 */

import { DenoPermissions, ModOptions } from '@/types.ts'
import { log } from 'bru'

export interface ModulePermissions {
  default: DenoPermissions
  options: ModOptions
}

export async function getModulePermissions(
  permsFilePath: string,
): Promise<ModulePermissions> {
  try {
    const permissionsModule = await import(permsFilePath)
    return {
      default: permissionsModule.default,
      options: permissionsModule.options,
    }
  } catch (error) {
    log.error(
      `Error loading permissions file at ${permsFilePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    return { default: {}, options: {} } // Default to no permissions if the file is not found
  }
}

export default getModulePermissions
