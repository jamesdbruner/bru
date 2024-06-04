/**
 * Instantiate OpenAI API with given API key. Prompt the user for the key if one isn't found in their .env file int he root
 * @type {OpenAI}
 */

import { OPENAI_API_KEY } from 'env'
import $ from 'https://deno.land/x/dax@0.35.0/mod.ts'
import { log, OpenAI } from 'bru'

let USER_INPUT_API_KEY = ''

if (!OPENAI_API_KEY) {
  USER_INPUT_API_KEY = await $.prompt('Enter your OpenAI API key:', {
    mask: true,
  })
  // Note: only for the current Deno process
  Deno.env.set('OPENAI_API_KEY', USER_INPUT_API_KEY)

  log('To save your OpenAI API key for future sessions:')
  log('On Linux/macOS, add the following line to your .bashrc or .zshrc:')
  log(`export OPENAI_API_KEY="${OPENAI_API_KEY || USER_INPUT_API_KEY}"`)
  log(
    'On Windows, set the environment variable OPENAI_API_KEY via system properties.',
  )
}

const instance = new OpenAI({ apiKey: OPENAI_API_KEY || USER_INPUT_API_KEY })

export default instance
