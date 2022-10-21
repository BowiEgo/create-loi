import { inBrowser } from './base'

export function isDef(val) {
  return val !== undefined && val !== null
}

export function isValid(val) {
  return val !== undefined && val !== null && val !== ''
}

export function isNumeric(val) {
  return typeof val === 'number' || /^\d+(\.\d+)?$/.test(val)
}

export function isAndroid() {
  return inBrowser ? /android/.test(navigator.userAgent.toLowerCase()) : false
}

export function isIOS() {
  return inBrowser ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false
}
