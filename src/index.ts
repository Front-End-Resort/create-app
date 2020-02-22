///////////////////////////////////////////////////////////////////////////////
// MODULES
///////////////////////////////////////////////////////////////////////////////
export * as client from './client'
export * as server from './server'

///////////////////////////////////////////////////////////////////////////////
// TYPES
///////////////////////////////////////////////////////////////////////////////
import type { Key, Path } from 'path-to-regexp'
import type {
  History,
  HistoryOptions,
  ILWithBQ,
  BLWithBQ,
  BLWithQuery,
  ILWithQuery
} from 'create-history'

export type CreateHistoryType = 'createHistory' | 'createHashHistory' | 'createMemoryHistory'

export interface Route {
  keys?: Key[]
  regexp?: RegExp
  path: Path
  controller: unknown
}

export interface IntactRoute {
  keys: Key[]
  regexp: RegExp
  path: Path
  controller: unknown
}

export interface Params {
  [propName: string]: unknown
}

export interface Matches<C> {
  path: Path
  params: Params
  controller: unknown
}

export interface Matcher {
  <C extends Controller>(pathname: string): Matches<C> | null
}

export interface ViewEngine<
  E = string,
  C extends Controller = Controller
> {
  render: ViewEngineRender<E, C>
  clear?: ViewEngineClear
}

export interface ViewEngineClear {
  (container: Element): void
}

export interface EntireSettings extends HistoryOptions {
  container: string | HTMLElement
  basename: string
  context: Context
  type: CreateHistoryType
  loader: Loader
  cacheAmount?: number
  routes: Route[]
  viewEngine: ViewEngine<any, Controller>
}

export type Settings = HistoryOptions & Partial<{
  container: string | HTMLElement
  basename: string
  context: Partial<Context>
  type: CreateHistoryType
  loader: Loader
  cacheAmount?: number
  routes: Route[]
  viewEngine: ViewEngine<any, Controller>
}>

export type Listener = Function

export type Callback = Function

export interface Context {
  isClient: boolean
  isServer: boolean
  prevLocation: object | null
  location: HistoryBaseLocation
  [propName: string]: unknown
}

export interface HistoryBaseLocation extends BLWithBQ {
  raw?: string
  pattern?: Path
  params?: Params
}

export interface HistoryLocation extends ILWithBQ {
  raw: string
  pattern: Path
  params: Params
}

export interface Loader {
  (
    controller: any
  ): ControllerConstructor | Promise<ControllerConstructor>
  (
    controller: any,
    location: HistoryLocation
  ): ControllerConstructor | Promise<ControllerConstructor>
  (
    controller: any,
    location: HistoryLocation,
    context: Context
  ): ControllerConstructor | Promise<ControllerConstructor>
  (
    controller: any,
    location?: HistoryLocation,
    context?: Context
  ): ControllerConstructor | Promise<ControllerConstructor>
}

export interface LoadController {
  (
    location?: HistoryLocation,
    context?: Context
  ): ControllerConstructor | Promise<ControllerConstructor>
}

export interface Controller {
  KeepAlive?: boolean
  count?: number
  location?: HistoryLocation
  context?: Context
  history?: History<BLWithBQ, ILWithBQ> | History<BLWithQuery, ILWithQuery>
  matcher?: Matcher
  loader?: Loader
  routes?: Route[]
  restore?(location?: HistoryLocation, context?: Context): unknown
  init(): unknown | Promise<unknown>
  render(): unknown
  destroy?(): void
  getContainer?(): HTMLElement | null
  refreshView?(): void
}

export interface ControllerConstructor<C extends Controller = Controller> {
  new(
    location?: HistoryLocation,
    context?: Context
  ): C
}

export interface Cache<T> {
  keys: () => string[]
  get: (key: string) => T
  set: (key: string, value: T) => void
  remove: (key: string) => void
  getAll: () => CacheStorage<T>
}

export interface CacheStorage<T> {
  [key: string]: T
}

export interface AppMap<K, V> {
  get: (key: K) => V | undefined
  set: (key: K, value: V) => void
  has: (key: K) => boolean
  remove: (key: K) => void
}

export interface MapItem<K, V> {
  key: K
  value: V
}

export interface ViewEngineRender<
  E = string,
  C extends Controller = Controller
> {
  (
    element: E
  ): unknown
  (
    element: E,
    controller: C
  ): unknown
  (
    element: E,
    controller: C,
    container: Element | null
  ): unknown
}