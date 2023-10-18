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
  newAngle: number
  angleCorrector: number
  speedModifier: number
  timer: number
  hue: number
  saturationLightness: string[]
  lineWidth: number
  opacity: number

  constructor(effect: Effect) {
    this.effect = effect
    this.x = ~~(Math.random() * this.effect.width)
    this.y = ~~(Math.random() * this.effect.height)
    this.speedX = 0
    this.speedY = 0
    this.speedModifier = ~~(Math.random() * 5) + 1
    this.history = [{ x: this.x, y: this.y }]
    this.maxLength = ~~(Math.random() * 10) + 5
    this.angle = 45
    this.newAngle = 45
    this.angleCorrector = Math.random() * 0.5 + 0.01
    this.timer = this.maxLength * 2
    this.lineWidth = Math.random() * 10
    this.hue = ~~(Math.random() * 50)
    this.saturationLightness = [
      ['100%', '20%'],
      ['90%', '30%'],
      ['70%', '40%'],
      ['60%', '50%'],
      ['70%', '60%'],
      ['90%', '70%'],
      //  ['100%', '80%)'],
    ][~~(Math.random() * 6)] ?? ['60%', '50%)']
    this.opacity = 1 - this.lineWidth / 10
  }

  draw() {
    this.effect.ctx.strokeStyle = `hsl(${
      this.hue + this.effect.hue
    } ${this.saturationLightness.join(' ')} / ${this.opacity})`

    this.effect.ctx.lineWidth = this.lineWidth
    this.effect.ctx.lineCap = 'round'

    // this.effect.ctx.fillRect(this.x - 5, this.y - 5, 10, 10)
    this.effect.ctx.beginPath()
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
      if (this.effect.flowField[index]) {
        this.newAngle = this.effect.flowField[index]?.colorAngle ?? 0
        if (this.angle > this.newAngle) this.angle -= this.angleCorrector
        else if (this.angle < this.newAngle) this.angle += this.angleCorrector
        else this.angle = this.newAngle
        // this.angle = this.newAngle
      }

      this.speedX = Math.cos(this.angle)
      this.speedY = Math.sin(this.angle)
      this.x += this.speedX * this.speedModifier
      this.y += this.speedY * this.speedModifier

      this.history.push({ x: this.x, y: this.y })
      if (this.history.length > this.maxLength) this.history.shift()
    } else if (this.history.length > 1) {
      return this.history.shift()
    } else {
      this.reset()
    }
  }
  reset() {
    let attempts = 0
    let resetSuccess = false
    const maxAttempts = ~~((this.effect.width * this.effect.height) / 25000)

    while (attempts < maxAttempts && !resetSuccess) {
      attempts++
      const testIndex = ~~(Math.random() * this.effect.flowField.length)
      const testCell = this.effect.flowField[testIndex]

      if (testCell && testCell.alpha > 0) {
        this.x = testCell.x
        this.y = testCell.y
        this.history = [{ x: this.x, y: this.y }]
        this.timer = this.maxLength * 2
        resetSuccess = true
      }
      if (!resetSuccess) {
        this.x = Math.random() * this.effect.width
        this.y = Math.random() * this.effect.height
        this.history = [{ x: this.x, y: this.y }]
        this.timer = this.maxLength * 2
        this.angle = 0
      }
    }
  }
}
