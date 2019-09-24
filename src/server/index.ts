import createApp from './createApp'

export default createApp

export {
  App,
  Render,
  RenderToString
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
  RenderTo,
  Loader,
  LoadController,
  Context,
  HistoryBaseLocation,
  HistoryNativeLocation,
  ControllerConstructor,
  Controller,
  Cache,
  CacheStorage,
  AppMap,
  AppElement
} from '../share/type'

export {
  Actions
} from 'create-history'