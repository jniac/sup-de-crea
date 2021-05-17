export let windowHasLoaded = false
const windowHasLoadResolves = new Set()
window.addEventListener('load', () => {
  windowHasLoaded = true
  for (const resolve of windowHasLoadResolves) {
    resolve()
  }
})
export const windowLoad = () => new Promise(resolve => {
  if (windowHasLoaded) {
    resolve()
  } else {
    windowHasLoadResolves.add(resolve)
  }
})