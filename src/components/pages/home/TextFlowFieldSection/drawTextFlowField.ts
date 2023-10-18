import type { InitCanvas } from '@/components/base/BaseCanvas'
import gsap from 'gsap'
import { Effect } from './effect'

export const initTextFlowField: InitCanvas = (ctx) => {
  let toggle = false
  const effect = new Effect(ctx)

  return {
    draw: (ctx, time) => {
      if (time !== 0 && time % 3000 < 3000) {
        toggle = !toggle
        if (toggle) {
          effect.text = 'TS'
          gsap.to(effect, { duration: 1, hue: 200 })
        } else {
          effect.text = 'JS'
          gsap.to(effect, { duration: 1, hue: 40 })
        }
        effect.updateFlowField()
      }

      effect.render()
    },
  }
}
