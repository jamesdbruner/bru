import $ from 'dax'

type ArgConfig = {
  arg: string | string[] | undefined
  prompt?: string
}

async function getArgs(
  args: Record<string, ArgConfig>,
): Promise<Record<string, string[]>> {
  const providedArgs: Record<string, string[]> = {}

  for (const [key, config] of Object.entries(args)) {
    let { arg, prompt } = config
    prompt = prompt || `Enter ${key}:`

    if (Array.isArray(arg)) {
      providedArgs[key] = arg
    } else if (typeof arg === 'undefined' || arg === '') {
      const userInput = await $.prompt(prompt)
      providedArgs[key] = userInput.includes(',')
        ? userInput.split(',').map((item) => item.trim())
        : [userInput]
    } else {
      providedArgs[key] = [arg]
    }
  }

  return providedArgs
}

export default getArgs
