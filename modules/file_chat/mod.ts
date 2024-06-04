import {
  chatLoop,
  codeFence,
  getArgs,
  instance,
  log,
  model,
  OpenAI,
  snapshot,
  stream,
} from 'bru'

const config = {
  file: { arg: Deno.args[0], prompt: 'Enter the file path:' },
  includeSnapshot: { arg: Deno.args[1], prompt: 'Include snapshot? (y/n):' },
  snapshotPath: { arg: Deno.args[2] ?? '.', prompt: 'Enter snapshot path:' },
  snapshotDepth: { arg: Deno.args[3] ?? '3', prompt: 'Enter snapshot depth:' },
  maxLines: { arg: Deno.args[4] ?? '20', prompt: 'Enter max lines:' },
}

const {
  file,
  includeSnapshot,
  snapshotPath,
  snapshotDepth,
  maxLines,
} = await getArgs(config)

let cwd = ''
const contents = await Deno.readTextFile(String(file))
const ignoreList = [
  '.git',
  'node_modules',
  'dist',
  '.cache',
  '.vscode',
  '.idea',
  '.DS_Store',
  'yarn.lock',
  'package-lock.json',
  '.gitignore',
  '.gitkeep',
  '.hooks',
  '.husky',
  '.bin',
]

if (includeSnapshot) {
  cwd = await snapshot(
    String(snapshotPath),
    parseInt(String(snapshotDepth)),
    ignoreList,
    parseInt(String(maxLines)),
  )
  log(cwd)
}

const messages: OpenAI.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content:
      'You are a helpful assistant. Focus on the file contents but if the user included a directory snapshot, keep that context in mind.',
  },
  {
    role: 'user',
    content: `File contents: "${file}": \n ${codeFence(contents)}`,
  },
  ...(includeSnapshot
    ? [{
      role: 'user' as const,
      content: `Directory structure: \n ${codeFence(cwd)}`,
    }]
    : []),
]

const chatCompletionParams: OpenAI.ChatCompletionCreateParamsStreaming = {
  model,
  messages,
  stream: true,
}

log('\n', { name: 'ai' })

const response = await stream(instance, chatCompletionParams)
await chatLoop(messages, response)
