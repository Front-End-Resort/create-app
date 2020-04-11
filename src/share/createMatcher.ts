import pathToRegexp from 'path-to-regexp'
import type { Key } from 'path-to-regexp'
import type { Route, IntactRoute, Matcher, Params } from '../index'

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
  let keys: Key[] = finalRoute.keys
  let regexp = pathToRegexp(finalRoute.path, keys)
  let intactRoute: IntactRoute = Object.assign({ keys, regexp }, finalRoute)
  return intactRoute
}

function getParams(
  matches: RegExpExecArray,
  keys: Key[]
): Params {
  let params: Params = {}
  for (let i = 1, len = matches.length; i < len; i++) {
    let key = keys[i - 1]
    if (key && matches[i]) {
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
