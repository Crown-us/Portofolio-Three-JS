import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ScrollControls, Scroll, useScroll, Float, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing' 
import { useRef, useState, useEffect } from 'react'

// === 1. OBJECT 3D: PINK GLASS TORUS (Donat Kaca) ===
function PinkGlass() {
  const meshRef = useRef()
  const scroll = useScroll()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
      meshRef.current.rotation.y += delta * 0.2
      meshRef.current.rotation.y += scroll.delta * 8
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.x = 2.5 
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={1.8}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshPhysicalMaterial 
          color="#ff0055" 
          roughness={0.2} 
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

// === 2. NAVBAR COMPONENT (Terima Props DarkMode) ===
const Nav = ({ darkMode, setDarkMode }) => (
  <nav className="nav-fixed" style={{ 
    // Kita biarkan CSS yang handle background via class, tapi kita bantu transisi di sini
    transition: 'all 0.5s ease'
  }}>
    <a href="#" className="logo">KEVIN.</a>
    <div className="nav-links">
      <a href="#work" className="nav-item">Work</a>
      <a href="#about" className="nav-item">About</a>
      <a href="#contact" className="nav-item" style={{color: '#ff0055'}}>Say Hello</a>
      
      {/* TOMBOL GANTI TEMA */}
      <button 
        className="theme-toggle-btn" 
        onClick={() => setDarkMode(!darkMode)}
        title="Switch Theme"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
    </div>
  </nav>
)

// === 3. MARQUEE (Terima Props DarkMode) ===
const TechMarquee = ({ darkMode }) => (
  <div style={{ 
    width: '100%', overflow: 'hidden', padding: '40px 0', 
    background: darkMode ? '#111' : '#f9f9f9', // Manual override untuk marquee
    borderTop: darkMode ? '1px solid #333' : '1px solid #eee', 
    borderBottom: darkMode ? '1px solid #333' : '1px solid #eee',
    color: darkMode ? '#555' : '#ccc',
    transition: 'all 0.5s ease'
  }}>
    <div style={{ 
      display: 'flex', gap: '50px', whiteSpace: 'nowrap', 
      animation: 'marquee 20s linear infinite', opacity: 0.6 
    }}>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>REACT</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>NEXT.JS</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>THREE.JS</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>ESP32</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>LARAVEL</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>PYTHON</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>ARDUINO</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>MONGODB</span>
      
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>REACT</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>NEXT.JS</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>THREE.JS</span>
      <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>ESP32</span>
    </div>
    <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
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
  // STATE DARK MODE
  const [darkMode, setDarkMode] = useState(false)

  // EFFECT: Ganti class di body HTML biar CSS Variable jalan
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  // Helper warna untuk Inline Styles (Card & Experience)
  const cardBg = darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.6)';
  const cardBorder = darkMode ? '1px solid #333' : '1px solid #eee';
  const subTextColor = darkMode ? '#aaa' : '#666';

  return (
    <>
      <Nav darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 35 }}>
        
        {/* LIGHTING & ENVIRONMENT (BERUBAH SESUAI MODE) */}
        {/* Siang: Terang (0.5), Malam: Redup (0.2) */}
        <ambientLight intensity={darkMode ? 0.2 : 0.5} />
        
        {/* Lampu Utama */}
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={darkMode ? 3 : 5} />
        
        {/* Lampu Bawah: Siang Pink, Malam Biru Dingin */}
        <spotLight position={[-10, -5, -5]} intensity={5} color={darkMode ? "#4444ff" : "#ffccdd"} />
        
        {/* Pantulan Kota: Malam lebih samar */}
        <Environment preset="city" environmentIntensity={darkMode ? 0.5 : 1} /> 

        <ScrollControls pages={6} damping={0.2}>
          
          <PinkGlass />
          
          {/* Bayangan: Malam hitam, Siang pink */}
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} color={darkMode ? "#000" : "#ff0055"} />

          <Scroll html style={{ width: '100%' }}>
            
            {/* PAGE 1: HERO */}
            <Section align="left">
              <h3>2025 Portfolio</h3>
              <h1>Fullstack<br/><span className="text-pink">Creative.</span></h1>
              <p className="desc">
                Saya Kevin Wijaya. Menggabungkan logika teknis dengan estetika visual untuk membangun web experience yang modern.
              </p>
              <button className="btn-modern">EXPLORE WORK</button>
            </Section>

            {/* MARQUEE */}
            <div style={{ position: 'absolute', top: '100vh', width: '100%' }}>
               <TechMarquee darkMode={darkMode} />
            </div>

            {/* PAGE 2: ABOUT */}
            <Section align="right">
              <h3>The Developer</h3>
              <h2>Code driven by <br/><span className="text-pink">Design.</span></h2>
              <p className="desc">
                Mahasiswa IT Semester 5. Spesialisasi saya menjembatani gap antara 
                <strong> Hardware (IoT)</strong> dan <strong>Interface (Web)</strong>.
              </p>
            </Section>

            {/* PAGE 3: SERVICES (Card Styles Updated) */}
            <Section align="left">
              <h3>What I Do</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: cardBorder }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', fontFamily: 'Space Grotesk' }}>🌐 Web Development</h4>
                  <p style={{ fontSize: '0.9rem', color: subTextColor }}>Bikin website interaktif pake React, Next.js, dan animasi Three.js.</p>
                </div>
                <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: cardBorder }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', fontFamily: 'Space Grotesk' }}>🤖 IoT Solutions</h4>
                  <p style={{ fontSize: '0.9rem', color: subTextColor }}>Integrasi sensor, ESP32, dan MQTT ke dashboard real-time.</p>
                </div>
                <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: cardBorder }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', fontFamily: 'Space Grotesk' }}>⚙️ Backend Systems</h4>
                  <p style={{ fontSize: '0.9rem', color: subTextColor }}>API yang aman dan scalable pake Laravel atau Python.</p>
                </div>
                <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: cardBorder }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', fontFamily: 'Space Grotesk' }}>📱 UI/UX Implementation</h4>
                  <p style={{ fontSize: '0.9rem', color: subTextColor }}>Terjemahin desain Figma jadi kode yang pixel-perfect.</p>
                </div>
              </div>
            </Section>

            {/* PAGE 4: PROJECT LIST */}
            <Section align="right">
              <h3>Selected Works</h3>
              <div style={{ width: '100%', marginTop: '30px' }}>
                <div className="project-row">
                  <div><div className="p-title">Glass Portfolio</div><div style={{color: subTextColor, fontSize:'0.9rem'}}>React Three Fiber</div></div>
                  <div className="p-cat">WEBGL</div>
                </div>
                <div className="project-row">
                  <div><div className="p-title">Smart Home Hub</div><div style={{color: subTextColor, fontSize:'0.9rem'}}>ESP32 & Next.js</div></div>
                  <div className="p-cat">IOT</div>
                </div>
                <div className="project-row">
                  <div><div className="p-title">DeFi Dashboard</div><div style={{color: subTextColor, fontSize:'0.9rem'}}>Blockchain API</div></div>
                  <div className="p-cat">WEB3</div>
                </div>
              </div>
            </Section>

            {/* PAGE 5: EXPERIENCE (Timeline Updated) */}
            <Section align="left">
               <h3>Experience</h3>
               <div style={{ marginTop: '20px', borderLeft: darkMode ? '2px solid #333' : '2px solid #eee', paddingLeft: '30px' }}>
                 
                 <div style={{ marginBottom: '40px', position: 'relative' }}>
                   <div style={{ position: 'absolute', left: '-36px', top: '5px', width: '12px', height: '12px', background: '#ff0055', borderRadius: '50%' }}></div>
                   <h4 style={{ fontSize: '1.3rem', fontFamily: 'Space Grotesk' }}>Fullstack Developer Intern</h4>
                   <p style={{ color: '#ff0055', fontSize: '0.9rem', fontWeight: '600' }}>PT. Teknologi Maju • 2024</p>
                   <p style={{ color: subTextColor, marginTop: '10px', fontSize: '0.95rem' }}>Membangun dashboard internal perusahaan menggunakan Laravel dan React. Optimasi query database hingga 40% lebih cepat.</p>
                 </div>

                 <div style={{ marginBottom: '40px', position: 'relative' }}>
                   <div style={{ position: 'absolute', left: '-36px', top: '5px', width: '12px', height: '12px', background: darkMode ? '#555' : '#ccc', borderRadius: '50%' }}></div>
                   <h4 style={{ fontSize: '1.3rem', fontFamily: 'Space Grotesk' }}>IoT Project Lead (College)</h4>
                   <p style={{ color: '#ff0055', fontSize: '0.9rem', fontWeight: '600' }}>Politeknik Negeri • 2023</p>
                   <p style={{ color: subTextColor, marginTop: '10px', fontSize: '0.95rem' }}>Memimpin tim 4 orang untuk project Smart Farming berbasis ESP32. Juara 2 kompetisi IoT Nasional.</p>
                 </div>

               </div>
            </Section>

            {/* PAGE 6: CONTACT */}
            <Section align="left">
              <h3>Collaboration</h3>
              <h1 style={{fontSize: '4.5rem'}}>Let's build<br/>Future.</h1>
              <a href="mailto:kevindowi@gmail.com" style={{
                fontSize: '1.5rem', color: darkMode ? '#fff' : '#111', textDecoration: 'none', 
                borderBottom: '2px solid #ff0055', fontWeight: '600',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                kevindowi@gmail.com
              </a>
              <div style={{marginTop: '50px', display: 'flex', gap: '30px'}}>
                 <a href="#" style={{color: subTextColor, textDecoration:'none', fontWeight:'500'}}>GitHub</a>
                 <a href="#" style={{color: subTextColor, textDecoration:'none', fontWeight:'500'}}>LinkedIn</a>
                 <a href="#" style={{color: subTextColor, textDecoration:'none', fontWeight:'500'}}>Instagram</a>
              </div>
            </Section>

          </Scroll>
        </ScrollControls>
        
        {/* Post Processing */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.9} mipmapBlur intensity={0.4} radius={0.5} />
          <Noise opacity={0.02} />
        </EffectComposer>

      </Canvas>
    </>
  )
}