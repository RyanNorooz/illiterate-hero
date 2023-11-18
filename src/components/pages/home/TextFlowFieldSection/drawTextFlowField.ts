import type { InitCanvas } from '@/components/base/BaseCanvas'
import gsap from 'gsap'
import { Effect } from './effect'

export const initTextFlowField: InitCanvas = (ctx) => {
  const effect = new Effect(ctx)

  return {
    draw: (ctx, time) => {
      if (time !== 0)
        if (~~(time / 1000) % 6 === 0) {
          effect.text = 'TS'
          gsap.to(effect, { duration: 1, hue: 200 })
          effect.updateFlowField()
        } else if (~~(time / 1000) % 3 === 0) {
          effect.text = 'JS'
          gsap.to(effect, { duration: 1, hue: 40 })
          effect.updateFlowField()
        }

      effect.render()
    },
  }
}
