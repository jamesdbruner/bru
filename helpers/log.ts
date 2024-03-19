export type LogType = 'log' | 'error' | 'warn' | 'info'
import { NAME } from '../env.ts'

function logger(defaultName = NAME) {
  const logMessage = (
    message: string,
    type: LogType = 'log',
    name: string = defaultName,
  ) => {
    const prefix = `[${name}]:`
    const prefixStyle = 'font-weight: bold;'
    const messageStyle = 'font-weight: normal;'

    console[type](
      `%c${prefix}%c ${message}`,
      prefixStyle,
      messageStyle,
    )
  }

  const baseLog = Object.assign(
    (message: string, name?: string) => logMessage(message, 'log', name),
    {
      error: (message: string, name?: string) =>
        logMessage(message, 'error', name),
      warn: (message: string, name?: string) =>
        logMessage(message, 'warn', name),
      info: (message: string, name?: string) =>
        logMessage(message, 'info', name),
    },
  )

  return baseLog
}

const log = logger()

export default log
