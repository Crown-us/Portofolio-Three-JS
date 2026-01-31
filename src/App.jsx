import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ScrollControls, Scroll, useScroll, Float, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing' 
import { useRef, useState, useEffect } from 'react'

// === 1. OBJECT 3D: PINK GLASS TORUS (Dynamic Position) ===
function PinkGlass() {
  const meshRef = useRef()
  const scroll = useScroll()

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotasi Idle
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
      meshRef.current.rotation.y += delta * 0.2
      
      // Rotasi saat scroll
      meshRef.current.rotation.y += scroll.delta * 5

      // LOGIKA POSISI BERLAWANAN DENGAN TEKS
      // Page 1 (offset 0.0): Teks Kiri  -> Objek Kanan (x: 2.2)
      // Page 2 (offset 0.2): Teks Kanan -> Objek Kiri  (x: -2.2)
      // Page 3 (offset 0.4): Teks Kiri  -> Objek Kanan (x: 2.2)
      // Page 4 (offset 0.6): Teks Kanan -> Objek Kiri  (x: -2.2)
      
      const curScroll = scroll.offset
      let targetX = 2.2 // Default Kanan

      if (curScroll > 0.16 && curScroll < 0.35) {
        targetX = -2.2 // Pindah Kiri di Page 2 (About)
      } else if (curScroll > 0.35 && curScroll < 0.55) {
        targetX = 2.2  // Pindah Kanan di Page 3 (Services)
      } else if (curScroll > 0.55 && curScroll < 0.75) {
        targetX = -2.2 // Pindah Kiri di Page 4 (Projects)
      } else if (curScroll > 0.75) {
        targetX = 2.2  // Pindah Kanan di sisanya
      }

      // Transisi posisi yang smooth menggunakan Lerp
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05)
      
      // Efek melayang (bobbing)
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

// === 2. NAVBAR COMPONENT ===
const Nav = ({ darkMode, setDarkMode }) => (
  <nav className="nav-fixed">
    <a href="#" className="logo">KEVIN.</a>
    <div className="nav-links">
      <a href="#work" className="nav-item">Work</a>
      <a href="#about" className="nav-item">About</a>
      <a href="#contact" className="nav-item" style={{color: '#ff0055', fontWeight: 'bold'}}>Say Hello</a>
      <button 
        className="theme-toggle-btn" 
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
    </div>
  </nav>
)

// === 3. MARQUEE COMPONENT ===
const TechMarquee = ({ darkMode }) => (
  <div className="marquee-container" style={{ 
    background: darkMode ? '#111' : '#f9f9f9',
    color: darkMode ? '#444' : '#ccc'
  }}>
    <div className="marquee-content">
      {["REACT", "NEXT.JS", "THREE.JS", "ESP32", "LARAVEL", "PYTHON", "ARDUINO", "MONGODB"].map((tech, i) => (
        <span key={i}>{tech}</span>
      ))}
      {/* Duplicate for seamless loop */}
      {["REACT", "NEXT.JS", "THREE.JS", "ESP32"].map((tech, i) => (
        <span key={i + 10}>{tech}</span>
      ))}
    </div>
  </div>
)

const Section = ({ children, align = 'left' }) => (
  <section style={{
    height: '100vh', width: '100vw', display: 'flex', alignItems: 'center',
    justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
    padding: '0 10%', position: 'relative'
  }}>
    <div style={{ width: '45%', zIndex: 10 }}>{children}</div>
  </section>
)

// === 4. MAIN APP ===
export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const cardBg = darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.6)';
  const cardBorder = darkMode ? '1px solid #333' : '1px solid #eee';
  const subTextColor = darkMode ? '#aaa' : '#666';

  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : 'light'}`}>
      <Nav darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 35 }}>
        <ambientLight intensity={darkMode ? 0.2 : 0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={darkMode ? 3 : 5} />
        <spotLight position={[-10, -5, -5]} intensity={5} color={darkMode ? "#4444ff" : "#ffccdd"} />
        <Environment preset="city" environmentIntensity={darkMode ? 0.5 : 1} /> 

        <ScrollControls pages={6} damping={0.2}>
          <PinkGlass />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} color={darkMode ? "#000" : "#ff0055"} />

          <Scroll html style={{ width: '100%' }}>
            {/* PAGE 1: HERO */}
            <Section align="left">
              <h3 className="overline">2025 Portfolio</h3>
              <h1>Fullstack<br/><span className="text-pink">Creative.</span></h1>
              <p className="desc">Saya Kevin Wijaya. Menggabungkan logika teknis dengan estetika visual untuk membangun web experience yang modern.</p>
              <button className="btn-modern">EXPLORE WORK</button>
            </Section>

            {/* MARQUEE POSITIONED BETWEEN SECTIONS */}
            <div style={{ position: 'absolute', top: '100vh', width: '100%' }}>
               <TechMarquee darkMode={darkMode} />
            </div>

            {/* PAGE 2: ABOUT (Teks Kanan, Objek bakal di Kiri) */}
            <Section align="right">
              <h3 className="overline">The Developer</h3>
              <h2>Code driven by <br/><span className="text-pink">Design.</span></h2>
              <p className="desc">
                Mahasiswa IT Semester 5. Spesialisasi saya menjembatani gap antara 
                <strong> Hardware (IoT)</strong> dan <strong>Interface (Web)</strong>.
              </p>
            </Section>

            {/* PAGE 3: SERVICES */}
            <Section align="left">
              <h3 className="overline">What I Do</h3>
              <div className="grid-services">
                <div className="card" style={{ background: cardBg, border: cardBorder }}>
                  <h4>🌐 Web Dev</h4>
                  <p style={{ color: subTextColor }}>React, Next.js, & Three.js animations.</p>
                </div>
                <div className="card" style={{ background: cardBg, border: cardBorder }}>
                  <h4>🤖 IoT</h4>
                  <p style={{ color: subTextColor }}>ESP32, Sensors, & Real-time dashboards.</p>
                </div>
                <div className="card" style={{ background: cardBg, border: cardBorder }}>
                  <h4>⚙️ Backend</h4>
                  <p style={{ color: subTextColor }}>Scalable APIs with Laravel & Python.</p>
                </div>
                <div className="card" style={{ background: cardBg, border: cardBorder }}>
                  <h4>📱 UI/UX</h4>
                  <p style={{ color: subTextColor }}>Pixel-perfect Figma to Code.</p>
                </div>
              </div>
            </Section>

            {/* PAGE 4: PROJECT LIST (Teks Kanan) */}
            <Section align="right">
              <h3 className="overline">Selected Works</h3>
              <div className="project-list">
                <div className="project-row">
                  <div><div className="p-title">Glass Portfolio</div><div style={{color: subTextColor}}>React Three Fiber</div></div>
                  <div className="p-cat">WEBGL</div>
                </div>
                <div className="project-row">
                  <div><div className="p-title">Smart Home Hub</div><div style={{color: subTextColor}}>ESP32 & Next.js</div></div>
                  <div className="p-cat">IOT</div>
                </div>
              </div>
            </Section>

            {/* PAGE 5: EXPERIENCE */}
            <Section align="left">
               <h3 className="overline">Experience</h3>
               <div className="timeline" style={{ borderLeft: darkMode ? '2px solid #333' : '2px solid #eee' }}>
                 <div className="timeline-item">
                   <div className="dot"></div>
                   <h4>Fullstack Developer Intern</h4>
                   <p className="date">PT. Teknologi Maju • 2024</p>
                   <p style={{ color: subTextColor }}>Membangun dashboard internal menggunakan Laravel & React.</p>
                 </div>
                 <div className="timeline-item">
                   <div className="dot gray"></div>
                   <h4>IoT Project Lead</h4>
                   <p className="date">Politeknik Negeri • 2023</p>
                   <p style={{ color: subTextColor }}>Smart Farming berbasis ESP32 - Juara 2 Nasional.</p>
                 </div>
               </div>
            </Section>

            {/* PAGE 6: CONTACT */}
            <Section align="left">
              <h3 className="overline">Collaboration</h3>
              <h1 className="huge-text">Let's build<br/>Future.</h1>
              <a href="mailto:kevindowi@gmail.com" className="email-link">
                kevindowi@gmail.com
              </a>
            </Section>

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
