/**
 * Utility function to extract the value of a command line argument that starts with a specified prefix.
 *
 * @param {string[]} args - The array of command line arguments.
 * @param {string} prefix - The prefix to look for in the command line arguments.
 * @returns {string | undefined} The value of the argument after the prefix, or undefined if not found.
 */

function findArg(args: string[], prefix: string): string | undefined {
  return args.find((arg) => arg.startsWith(prefix))?.split('=')[1] ?? undefined
}

export default findArg
