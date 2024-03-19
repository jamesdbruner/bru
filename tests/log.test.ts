import { assert, log } from 'bru'

Deno.test('Logger utility test', () => {
  const consoleLog = console.log
  let logCalled = false

  // Mock console.log to track if it's called
  console.log = (...args) => {
    logCalled = true
    consoleLog(...args)
  }

  // Call log with type 'log'
  log('Log')
  log.error('Error')
  log.warn('Warn')
  log.info('Info')

  // Check if console.log was called
  assert(logCalled, 'Logger did not call console.log')

  // Reset console.log to its original function
  console.log = consoleLog
})
