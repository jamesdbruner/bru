/**
 * Converts a date string to a human-readable "time ago" format.
 *
 * @param {string} mtime - The modification time as a string.
 * @returns {string} A human-readable string representing how much time has passed since the date, e.g., "3 hours ago".
 */

function timeAgo(mtime: string) {
  const modTime = new Date(mtime).getTime()
  const currentTime = Date.now()

  // Difference in milliseconds
  const timeDiff = currentTime - modTime

  // Convert to minutes
  const minutes = Math.round(timeDiff / 60000)

  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  // Choose the most appropriate unit based on the length of time
  if (days > 1) {
    return `${days} days ago`
  } else if (hours > 1) {
    return `${hours} hours ago`
  } else if (minutes > 1) {
    return `${minutes} minutes ago`
  } else {
    return `Just now`
  }
}

export default timeAgo
