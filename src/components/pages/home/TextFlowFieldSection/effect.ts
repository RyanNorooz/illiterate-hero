import { Particle } from './particle'

export class Effect {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  particles: Particle[]
  numberOfParticles: number
  cellSize: number
  rows: number
  cols: number
  flowField: { x: number; y: number; alpha: number; colorAngle: number }[]
  curve: number
  zoom: number
  text: string
  hue: number
  debug: boolean

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.width = this.ctx.canvas.width
    this.height = this.ctx.canvas.height
    this.particles = []
    this.numberOfParticles = 2000
    this.cellSize = 10
    this.rows = 0
    this.cols = 0
    this.flowField = []
    this.curve = 4
    this.zoom = 0.1
    this.text = 'JS'
    this.hue = 40
    this.debug = false
    this.init()

    window.addEventListener('keydown', (e) => e.key === 'd' && (this.debug = !this.debug))

    const resizeObserver = new ResizeObserver(() => this.resize())
    resizeObserver.observe(this.ctx.canvas)
  }
  drawText() {
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0)
    // gradient.addColorStop(0, '#fff')
    // gradient.addColorStop(0.25, '#888')
    // gradient.addColorStop(0.75, '#000')
    // gradient.addColorStop(1, '#888')

    for (let i = 0; i <= this.text.length; i++)
      gradient.addColorStop(i / this.text.length, i % 2 === 0 ? '#fff' : '#000')

    this.ctx.save()
    this.ctx.fillStyle = gradient
    this.ctx.font = '500px Impact'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(this.text, this.width * 0.5, this.height * 0.5)
    this.ctx.restore()
  }
  updateFlowField() {
    // draw text
    this.drawText()

    // scan pixel data
    const pixels = this.ctx.getImageData(0, 0, this.width, this.height)
    this.ctx.clearRect(0, 0, this.width, this.height)

    // create flow field
    this.flowField = []
    for (let y = 0; y < this.height; y += this.cellSize)
      for (let x = 0; x < this.width; x += this.cellSize) {
        const index = (y * this.width + x) * 4
        const red = pixels.data[index] ?? 0
        const green = pixels.data[index + 1] ?? 0
        const blue = pixels.data[index + 2] ?? 0
        const alpha = pixels.data[index + 3] ?? 1
        const grayscale = (red + green + blue) / 3
        const colorAngle = (grayscale / 255) * (Math.PI * 2) //radians
        this.flowField.push({ x, y, alpha, colorAngle })
      }
  }
  init() {
    this.rows = Math.round(this.height / this.cellSize)
    this.cols = Math.round(this.width / this.cellSize)

    this.updateFlowField()

    // create particles
    this.particles = []
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this))
    }
    this.particles.forEach((particle) => particle.reset())
  }
  drawGrid() {
    this.ctx.save()
    this.ctx.strokeStyle = '#fff'
    this.ctx.lineWidth = 0.2
    for (let c = 0; c < this.cols; c++) {
      this.ctx.beginPath()
      this.ctx.moveTo(this.cellSize * c, 0)
      this.ctx.lineTo(this.cellSize * c, this.height)
      this.ctx.stroke()
    }
    for (let r = 0; r < this.rows; r++) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, this.cellSize * r)
      this.ctx.lineTo(this.width, this.cellSize * r)
      this.ctx.stroke()
    }
    this.ctx.restore()
  }
  resize() {
    const width = this.ctx.canvas.width
    const height = this.ctx.canvas.height

    this.width = width - (width % this.cellSize)
    this.height = height - (height % this.cellSize)
    this.init()
  }
  render() {
    if (this.debug) {
      this.drawGrid()
      this.drawText()
    }
    this.particles.forEach((particle) => {
      particle.draw()
      particle.update()
    })
  }
}
