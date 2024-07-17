/**
 * Utility function to extract the value of a command line argument that starts with a specified prefix.
 * If the argument is present without a value, it returns true.
 *
 * @param {string[]} args - The array of command line arguments.
 * @param {string} prefix - The prefix to look for in the command line arguments.
 * @returns {string | boolean | undefined} The value of the argument after the prefix, true if present without a value, or undefined if not found.
 */
function findArg(args: string[], prefix: string): string | boolean | undefined {
  const arg = args.find((arg) => arg.startsWith(prefix))
  if (arg) {
    const [_, value] = arg.split('=')
    return value !== undefined ? value : true
  }
  return undefined
}

export default findArg
