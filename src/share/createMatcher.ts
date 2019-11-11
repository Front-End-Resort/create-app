import pathToRegexp from 'path-to-regexp'
import * as _ from './util'
import { Route, IntactRoute, Matcher, Params, ControllerConstructor, LoadController } from './type'

export default function createMatcher(routes: Route[]): Matcher {
  const finalRoutes: IntactRoute[] = routes.map(createRoute)
  const routeLength: number = finalRoutes.length
  const matcher: Matcher = (pathname) => {
    let finalPathname = cleanPath(pathname)
    for (let i = 0; i < routeLength; i++) {
      let route: IntactRoute = finalRoutes[i]
      let strMatches: RegExpExecArray | null = route.regexp.exec(finalPathname)
      if (!strMatches) {
        continue
      }
      let params: Params = getParams(strMatches, route.keys)
      let controller = route.controller
      return {
        path: route.path,
        params,
        controller
      }
    }
    return null
  }

  return matcher
}

function createRoute(route: Route): IntactRoute {
  let finalRoute: Route = Object.assign({}, route)
  finalRoute.keys = []
  let keys: pathToRegexp.Key[] = finalRoute.keys
  let regexp = pathToRegexp(finalRoute.path, keys)
  let intactRoute: IntactRoute = Object.assign({ keys, regexp }, finalRoute)
  return intactRoute
}

function getParams(
  matches: RegExpExecArray,
  keys: pathToRegexp.Key[]
): Params {
  let params: Params = {}
  for (let i = 1, len = matches.length; i < len; i++) {
    let key = keys[i - 1]
    if (key) {
      if (typeof matches[i] === 'string') {
        params[key.name] = decodeURIComponent(matches[i])
      } else {
        params[key.name] = matches[i]
      }
    }
  }
  return params
}

function cleanPath(path: string): string {
  return path.replace(/\/\//g, '/')
}
