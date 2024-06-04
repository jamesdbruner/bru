/**
 * Retrieves command-line arguments based on a predefined configuration, or prompts the user for input
 * if arguments are not provided or left empty. The function supports a flexible definition for each argument
 * where it can accept direct values, arrays of values, or prompt the user interactively when needed.
 *
 * @export
 * @async
 * @param {Record<string, ArgConfig>} args A record where keys represent argument names and values describe
 * the arguments. Each ArgConfig can have:
 *  - `arg`: A direct value or array of values, or undefined to trigger a user prompt.
 *  - `prompt`: An optional custom prompt message for user input; defaults to "Enter [key]:" if omitted.
 * @returns {Promise<Record<string, string[]>>} Promise resolving to a record with each argument name and an array
 * of strings representing the resolved values.
 * @example
 * const argConfig = {
 *   'filename': { arg: undefined, prompt: 'Enter the filename:' }
 * };
 * getArgs(argConfig).then(args => {
 *   console.log(args['filename']); // Outputs user input for filename
 * });
 */

import $ from 'dax'

type ArgConfig = {
  arg: string | string[] | undefined
  prompt?: string
}

async function getArgs(
  args: Record<string, ArgConfig>,
): Promise<Record<string, string[]>> {
  const providedArgs: Record<string, string[]> = {}

  for (const [key, config] of Object.entries(args)) {
    let { arg, prompt } = config
    prompt = prompt || `Enter ${key}:`

    if (Array.isArray(arg)) {
      providedArgs[key] = arg
    } else if (typeof arg === 'undefined' || arg === '') {
      const userInput = await $.prompt(prompt)
      providedArgs[key] = userInput.includes(',')
        ? userInput.split(',').map((item) => item.trim())
        : [userInput]
    } else {
      providedArgs[key] = [arg]
    }
  }

  return providedArgs
}

export default getArgs
