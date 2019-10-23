/**
 * createApp at client
 */
import CreateHistoryMap, {
  useBasename,
  useBeforeUnload,
  useQueries,
  CreateHistory,
  ILWithBQ,
  BLWithBQ,
  History,
  ILWithQuery,
  BLWithQuery,
  LocationTypeMap,
  HistoryWithBFOL
} from 'create-history'
import defaultViewEngine from './viewEngine'
import { createCache, createMap, ReqError } from '../share/util'
import createMatcher from '../share/createMatcher'
import defaultAppSettings from '../share/defaultSettings'
import createController from './createController'
import {
  Settings,
  Matcher,
  Context,
  ControllerConstructor,
  Cache,
  HistoryLocation,
  Listener,
  Loader,
  Route,
  Callback
} from '../share/type'
import {
  InitController,
  Stop,
  ClientController,
  ClientControllerConstructor,
  App
} from './type'

export function createHistory(settings?: Settings): HistoryWithBFOL<
  LocationTypeMap['QUERY']['Base'],
  LocationTypeMap['QUERY']['Intact']
>{
  let finalAppSettings: Settings =
    Object.assign({ viewEngine: defaultViewEngine }, defaultAppSettings)
  finalAppSettings = Object.assign(finalAppSettings, settings)

  let chInit: CreateHistory<'NORMAL'> = CreateHistoryMap[finalAppSettings.type]
  return useBeforeUnload(useQueries(chInit))(finalAppSettings)
}

export function createHistoryWithBasename(settings?: Settings): HistoryWithBFOL<
  LocationTypeMap['BQ']['Base'],
  LocationTypeMap['BQ']['Intact']
>{
  let finalAppSettings: Settings =
    Object.assign({ viewEngine: defaultViewEngine }, defaultAppSettings)
  finalAppSettings = Object.assign(finalAppSettings, settings)

  let chInit: CreateHistory<'NORMAL'> = CreateHistoryMap[finalAppSettings.type]
  return useBeforeUnload(useQueries(useBasename(chInit)))(finalAppSettings)
}

function createApp(settings: Partial<Settings>): App {
  let finalAppSettings: Settings =
    Object.assign({ viewEngine: defaultViewEngine }, defaultAppSettings)

  finalAppSettings = Object.assign(finalAppSettings, settings)

  let {
    routes,
    viewEngine,
    loader,
    context,
    container,
    cacheAmount,
  } = finalAppSettings

  context = {
    ...finalAppSettings.context,
    ...settings.context,
  }

  let history = finalAppSettings.basename
    ? createHistoryWithBasename(finalAppSettings)
    : createHistory(finalAppSettings)

  let matcher: Matcher = createMatcher(routes || [])
  let currentController: ClientController | null = null
  let currentLocation: HistoryLocation | null = null
  let unlisten: Function | null = null
  let finalContainer: HTMLElement | null = null

  let cache: Cache<ClientController> = createCache(cacheAmount)

  function saveControllerToCache(controller: ClientController): void {
    cache.set(controller.location.raw, controller)
  }

  function getControllerFromCache(location: HistoryLocation): ClientController {
    return cache.get(location.raw)
  }

  function removeControllerFromCache(controller: ClientController): void {
    cache.remove(controller.location.raw)
  }

  function getContainer(): HTMLElement | null {
    if (finalContainer) {
      return finalContainer
    }
    if (typeof container === 'string') {
      return finalContainer = document.querySelector(container)
    } else {
      return finalContainer = container
    }
  }

  function render(targetPath: string | ILWithBQ | ILWithQuery): any {
    let location = typeof targetPath === 'string'
      ? history.createLocation(targetPath)
      : targetPath

    context.prevLocation = currentLocation

    let matches = matcher(location.pathname)

    if (!matches) {
      throw new ReqError(`Did not match any route with pathname:${location.pathname}`, 404)
    }

    let { path, params, controller } = matches

    let finalLocation: HistoryLocation = Object.assign({
      pattern: path,
      params,
      raw: location.pathname + location.search,
      basename: ''
    }, location)

    currentLocation = finalLocation

    let initController: InitController = createInitController(finalLocation)
    let iController: ControllerConstructor | Promise<ControllerConstructor> =
      loader(controller, finalLocation, context)

    if (Promise.resolve(iController) == iController) {
      return (<Promise<ControllerConstructor>>iController).then(initController)
    } else {
      return initController(<ControllerConstructor>iController)
    }
  }

  let controllers = createMap<ControllerConstructor, ClientControllerConstructor>()

  function wrapController(IController: ControllerConstructor): ClientControllerConstructor {
    if (controllers.has(IController)) {
      return controllers.get(IController) as ClientControllerConstructor
    }
    // implement the controller's life-cycle and useful methods
    class WrapperController extends IController {
      location: HistoryLocation
      context: Context
      history: History<BLWithQuery, ILWithQuery> | History<BLWithBQ, ILWithBQ>
      matcher: Matcher
      loader: Loader
      routes: Route[]
      constructor(location: HistoryLocation, context: Context) {
        super(location, context)
        this.location = location
        this.context = context
        this.history = history
        this.matcher = matcher
        this.loader = loader
        this.routes = routes || []
      }
      // update view
      public refreshView(view = this.render()) {
        renderToContainer(view, this)
      }
      // get container node
      public getContainer() {
        return getContainer()
      }
      // clear container
      public clearContainer() {
        clearContainer()
      }
      public saveToCache() {
        this.KeepAlive = true
        saveControllerToCache(this)
      }
      public removeFromCache() {
        this.KeepAlive = false
        removeControllerFromCache(this)
      }
      public getAllCache() {
        return cache.getAll()
      }
    }

    controllers.set(IController, WrapperController)

    return WrapperController as ClientControllerConstructor
  }

  function createInitController(location: HistoryLocation): InitController {
    const initController: InitController = (iController) => {
      if (currentLocation !== location) {
        return
      }

      destroyController()

      let controller = currentController = getControllerFromCache(location)
      let element: any | Promise<any> = null

      if (!!controller) {
        if (controller.restore) {
          element = controller.restore(location, context)
        } else {
          element = controller.init()
        }
        controller.location = location
        controller.context = context
      } else {
        let FinalController = wrapController(iController as ControllerConstructor)
        controller = currentController =
          createController(FinalController, location, context)

        element = controller.init()
      }

      // if controller#init|restore return false value, do nothing
      if (element == null) {
        return null
      }

      if (Promise.resolve(element) == element) {
        return (element as Promise<any>).then(result => {
          if (currentLocation !== location || result == null) {
            return null
          }
          return renderToContainer(result, controller)
        })
      }
      return renderToContainer(element, controller)
    }
    return initController
  }

  function renderToContainer(
    element: any
  ): any
  function renderToContainer(
    element: any,
    controller: ClientController
  ): any
  function renderToContainer(
    element: any,
    controller?: ClientController
  ): any {
    if (controller) {
      saveControllerToCache(controller)
    }

    if (!viewEngine) {
      return null
    }

    return viewEngine.render(element, controller, getContainer())
  }

  function clearContainer(): void {
    if (viewEngine && viewEngine.clear) {
      let container = getContainer()
      if (container) {
        return viewEngine.clear(container)
      }
    }
  }

  function destroyController(): void {
    if (currentController && !currentController.KeepAlive) {
      removeControllerFromCache(currentController)
    }
    if (currentController && currentController.destroy) {
      currentController.destroy()
      currentController = null
    }
  }

  let listeners: Listener[] = []

  function subscribe(listener: Listener): Stop {
    let index: number = listeners.indexOf(listener)
    if (index === -1) {
      listeners.push(listener)
    }
    return () => {
      let index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners = listeners.filter(fn => fn !== listener)
      }
    }
  }

  function publish(location: ILWithBQ | ILWithQuery): void {
    for (let i = 0, len = listeners.length; i < len; i++) {
      listeners[i](location, history)
    }
  }

  function start(): null
  function start(
    callback: Callback
  ): Stop
  function start(
    callback: Callback,
    shouldRenderWithCurrentLocation: boolean
  ): Stop
  function start(
    callback?: Callback,
    shouldRenderWithCurrentLocation?: boolean
  ): Stop | null {
    let listener: (location: ILWithBQ | ILWithQuery) => void = location => {
      let result = render(location)
      if (Promise.resolve(result) == result) {
        result.then(() => {
          publish(location)
        })
      } else {
        publish(location)
      }
    }
    unlisten = history.listen(listener)
    let unsubscribe: Stop | null = null
    if (typeof callback === 'function') {
      unsubscribe = subscribe(callback)
    }
    if (shouldRenderWithCurrentLocation !== false) {
      listener(history.getCurrentLocation())
    }
    return unsubscribe
  }

  function stop(): void {
    if (unlisten) {
      unlisten()
      destroyController()
      currentController = null
      currentLocation = null
      unlisten = null
      finalContainer = null
      listeners = []
    }
  }

  return {
    start,
    stop,
    render,
    history,
    subscribe,
  }
}

export default createApp