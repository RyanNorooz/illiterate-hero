import type { Effect } from './effect'

export class Particle {
  effect: Effect
  x: number
  y: number
  speedX: number
  speedY: number
  history: { x: number; y: number }[]
  maxLength: number
  angle: number
  speedModifier: number
  timer: number
  lineWidth: number
  hue: number
  saturationLightness: string[]
  opacity: number
  color: string

  constructor(effect: Effect) {
    this.effect = effect
    this.x = ~~(Math.random() * this.effect.width)
    this.y = ~~(Math.random() * this.effect.height)
    this.speedX = 0
    this.speedY = 0
    this.speedModifier = ~~(Math.random() * 3 + 1)
    this.history = [{ x: this.x, y: this.y }]
    this.maxLength = ~~(Math.random() * 200 + 10)
    this.angle = 0
    this.timer = this.maxLength * 2
    this.hue = ~~(Math.random() * 20) - 10
    this.saturationLightness = [
      // ['100%', '20%'],
      // ['90%', '30%'],
      ['70%', '40%'],
      // ['60%', '50%'],
      // ['70%', '60%'],
      // ['90%', '70%'],
      // ['100%', '80%'],
    ][~~(Math.random() * 6)] ?? ['60%', '50%)']
    this.lineWidth = Math.random()
    this.opacity = 1 - this.lineWidth
    this.color = `hsl(${this.hue} ${this.saturationLightness.join(' ')} / ${this.opacity})`

    this.effect.ctx.lineCap = 'round'
    this.effect.ctx.lineJoin = 'round'
  }
  draw() {
    // this.effect.ctx.fillStyle = this.color
    this.effect.ctx.strokeStyle = this.color
    this.effect.ctx.lineWidth = this.lineWidth

    // this.effect.ctx.fillRect(this.x - 5, this.y - 5, 10, 10)
    this.effect.ctx.beginPath()
    // this.effect.ctx.arc(this.x, this.y, this.lineWidth * 10, 0, Math.PI * 2)
    // this.effect.ctx.fill()

    this.effect.ctx.moveTo(this.history[0]?.x ?? this.x, this.history[0]?.y ?? this.y)
    for (let i = 0; i < this.history.length; i++)
      this.effect.ctx.lineTo(this.history[i]?.x ?? this.x, this.history[i]?.y ?? this.y)
    this.effect.ctx.stroke()
  }
  update() {
    this.timer--
    if (this.timer >= 1) {
      const x = ~~(this.x / this.effect.cellSize)
      const y = ~~(this.y / this.effect.cellSize)
      const index = y * this.effect.cols + x
      this.angle = this.effect.flowField[index] ?? 0

      this.speedX = Math.sin(this.angle)
      this.speedY = Math.cos(this.angle)
      this.x += this.speedX * this.speedModifier
      this.y += this.speedY * this.speedModifier

      this.history.push({ x: this.x, y: this.y })
      if (this.history.length > this.maxLength) this.history.shift()
    } else if (this.history.length) {
      this.history.shift()
    } else {
      this.reset()
    }
  }
  reset() {
    this.x = ~~(Math.random() * this.effect.width)
    this.y = ~~(Math.random() * this.effect.height)
    this.history = [{ x: this.x, y: this.y }]
    this.timer = this.maxLength * 2
  }
}
