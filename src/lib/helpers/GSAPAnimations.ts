import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

interface GsapFadeInOptions {
  vars?: gsap.TweenVars
  /** @default 'down' */
  direction?: 'up' | 'down' | 'left' | 'right'
  /**
   * the percentage of the element's height that needs to be visible before the animation kicks in.
   * @default 0.25
   */
  threshold?: number
}

export function gsapFadeIn(targets: gsap.DOMTarget, options?: GsapFadeInOptions) {
  options = { direction: 'down', threshold: 0.25, ...options }

  const handler: IntersectionObserverCallback = (entries, self) => {
    const visibleElements = entries
      .map((entry) => {
        if (entry.isIntersecting) {
          self.unobserve(entry.target)
          return entry.target
        }
        return null
      })
      .filter(Boolean)

    gsap.fromTo(
      visibleElements,
      {
        opacity: 0,
        ...(options?.direction === 'up'
          ? { yPercent: 20 }
          : options?.direction === 'down'
          ? { yPercent: -20 }
          : options?.direction === 'left'
          ? { xPercent: 20 }
          : options?.direction === 'right'
          ? { xPercent: -20 }
          : {}),
      },
      {
        opacity: 1,
        yPercent: 0,
        xPercent: 0,
        duration: 1,
        delay: 0.5,
        stagger: 0.15,
        ...options?.vars,
      }
    )
  }

  gsap.set(targets, { opacity: 0 })
  const observer = new IntersectionObserver(handler, { threshold: options.threshold })
  gsap.utils.toArray<Element>(targets).forEach((el: Element) => observer.observe(el))
}

interface GsapFloatingOptions {
  vars?: gsap.TweenVars
}

export function gsapFloating(
  targets: { el: gsap.DOMTarget; amount: number }[],
  options?: GsapFloatingOptions
) {
  gsap.registerPlugin(ScrollTrigger)

  targets.forEach((item) =>
    gsap.fromTo(
      item.el,
      { translateY: item.amount },
      {
        translateY: item.amount * -1,
        scrollTrigger: {
          trigger: item.el,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play pause play pause',
          scrub: 1,
        },
        ...options?.vars,
      }
    )
  )
}
