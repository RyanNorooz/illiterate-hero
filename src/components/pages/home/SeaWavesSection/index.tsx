import { useEffect } from 'react'
import * as THREE from 'three'
import fragmentShader from './shader.frag?raw'
import vertexShader from './shader.vert?raw'

interface SeaWavesSectionProps {}

let animationFrameID = 0

export default function SeaWavesSection(props: SeaWavesSectionProps) {
  useEffect(() => {
    const container = document.getElementById('container')
    const fov = 30
    const clock = new THREE.Clock()

    const timeUniform = {
      iGlobalTime: {
        type: 'f',
        value: 0.1,
      },
      iResolution: {
        type: 'v2',
        value: new THREE.Vector2(),
      },
    }

    timeUniform.iResolution.value.x = window.innerWidth
    timeUniform.iResolution.value.y = window.innerHeight

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })

    function render() {
      timeUniform.iGlobalTime.value += clock.getDelta()
      renderer.render(scene, camera)
      animationFrameID = requestAnimationFrame(render)
    }

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    camera.position.x = 20
    camera.position.y = 10
    camera.position.z = 20
    camera.lookAt(scene.position)
    scene.add(camera)

    const axis = new THREE.AxesHelper(10)
    scene.add(axis)

    const shMaterial = new THREE.ShaderMaterial({
      uniforms: timeUniform,
      vertexShader,
      fragmentShader,
    })

    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 40),
      shMaterial
    )
    scene.add(water)

    const geometry = new THREE.SphereGeometry(10, 32, 32)
    const gMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    const sphere = new THREE.Mesh(geometry, gMaterial)
    scene.add(sphere)

    const renderer = new THREE.WebGL1Renderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    container?.appendChild(renderer.domElement)

    render()

    return () => {
      container?.removeChild(renderer.domElement)
      window.cancelAnimationFrame(animationFrameID)
    }
  }, [])

  return (
    <div>
      <div id="container"></div>
    </div>
  )
}
