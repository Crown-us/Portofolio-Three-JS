import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ScrollControls, Scroll, useScroll, Float, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import './index.css'

function PinkGlass() {
  const meshRef = useRef()
  const scroll = useScroll()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
      meshRef.current.rotation.y += delta * 0.2
      meshRef.current.rotation.y += scroll.delta * 5

      const curScroll = scroll.offset
      let targetX = 2.2 

      if (curScroll > 0.16 && curScroll < 0.35) {
        targetX = -2.2 // Page 2 (About) -> Pindah Kiri
      } else if (curScroll > 0.35 && curScroll < 0.55) {
        targetX = 2.2  // Page 3 (Services) -> Pindah Kanan
      } else if (curScroll > 0.55 && curScroll < 0.75) {
        targetX = -2.2 // Page 4 (Projects) -> Pindah Kiri
      } else {
        targetX = 2.2  
      }

      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.07)
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={1.8}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshPhysicalMaterial 
          color="#ff0055" 
          roughness={0.1} 
          metalness={0.1}
          transmission={0.95} 
          thickness={1.5} 
          envMapIntensity={1.5} 
          clearcoat={1} 
        />
      </mesh>
    </Float>
  )
}

const Nav = ({ darkMode, setDarkMode }) => (
  <nav className="nav-fixed">
    <a href="#" className="logo">KEVIN.</a>
    <div className="nav-links">
      <a href="#work" className="nav-item">Work</a>
      <a href="#about" className="nav-item">About</a>
      <a href="#contact" className="nav-item" style={{color: 'var(--accent-pink)', fontWeight: 'bold'}}>Say Hello</a>
      <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '🌙' : '☀️'}
      </button>
    </div>
  </nav>
)

const Section = ({ children, align = 'left' }) => (
  <section className="section-container" style={{
    justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
  }}>
    <div className="content-box">{children}</div>
  </section>
)

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  return (
    <div className="app-main">
      <Nav darkMode={darkMode} setDarkMode={setDarkMode} />
      
      {/* PENTING: Canvas harus punya style top:0 left:0 
          agar tidak menggeser konten HTML 
      */}
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 7], fov: 35 }}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }}
      >
        <ambientLight intensity={darkMode ? 0.2 : 0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={darkMode ? 3 : 5} />
        <Environment preset="city" environmentIntensity={darkMode ? 0.4 : 1} /> 

        <ScrollControls pages={6} damping={0.2}>
          <PinkGlass />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color={darkMode ? "#000" : "#ff0055"} />

          {/* Bungkus semua teks di dalam Scroll html 
          */}
          <Scroll html>
            <main className="scroll-inner">
              
              <Section align="left">
                <h3>2025 Portfolio</h3>
                <h1>Fullstack<br/><span className="text-pink">Creative.</span></h1>
                <p className="desc">Saya Kevin Wijaya. Menggabungkan logika teknis dengan estetika visual untuk membangun web experience yang modern.</p>
                <button className="btn-modern">EXPLORE WORK</button>
              </Section>

              <Section align="right">
                <h3>The Developer</h3>
                <h2>Code driven by <br/><span className="text-pink">Design.</span></h2>
                <p className="desc">Mahasiswa IT Semester 5. Spesialisasi saya menjembatani gap antara Hardware (IoT) dan Interface (Web).</p>
              </Section>

              <Section align="left">
                <h3>What I Do</h3>
                <div className="services-grid">
                  <div className="card-glass"><h4>🌐 Web Dev</h4><p>React, Next.js, & Three.js animations.</p></div>
                  <div className="card-glass"><h4>🤖 IoT</h4><p>ESP32, Sensor, & Real-time dashboards.</p></div>
                  <div className="card-glass"><h4>⚙️ Backend</h4><p>Scalable APIs with Laravel or Python.</p></div>
                  <div className="card-glass"><h4>📱 UI/UX</h4><p>Figma to pixel-perfect code.</p></div>
                </div>
              </Section>

              <Section align="right">
                <h3>Selected Works</h3>
                <div className="project-container">
                  <div className="project-row"><div><div className="p-title">Glass Portfolio</div><div className="p-sub">React Three Fiber</div></div><div className="p-cat">WEBGL</div></div>
                  <div className="project-row"><div><div className="p-title">Smart Home Hub</div><div className="p-sub">ESP32 & Next.js</div></div><div className="p-cat">IOT</div></div>
                </div>
              </Section>

              <Section align="left">
                <h3>Experience</h3>
                <div className="timeline-container">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <h4 className="exp-title">Fullstack Developer Intern</h4>
                    <p className="exp-comp">PT. Teknologi Maju • 2024</p>
                    <p className="exp-desc">Membangun dashboard internal perusahaan menggunakan Laravel dan React.</p>
                  </div>
                </div>
              </Section>

              <Section align="left">
                <h3>Collaboration</h3>
                <h1 style={{fontSize: '4.5rem'}}>Let's build<br/>Future.</h1>
                <a href="mailto:kevindowi@gmail.com" className="email-link">kevindowi@gmail.com</a>
              </Section>

            </main>
          </Scroll>
        </ScrollControls>

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.9} mipmapBlur intensity={0.4} radius={0.5} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
