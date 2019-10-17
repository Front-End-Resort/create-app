import {
  History,
  ILWithBQ,
  BLWithBQ,
  HistoryWithBFOL,
  LocationTypeMap,
  BLWithQuery,
  ILWithQuery
} from 'create-history'
import {
  Context,
  Callback,
  Settings,
  ControllerConstructor,
  Listener,
  HistoryLocation,
  HistoryBaseLocation,
  Matcher,
  Route,
  Loader,
  Controller
} from '../share/type'

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

interface CreateApp {
  (settings: Partial<Settings>): App
}

interface Render {
  (targetPath: string | ILWithBQ | ILWithQuery): any
}

interface Stop {
  (): void
}

interface Start {
  (
    callback?: Callback,
    shouldRenderWithCurrentLocation?: boolean
  ): Stop | null
}

interface Stop {
  (): void
}

interface Publish {
  (location: ILWithBQ | ILWithQuery): void
}

interface App {
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

interface Subscribe {
  (listener: Listener): () => void
}

interface InitController {
  (
    c: ControllerConstructor | Promise<ControllerConstructor>
  ): any
}

interface CreateInitController {
  (location: HistoryLocation): InitController
}

interface ClearContainer {
  (): void
}

interface DestoryContainer {
  (): void
}

interface GetContainer {
  (): HTMLElement | null
}

interface GetControllerByLocation {
  (location: HistoryLocation): ClientController
}

export interface CreateHistoryInCA {
  (setting?: Settings): HistoryWithBFOL<
    LocationTypeMap['BQ']['Base'],
    LocationTypeMap['BQ']['Intact']
  > | HistoryWithBFOL<
    LocationTypeMap['QUERY']['Base'],
    LocationTypeMap['QUERY']['Intact']
  >
}