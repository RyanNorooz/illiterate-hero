import type { InitCanvas } from '@/components/base/BaseCanvas'
import { Effect } from './effect'

export const initBasicFlowField: InitCanvas = (ctx) => {
  const effect = new Effect(ctx)

  return { draw: () => effect.render() }
}
