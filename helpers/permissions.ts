/**
 * Fetches permissions for a given module from its permissions file.
 *
 * @param permsFilePath - The path to the permissions file.
 * @returns A promise that resolves to the permissions object for the module.
 */

import { log } from 'bru'
import type { DenoPermissions, ModOptions } from '@/types.ts'

export interface ModulePermissions {
  default: DenoPermissions
  options: ModOptions
}

export async function getModulePermissions(
  permsFilePath: string,
): Promise<ModulePermissions> {
  try {
    const permsMod = await import(permsFilePath)
    return {
      default: permsMod.default,
      options: permsMod.options,
    }
  } catch (error) {
    log.error(
      `${permsFilePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    // Default to no permissions if the file is not found
    return { default: {}, options: {} }
  }
}

export default getModulePermissions
