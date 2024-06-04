/**
 * Presents a selection menu using a list of options where each option can potentially trigger an action.
 * This function allows users to select an option from a list, and if the selected option has an associated action,
 * it executes that action. Actions are asynchronous functions that can perform any operation, such as executing
 * a command or modifying files. If no action is defined for an option, no operation is performed.
 *
 * @async
 * @function select
 * @param {ActionOption[]} items - An array of action options where each option contains a `label` for display and an optional `action` to execute.
 * @returns {Promise<void>} A promise that resolves after the selected action has been executed or immediately if there is no action.
 * @example
 * select([
 *   { label: 'Print Hello', action: async () => console.log('Hello') },
 *   { label: 'Exit', action: async () => Deno.exit(0) },
 *   { label: 'No Action' }
 * ]).then(() => console.log('Selected'));
 */

import { $ } from 'bru'

interface ActionOption {
  label: string
  action?: () => Promise<void>
}

async function select(items: ActionOption[]) {
  const options = items.map((option) => option.label)

  const index = await $.select({
    message: 'Select',
    options,
  })

  // Default to no-op if action is undefined
  const action = items[index].action || (() => Promise.resolve())
  await action()

  Deno.exit(0)
}

export default select
