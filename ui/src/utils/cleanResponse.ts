/**
 * Cleans the response by removing [ai]: and [bru]: tags,
 * and trimming unnecessary whitespace and newlines.
 *
 * @param {string} response - The original response string.
 * @returns {string} - The cleaned response string.
 */

export const cleanResponse = (response: string): string => {
  return response
    .replace(/\[ai\]:\s*/g, '')
    .replace(/\[bru\]:\s*/g, '')
    .trim()
}

export default cleanResponse
