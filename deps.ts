// External dependencies
export { $ } from 'dax'
export { parse } from 'https://deno.land/x/commit@0.1.5/mod.ts'
export { writeText } from 'https://deno.land/x/copy_paste@v1.1.3/mod.ts'
export { assert } from 'https://deno.land/std@0.212.0/assert/mod.ts'
export { join } from 'https://deno.land/std@0.214.0/path/mod.ts'
export { OpenAI } from 'openai/mod.ts'

// Internal utilities
export * as fs from 'fs'
export { default as log } from 'log'

// Helper functions
export { default as walkMod } from 'helpers/walk_mod.ts'
export { default as saveFile } from 'helpers/save_file.ts'
export { default as select } from 'helpers/select.ts'
export { default as snapshot } from 'helpers/snapshot.ts'
export { default as codeFence } from './helpers/openai/code_fence.ts'
export { default as getModulePermissions } from 'helpers/permissions.ts'
export { binDir, denoBin, denoDir, homeDir, srcDir } from 'helpers/constants.ts'

// Prompt functions
export { default as getArgs } from './helpers/prompts/get_args.ts'
export { default as overwrite } from 'helpers/prompts/overwrite.ts'
export { default as clipboard } from 'helpers/prompts/clipboard.ts'

// OpenAI functions
export { default as model } from 'helpers/openai/model.ts'
export { default as instance } from 'openai_init'
export { default as stream } from 'stream'
export { default as chat } from 'helpers/openai/chat.ts'
export { default as chatLoop } from 'helpers/openai/chat_loop.ts'
export { default as summarizeFile } from 'helpers/openai/summarize_file.ts'
export { default as createCompletion } from 'helpers/openai/create_completion.ts'
export { default as saveCopyExit } from './helpers/prompts/save_copy_exit.ts'
