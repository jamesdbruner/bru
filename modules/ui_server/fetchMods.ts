import type { ModulePermissions } from '@/types.ts'
import {
  $,
  collectAllFiles,
  getModulePermissions as fetchPermissions,
  srcDir,
} from 'bru'

export const getModules = async (): Promise<string[]> => {
  const modules: string[] = []
  const allFiles = await collectAllFiles(srcDir, /mod.ts/, ['perm.ts'])
  const moduleDirs = new Set(allFiles.map((file: string) => file.split('/')[1]))

  moduleDirs.forEach((dir: string) => {
    if (!dir.startsWith('.')) {
      modules.push(dir)
    }
  })
  return modules
}

export const getModulePermissions = async (
  moduleName: string,
): Promise<ModulePermissions> => {
  const permsFilePath = `.${srcDir}/${moduleName}/perm.ts`
  const permissions = await fetchPermissions(permsFilePath)
  return permissions
}

// deno-lint-ignore require-await
export const runModStream = async (
  cmd: string,
  args: string[],
): Promise<ReadableStream> => {
  const command = $`${cmd} ${args} --non-interactive`.stdout('piped')
  const child = command.spawn()
  const reader = child.stdout().getReader()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            controller.close()
            break
          }

          // Decode and then encode to ensure Uint8Array is passed
          const text = decoder.decode(value, { stream: true })
          controller.enqueue(encoder.encode(text))
        }
      } catch (error) {
        // Signal an error in the stream
        controller.error(error)
      } finally {
        reader.releaseLock()
      }
    },
    cancel() {
      reader.releaseLock()
    },
  })
}
