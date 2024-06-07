/**
 * Converts a kebab-case or snake_case string to Capital Case.
 *
 * @param {string} str - The input string in kebab-case or snake_case.
 * @returns {string} The string converted to capital case with spaces.
 */

function toCapitalCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default toCapitalCase
