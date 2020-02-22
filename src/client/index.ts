///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////
import createApp from './createApp'
export default createApp
export * from './createApp'

///////////////////////////////////////////////////////////////////////////////
// TYPES
///////////////////////////////////////////////////////////////////////////////
export * from '../index'

import type {
  History,
  ILWithBQ,
  BLWithBQ,
  HistoryWithBFOL,
  LocationTypeMap,
  BLWithQuery,
  ILWithQuery
} from 'create-history'
import type {
  Context,
  Callback,
  ControllerConstructor,
  Listener,
  HistoryLocation,
  Matcher,
  Route,
  Loader,
  Controller
} from '../index'

export interface ClientController extends Controller {
  location: HistoryLocation
  context: Context
  history: History<BLWithBQ, ILWithBQ> | History<BLWithQuery, ILWithQuery>
  matcher: Matcher
  loader: Loader
  routes: Route[]
}

export interface ClientControllerConstructor {
  new(
    location: HistoryLocation,
    context: Context
  ): ClientController
}

export interface Render {
  (targetPath: string | ILWithBQ | ILWithQuery): unknown
}

export interface Start {
  (
    callback?: Callback,
    shouldRenderWithCurrentLocation?: boolean
  ): Stop | null
}

export interface Stop {
  (): void
}

export interface Subscribe {
  (listener: Listener): () => void
}

export interface App {
  start: Start
  stop: Stop
  render: Render
  history: HistoryWithBFOL<
      LocationTypeMap['BQ']['Base'],
      LocationTypeMap['BQ']['Intact']
    > | HistoryWithBFOL<
      LocationTypeMap['QUERY']['Base'],
      LocationTypeMap['QUERY']['Intact']
    >
  subscribe: Subscribe
}

export interface InitController {
  (
    c: ControllerConstructor | Promise<ControllerConstructor>
  ): unknown
}