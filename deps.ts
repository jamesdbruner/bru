// External dependencies
export type { ProgressBar } from 'dax'
export { $ } from 'dax'
export { assert } from '@std/assert'
export {
  basename,
  dirname,
  extname,
  fromFileUrl,
  join,
  relative,
} from '@std/path'
export { OpenAI } from 'openai'
export { parse } from 'commit'
export { parse as parseYaml, stringify } from '@std/yaml'
export { default as clipboardy } from 'clipboardy'
export { ensureDir, ensureFile, existsSync, walk } from '@std/fs'

// Helper functions
export { default as addFrontmatter } from 'helpers/add_frontmatter.ts'
export { default as codeFence } from 'helpers/openai/code_fence.ts'
export { default as findArg } from 'helpers/find_arg.ts'
export { default as getModulePermissions } from 'helpers/permissions.ts'
export { default as linkDirs } from './helpers/symlink_dirs.ts'
export { default as log } from 'helpers/log.ts'
export { default as processDirs } from 'helpers/process_dirs.ts'
export { default as processMods } from 'helpers/process_mods.ts'
export { default as saveFile } from 'helpers/save_file.ts'
export { default as select } from 'helpers/select.ts'
export { default as snapshot } from 'helpers/snapshot.ts'
export { default as toCapitalCase } from 'helpers/capital_case.ts'
export { collectAllFiles, default as walkMod } from 'helpers/walk_mod.ts'

// Helper Constants
export { binDir, denoBin, denoDir, homeDir, srcDir } from 'helpers/constants.ts'

// Caching helpers
export {
  CACHE_PATH,
  readFromCache,
  removeFromCache,
  writeToCache,
} from 'helpers/caching/cache.ts'
export {
  checkHashTable,
  ensureHashTable,
  HASHTABLE_PATH,
  removeFromHashTable,
  updateHashTable,
} from 'helpers/caching/hashtable.ts'
export { readFromConfig, writeToConfig } from 'helpers/caching/config.ts'
export { copyCachedFiles } from 'helpers/caching/copy_cached.ts'

// Prompt functions
export { default as clipboard } from 'helpers/prompts/clipboard.ts'
export { default as getArgs } from 'helpers/prompts/get_args.ts'
export { default as overwrite } from 'helpers/prompts/overwrite.ts'
export { default as saveCopyExit } from 'helpers/prompts/save_copy_exit.ts'
export { default as selectFile } from './helpers/prompts/select_file.ts'
export { default as selectFolders } from 'helpers/prompts/select_folders.ts'

// OpenAI functions
export { default as chat } from 'helpers/openai/chat.ts'
export { default as chatLoop } from 'helpers/openai/chat_loop.ts'
export { default as createCompletion } from 'helpers/openai/create_completion.ts'
export { default as instance } from 'helpers/openai/init.ts'
export { default as model } from 'helpers/openai/model.ts'
export { default as stream } from 'helpers/openai/stream_response.ts'
export { default as summarizeFile } from 'helpers/openai/summarize_file.ts'

// Environment variables
export { NAME, OPENAI_API_KEY } from 'env'
