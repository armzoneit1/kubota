export const localStorageSave = (key: string, value: any) => {
  let valueToSave = value
  if (typeof value === "object") {
    valueToSave = JSON.stringify(value)
  }
  localStorage.setItem(key, valueToSave)
}

export const localStorageLoad = (key: string, parseJson = false) => {
  const value = localStorage.getItem(key)
  if (value == null) {
    return undefined
  }
  if (parseJson) {
    return JSON.parse(value)
  } else {
    return value.replace(/^"(.*)"$/, "$1")
  }
}

export const localStorageRemove = (keys: string | string[]) => {
  keys = !Array.isArray(keys) ? [keys] : keys
  keys.forEach((key) => localStorage.removeItem(key))
  sessionStorage.clear()
}
