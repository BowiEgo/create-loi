import { createBEM } from './bem'

const DEFAULT_PREFIX = 'my'

export function createNamespace(name, prefix) {
  const prefixedName = prefix ? `${DEFAULT_PREFIX}-${name}` : name
  return [prefixedName, createBEM(prefixedName), name]
}
