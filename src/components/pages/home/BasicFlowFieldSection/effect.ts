import { Particle } from './particle'

export class Effect {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  particles: Particle[]
  numberOfParticles: number
  cellSize: number
  rows: number
  cols: number
  flowField: number[]
  curve: number
  zoom: number
  debug: boolean

  constructor(ctx: CanvasRenderingContext2D) {
    this.canvas = ctx.canvas
    this.ctx = ctx
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 2000
    this.cellSize = 10
    this.rows = 0
    this.cols = 0
    this.flowField = []
    this.curve = 1
    this.zoom = 0.025
    this.debug = false
    this.init()

    window.addEventListener('keydown', (e) => e.key === 'd' && (this.debug = !this.debug))

    const resizeObserver = new ResizeObserver(() => this.resize())
    resizeObserver.observe(this.ctx.canvas)
  }

  init() {
    // create flow field
    this.rows = ~~(this.height / this.cellSize)
    this.cols = ~~(this.width / this.cellSize)
    this.flowField = []
    for (let y = 0; y < this.rows; y++)
      for (let x = 0; x < this.cols; x++)
        this.flowField.push(Math.cos(x * this.zoom) * Math.sin(y * this.zoom) * this.curve)

    // create particles
    this.particles = []
    for (let i = 0; i < this.numberOfParticles; i++) this.particles.push(new Particle(this))
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

    this.width = ~~(width - (width % this.cellSize))
    this.height = ~~(height - (height % this.cellSize))

    this.numberOfParticles = ~~((this.width * this.height) / 500)

    this.init()
  }
  render() {
    if (this.debug) this.drawGrid()

    this.particles.forEach((particle) => {
      particle.draw()
      particle.update()
    })
  }
}
