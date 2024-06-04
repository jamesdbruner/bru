/**
 * Prepends frontmatter to the front of a string.
 *
 * @param content - The existing content of the document.
 * @param moduleName - The title to be used in the frontmatter.
 * @param description - The description to be used in the frontmatter.
 * @returns The new content with frontmatter prepended.
 */

const addFrontmatter = (
  content: string,
  moduleName: string,
  description: string,
): string => {
  const frontmatter = `---
title: ${moduleName}
description: ${description}
---

`
  return frontmatter + content
}

export default addFrontmatter
