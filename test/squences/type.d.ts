import { HistoryBaseLocation } from '../../src/client'

export interface Step {
  (location?: HistoryBaseLocation): void
}

export interface Done {
  (...args: unknown[]): void
}

export interface Subscribe {
  (next: Function): Function
}