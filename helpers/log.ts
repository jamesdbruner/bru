export type LogType = 'log' | 'error' | 'warn' | 'info'
import { NAME } from '../env.ts'

interface LogOptions {
  type?: LogType
  styles?: string
  name?: string
}

function logger(defaultName = NAME) {
  const logMessage = (
    message: string,
    {
      type = 'log',
      styles = '',
      name = defaultName,
    }: LogOptions = {},
  ) => {
    const prefix = `[%c${name}]:`
    const prefixStyle = 'font-weight: bold; '
    const messageStyle = 'font-weight: normal; '

    console[type](
      `${prefix} %c${message}`,
      prefixStyle,
      messageStyle,
      styles,
    )
  }

  const baseLog = Object.assign(
    (message: string, options?: LogOptions) =>
      logMessage(message, { ...options, type: 'log' }),
    {
      error: (message: string, options?: Omit<LogOptions, 'type'>) =>
        logMessage(message, { ...options, type: 'error' }),
      warn: (message: string, options?: Omit<LogOptions, 'type'>) =>
        logMessage(message, { ...options, type: 'warn' }),
      info: (message: string, options?: Omit<LogOptions, 'type'>) =>
        logMessage(message, { ...options, type: 'info' }),
    },
  )

  return baseLog
}

const log = logger()

export default log
