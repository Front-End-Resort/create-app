// util

export let emptyList = []

export function isFn(obj) {
    return typeof obj === 'function'
}

export function isThenable(obj) {
    return obj != null && isFn(obj.then)
}

export function invoke(fn) {
    return fn()
}

export let isArr = Array.isArray

export function noop() {}

export function identity(obj) {
    return obj
}


export function extend(to, from) {
    if (!from) {
        return to
    }
    var keys = Object.keys(from)
    var i = keys.length
    while (i--) {
        to[keys[i]] = from[keys[i]]
    }
    return to
}

export function extends(to, ...source) {
    return source.reduce((result, from) => {
        return extend(result, from)
    }, to)
}


let uid = 0
export function getUid() {
    return ++uid
}

if (!Object.freeze) {
    Object.freeze = identity
}