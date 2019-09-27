import createApp from './createApp'

export default createApp

export { createHistory } from './createApp'

export {
  App,
  ClientController
} from './type'

export {
  Route,
  Settings,
  CreateHistoryType,
  Params,
  Matches,
  Matcher,
  ViewEngine,
  ViewEngineRender,
  ViewEngineClear,
  Loader,
  LoadController,
  Context,
  HistoryBaseLocation,
  HistoryNativeLocation,
  Controller,
  ControllerConstructor,
  Cache,
  CacheStorage,
  AppMap,
  AppElement
} from '../lib/type'

export {
  Actions
} from 'create-history'