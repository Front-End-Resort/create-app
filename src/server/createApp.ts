/**
 * createApp at server
 */
import {
  useBasename,
  useQueries,
  CreateHistory,
  createMemoryHistory,
  History,
  LocationTypeMap
} from 'create-history'
import { createMap, ReqError } from '../share/util'
import defaultViewEngine from './viewEngine'
import createMatcher from '../share/createMatcher'
import defaultAppSettings from '../share/defaultSettings'
import createController from './createController'
import {
  Settings,
  Context,
  ControllerConstructor,
  HistoryLocation,
  Matcher,
  Loader,
  Route,
  Callback
} from '../share/type'
import {
  App,
  InitControllerReturn,
  ServerController,
  ServerControllerConstructor
} from './type'

export function createHistory(settings?: Settings): History<
  LocationTypeMap['QUERY']['Base'],
  LocationTypeMap['QUERY']['Intact']
> {
  let finalAppSettings: Settings =
    Object.assign({ viewEngine: defaultViewEngine }, defaultAppSettings)
  finalAppSettings = Object.assign(finalAppSettings, settings)

  let chInit: CreateHistory<'NORMAL'> = createMemoryHistory
  return useQueries(chInit)(finalAppSettings)
}

export function createHistoryWithBasename(settings?: Settings): History<
  LocationTypeMap['BQ']['Base'],
  LocationTypeMap['BQ']['Intact']
>{
  let finalAppSettings: Settings =
    Object.assign({ viewEngine: defaultViewEngine }, defaultAppSettings)
  finalAppSettings = Object.assign(finalAppSettings, settings)

  let chInit: CreateHistory<'NORMAL'> = createMemoryHistory
  return useQueries(useBasename(chInit))(finalAppSettings)
}

export default function createApp(settings: Partial<Settings>): App {
  let finalAppSettings: Settings =
    Object.assign({ viewEngine: defaultViewEngine }, defaultAppSettings)

  finalAppSettings = Object.assign(finalAppSettings, settings)

  let {
    routes,
    viewEngine,
    loader,
    context
  } = finalAppSettings

  context = {
    ...finalAppSettings.context,
    ...settings.context,
  }

  let matcher = createMatcher(routes || [])
  let history = finalAppSettings.basename
    ? createHistoryWithBasename(finalAppSettings)
    : createHistory(finalAppSettings)

  function render(
    requestPath: string
  ): InitControllerReturn | Promise<InitControllerReturn>
  function render(
    requestPath: string,
    injectContext: Context | null
  ): InitControllerReturn | Promise<InitControllerReturn>
  function render(
    requestPath: string,
    callback: Callback
  ): InitControllerReturn | Promise<InitControllerReturn>
  function render(
    requestPath: string,
    injectContext: Context | null,
    callback: Callback
  ): InitControllerReturn | Promise<InitControllerReturn>
  function render(
    requestPath: string,
    injectContext?: Context | null | Callback,
    callback?: Callback
  ): InitControllerReturn | Promise<InitControllerReturn> {
    let result: InitControllerReturn | Promise<InitControllerReturn> | null = null

    if (typeof injectContext === 'function') {
      callback = injectContext
      injectContext = null
    }

    try {
      let controller = fetchController(requestPath, injectContext)
      if (Promise.resolve(controller) == controller) {
        result = (<Promise<ServerController>>controller).then(initController)
      } else {
        result = initController(controller as ServerController)
      }
    } catch (error) {
      callback && callback(error)
      return Promise.reject(error)
    }
    if (Promise.resolve(result) == result) {
      if (callback) {
        let cb: Function = callback
        result.then(result => cb(null, result), reason => cb(reason))
      }
      return result
    }
    callback && callback(null, result)
    return result
  }

  function initController(
    controller: ServerController
  ): InitControllerReturn | Promise<InitControllerReturn> {
    let component: any = controller.init()

    if (component === null) {
      return { controller: controller }
    }
    if (Promise.resolve(component) == component) {
      return component.then((component: any) => {
        if (component == null) {
          return { controller: controller }
        }
        return {
          content: renderToString(component, controller ),
          controller: controller
        }
      }) as Promise<InitControllerReturn>
    }
    return {
      content: renderToString(component, controller),
      controller: controller
    }
  }

  function fetchController(
    requestPath: string,
    injectContext?: Context | null
  ): ServerController | Promise<ServerController> {
    let location = history.createLocation(requestPath)
    let matches = matcher(location.pathname)

    if (!matches) {
      let error =
        new ReqError(`Did not match any route with path:${requestPath}`, 404)
      return Promise.reject(error)
    }

    let { path, params, controller } = matches

    let finalLocation: HistoryLocation = Object.assign({
      pattern: path,
      params,
      raw: location.pathname + location.search,
      basename: ''
    }, location)

    let finalContext: Context = {
      ...context,
      ...injectContext,
    }
    let iController: ControllerConstructor | Promise<ControllerConstructor> =
      loader(controller, finalLocation, finalContext)

    if (Promise.resolve(iController) == iController) {
      return (<Promise<ControllerConstructor>>iController).then(iController => {
        let Wrapper = wrapController(iController)
        return createController(Wrapper, finalLocation, finalContext)
      })
    }

    let Wrapper = wrapController(<ControllerConstructor>iController)
    return createController(Wrapper, finalLocation, finalContext)
  }


  let controllers = createMap<ControllerConstructor, ServerControllerConstructor>()

  function wrapController(iController: ControllerConstructor): ServerControllerConstructor {
    if (controllers.has(iController)) {
      return controllers.get(iController) as ServerControllerConstructor
    }

    // implement the controller's life-cycle and useful methods
    class WrapperController extends iController {
      location: HistoryLocation
      context: Context
      matcher: Matcher
      loader: Loader
      routes: Route[]
      constructor(location: HistoryLocation, context: Context) {
        super(location, context)
        this.location = location
        this.context = context
        this.matcher = matcher
        this.loader = loader
        this.routes = routes || []
      }
    }

    controllers.set(iController, WrapperController)
    return WrapperController
  }

  function renderToString(
    element: any
  ): any
  function renderToString(
    element: any,
    controller: ServerController
  ): any
  function renderToString(
    element: any,
    controller?: ServerController
  ): any {
    if (!viewEngine) {
      return null
    }

    if (controller) {
      return viewEngine.render(element, controller)
    } else {
      return viewEngine.render(element)
    }
  }

  return {
    render,
    history,
  }
}
