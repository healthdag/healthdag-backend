// * Logger utility for HealthLease application
// * Simple console-based logging with structured output
import { randomUUID } from 'crypto'

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: Record<string, unknown>
  requestId?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLog(level: LogLevel, message: string, data?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      requestId: randomUUID()
    }
  }

  private output(entry: LogEntry): void {
    if (this.isDevelopment) {
      console.log(`[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`, entry.data || '')
    } else {
      console.log(JSON.stringify(entry))
    }
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.output(this.formatLog(LogLevel.ERROR, message, data))
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.output(this.formatLog(LogLevel.WARN, message, data))
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.output(this.formatLog(LogLevel.INFO, message, data))
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.output(this.formatLog(LogLevel.DEBUG, message, data))
    }
  }
}

// * Export singleton instance
export const logger = new Logger()
export default logger
