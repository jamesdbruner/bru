import cleanResponse from '../utils/cleanResponse.ts'

export const copyToClipboard = async (text: string) => {
  const cleanedText = cleanResponse(text)
  try {
    await (navigator as any).clipboard.writeText(cleanedText)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}
