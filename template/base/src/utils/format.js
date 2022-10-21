import { isDef, isNumeric, isIOS } from './validate'
import { inBrowser } from './base'
import { windowWidth, windowHeight } from './dom'

export function addUnit(value) {
  if (!isDef(value)) {
    return undefined
  }

  return isNumeric(value) ? `${value}px` : String(value)
}

export function getSizeStyle(originSize) {
  if (isDef(originSize)) {
    const size = addUnit(originSize)
    return {
      width: size,
      height: size
    }
  }
}

export function getZIndexStyle(zIndex) {
  const style = {}
  if (zIndex !== undefined) {
    style.zIndex = +zIndex
  }
  return style
}

// cache
let rootFontSize

function getRootFontSize() {
  if (!rootFontSize) {
    const doc = document.documentElement
    const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize

    rootFontSize = parseFloat(fontSize)
  }

  return rootFontSize
}

function convertRem(value) {
  value = value.replace(/rem/g, '')
  return +value * getRootFontSize()
}

function convertVw(value) {
  value = value.replace(/vw/g, '')
  return (+value * windowWidth.value) / 100
}

function convertVh(value) {
  value = value.replace(/vh/g, '')
  return (+value * windowHeight.value) / 100
}

export function unitToPx(value) {
  if (typeof value === 'number') {
    return value
  }

  if (inBrowser) {
    if (value.includes('rem')) {
      return convertRem(value)
    }
    if (value.includes('vw')) {
      return convertVw(value)
    }
    if (value.includes('vh')) {
      return convertVh(value)
    }
  }

  return parseFloat(value)
}

const camelizeRE = /-(\w)/g

export const camelize = (str) => str.replace(camelizeRE, (_, c) => c.toUpperCase())

export const kebabCase = (str) =>
  str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')

export function padZero(num, targetLength = 2) {
  let str = num + ''

  while (str.length < targetLength) {
    str = '0' + str
  }

  return str
}

/** clamps number within the inclusive lower and upper bounds */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

function trimExtraChar(value, char, regExp) {
  const index = value.indexOf(char)

  if (index === -1) {
    return value
  }

  if (char === '-' && index !== 0) {
    return value.slice(0, index)
  }

  return value.slice(0, index + 1) + value.slice(index).replace(regExp, '')
}

export function formatNumber(value, allowDot = true, allowMinus = true) {
  if (allowDot) {
    value = trimExtraChar(value, '.', /\./g)
  } else {
    value = value.split('.')[0]
  }

  if (allowMinus) {
    value = trimExtraChar(value, '-', /-/g)
  } else {
    value = value.replace(/-/, '')
  }

  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g

  return value.replace(regExp, '')
}

// add num and avoid float number
export function addNumber(num1, num2) {
  const cardinal = 10 ** 10
  return Math.round((num1 + num2) * cardinal) / cardinal
}

// 获取URL参数
export function getUrlParams() {
  let theRequest = {}

  let i = window.location.href.indexOf('?')
  let j = window.location.href.indexOf('#')
  if (i !== -1) {
    let search =
      j === -1 || j < i
        ? window.location.href.substring(i + 1)
        : window.location.href.substring(i + 1, j)
    search = decodeURI(search)
    let strs = search.split('&')
    for (let i = 0; i < strs.length; i++) {
      const index = strs[i].indexOf('=')
      const key = strs[i].slice(0, index)
      const value = strs[i].slice(index + 1)
      theRequest[key] = unescape(value)
    }
  }
  return theRequest
}

/**
 * 将日期转换成IOS可处理的格式，解决NaN错误问题
 * @param time 时间字符串，格式例如：'2021-11-04 23:11:28:843'
 * @return '2021/11/04 23:11:28:843'
 */
export function IOSTimeFixer(time) {
  if (!isIOS) return time
  return time.replace(/\-/g, '/')
}
