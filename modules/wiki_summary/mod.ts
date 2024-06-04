import { getArgs, instance, log, model, OpenAI, stream } from 'bru'

const { subject } = await getArgs({
  subject: {
    arg: Deno.args.join(' '),
  },
})

log(`Loading ${subject}`)

// Interpret and refine the user's query
const interpretationResponse = await instance.chat.completions.create({
  model,
  messages: [{
    role: 'system',
    content:
      `Guess what the Wikipedia articles title would be, for the given subject matter: ${subject}. ONLY respond with a few words and nothing else, NO explaination.`,
  }],
})

const refinedQuery = interpretationResponse?.choices[0]?.message?.content
  ?.trim()?.replace(/"/, '')

log.info(`Researching ${refinedQuery}`)

// Search Wikipedia for relevant article titles
log('Searching Wikipedia')
const searchResponse = await fetch(
  `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${
    encodeURIComponent(refinedQuery || 'Bayes Theorem')
  }&format=json`,
)

if (!searchResponse.ok) {
  log.error(`Failed to search Wikipedia for '${refinedQuery}'`)
  Deno.exit(1)
}

const searchData = await searchResponse.json()
if (searchData.query.search.length === 0) {
  log(`No Wikipedia articles found for '${refinedQuery}'.`)
  Deno.exit(0)
}

const relevantTitle = searchData.query.search[0].title

// Fetch the Wikipedia summary of the most relevant article
log('Fetching article')
const summaryResponse = await fetch(
  `https://en.wikipedia.org/api/rest_v1/page/summary/${
    encodeURIComponent(relevantTitle)
  }`,
)

if (!summaryResponse.ok) {
  log.error('Failed to fetch Wikipedia summary')
  Deno.exit(1)
}

const summaryData = await summaryResponse.json()

// Summarize the Wikipedia article
log('Summarizing article. \n')
log('\n', { name: 'ai' })

// Define the ChatCompletionCreateParamsNonStreaming object
const chatCompletionParams: OpenAI.ChatCompletionCreateParamsStreaming = {
  model,
  messages: [{
    role: 'system',
    content:
      `Summarize this Wikipedia article: ${summaryData.extract}. Give 3 to 5 high level points and 2 specifics if you can.`,
  }],
  stream: true,
}

await stream(instance, chatCompletionParams)

Deno.exit(0)
