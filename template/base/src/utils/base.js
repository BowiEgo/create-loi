export function noop() {}

export function promise(val) {
  return new Promise(resolve => {
    resolve(val)
  })
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const extend = Object.assign

export const inBrowser = typeof window !== 'undefined'
