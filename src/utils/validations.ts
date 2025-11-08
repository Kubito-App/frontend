export function isValidString(value: unknown) {
  if (typeof value !== 'string') return false
  return undefined !== value && !!value && value.replace(/\s/g, '').length > 0
}

export function isValidArray(value: unknown) {
  return undefined !== value && !!value && Array.isArray(value) && value.length > 0
}
