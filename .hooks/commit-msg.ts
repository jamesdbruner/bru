import { log, parse } from 'bru'

const commit = Deno.args[0]

if (!commit) {
  log.error('Commit message file path not provided')
  Deno.exit(1)
}

try {
  const commitMsg = await Deno.readTextFile(commit)
  const parsedCommit = await parse(commitMsg.replace('!', ''))

  let errorMessage = ''

  // Check each component of the commit message
  if (!parsedCommit) {
    errorMessage +=
      "\n- Try a valid commit structure. e.g. 'feat: adds new feature'"
  } else {
    if (!parsedCommit.type) {
      errorMessage +=
        "\n- Try including a commit type. e.g. 'feat', 'fix', 'chore', 'docs', 'ci', 'refactor'"
    }
    if (!parsedCommit.subject) {
      errorMessage +=
        "\n- Try adding a commit subject. e.g. 'feat: adds new feature'"
    }
  }

  // If there are errors, log them and exit
  if (errorMessage) {
    log.error(
      `Commits should follow conventional commit standards: ${errorMessage} \n\n https://www.conventionalcommits.org/en/v1.0.0/`,
    )
    Deno.exit(1)
  }

  log('✅ Conventional commit')
} catch (error) {
  log.error(`Error reading commit message: ${error.message}`)
  Deno.exit(1)
}
