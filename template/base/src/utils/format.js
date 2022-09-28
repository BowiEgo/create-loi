import { isDef, isNumeric, isIOS } from './validate'

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
      height: size,
    }
  }
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
