import { $ } from 'bru'

interface ActionOption {
  label: string
  action?: () => Promise<void>
}

async function select(items: ActionOption[]) {
  const options = items.map((option) => option.label)

  const index = await $.select({
    message: 'What would you like to do next?',
    options,
  })

  // Default to no-op if action is undefined
  const action = items[index].action || (() => Promise.resolve())
  await action()

  Deno.exit(0)
}

export default select
