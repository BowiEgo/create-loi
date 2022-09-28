import { Fragment, isVNode } from 'vue'
import { isEmptyElement, isValid } from './validate'

export function flattenChildren(children = [], filterEmpty = true) {
  const temp = Array.isArray(children) ? children : [children]
  const res = []

  temp.forEach(child => {
    if (Array.isArray(child)) {
      res.push(...flattenChildren(child, filterEmpty))
    } else if (child && child.type === Fragment) {
      res.push(...flattenChildren(child.children, filterEmpty))
    } else if (child && isVNode(child)) {
      if (filterEmpty && !isEmptyElement(child)) {
        res.push(child)
      } else if (!filterEmpty) {
        res.push(child)
      }
    } else if (isValid(child)) {
      res.push(child)
    }
  })
  return res
}
