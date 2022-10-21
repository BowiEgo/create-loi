export const numericProp = [Number, String]

export const makeNumericProp = (defaultVal) => ({
  type: numericProp,
  default: defaultVal
})
