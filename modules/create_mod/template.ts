/**
 * Template for new Deno modules.
 * Demonstrates argument parsing and basic logging.
 *
 * Usage:
 * Replace the core functionality as needed for your module development,
 * ensuring to adapt argument handling and logging to fit your requirements.
 */

import log from 'log'
import getArgs from '../../helpers/prompts/get_args.ts'

const { argument } = await getArgs({ argument: { arg: Deno.args[0] } })

log(`Argument: ${argument}`)
