import Router from 'next/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from 'react'

export function useNProgress() {
  useEffect(() => {
    nProgress.configure({ showSpinner: false })

    Router.events.on('routeChangeStart', nProgress.start)
    Router.events.on('routeChangeComplete', nProgress.done)
    Router.events.on('routeChangeError', nProgress.done)

    return () => {
      Router.events.off('routeChangeStart', nProgress.start)
      Router.events.off('routeChangeComplete', nProgress.done)
      Router.events.off('routeChangeError', nProgress.done)
    }
  }, [])
}

export function loadingSpinnerStart() {
  nProgress.configure({
    showSpinner: true,
    template:
      '<div class="bar" role="bar" style="display: none;"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
  })
  nProgress.start()
}

export function loadingSpinnerEnd() {
  nProgress.done()
  nProgress.configure({
    showSpinner: false,
    template:
      '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
  })
}
