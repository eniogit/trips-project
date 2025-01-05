import { createLogger, format, transports } from 'winston'

type LogLevel = 'emerg' | 'error' | 'warn' | 'info' | 'debug'

function consoleFormat(label: string) {
  return format.combine(
    format.label({ label }),
    format.timestamp(),
    format.printf((info) => {
      const { timestamp, label, level, message } = info
      return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`
    }),
    format.colorize({ all: true }),
  )
}

export function createNewLogger(label: string, level: LogLevel = 'info') {
  return createLogger({
    level,
    transports: [new transports.Console({ format: consoleFormat(label) })],
  })
}
