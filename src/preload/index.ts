import { domReady } from './utils'
import { useLoading } from './loading'

const { appendLoading, removeLoading } = useLoading()

window.bridge = Object.assign(window.bridge || {}, {
  removeLoading,
})

; (async () => {
  await domReady()

  appendLoading()
})();
