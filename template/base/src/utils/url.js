export function parseURLQuery(url) {
  let result = {}
  const { searchParams } = new URL(url)

  for (let [key, value] of searchParams.entries()) {
    result[key] = value
  }

  return result
}
