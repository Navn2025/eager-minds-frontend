import React, { useState, useEffect } from "react";

/**
 * Eager Minds Club - Interactive Storybook Homepage
 * A complete single-file React component built with pure SVGs and Inline Styles.
 */

export default function EagerMindsHomepage() {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredCTA, setHoveredCTA] = useState(false);

  // Colors
  const colors = {
    cream: "#FFF8F0",
    sky: "#C9EEF8",
    skyLight: "#E8F7FC",
    grass: "#B5E48C",
    orange: "#FB8500",
    yellow: "#FFD166",
    blue: "#8ECAE6",
    teal: "#90DBF4",
    green: "#52B788",
    brown: "#5A4A3B",
    white: "#FFFFFF",
    gray: "#7A6A5B",
  };

  useEffect(() => {
    // Media Query Handling
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Font and Animation Injection
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        background-color: ${colors.cream};
        overflow-x: hidden;
      }

      @keyframes balloonFloat {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(2deg); }
        100% { transform: translateY(0) rotate(0deg); }
      }

      @keyframes cloudDrift {
        0% { transform: translateX(0); }
        100% { transform: translateX(40px); }
      }

      @keyframes twinkle {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.2; transform: scale(0.5); }
        100% { opacity: 1; transform: scale(1); }
      }

      @keyframes planeDrift {
        0% { transform: translateX(-20px) rotate(-2deg); }
        50% { transform: translateX(20px) rotate(2deg); }
        100% { transform: translateX(-20px) rotate(-2deg); }
      }

      @keyframes bounce {
        0% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0); }
      }

      @keyframes floatSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes fadeInUp {
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }

      @keyframes wiggle {
        0% { transform: rotate(-6deg); }
        100% { transform: rotate(6deg); }
      }

      * {
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(style);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.head.removeChild(style);
    };
  }, []);

  // Helper Sections
  
  const Navbar = () => (
    <nav style={{
      position: "sticky",
      top: 0,
      width: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(10px)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "15px 20px" : "20px 60px",
      zIndex: 1000,
      borderBottom: `4px solid ${colors.sky}`,
    }}>
      {/* Decorative corners */}
      <div style={{ position: "absolute", top: 5, left: 5, width: 8, height: 8, backgroundColor: colors.yellow }} />
      <div style={{ position: "absolute", bottom: 5, right: 5, width: 8, height: 8, backgroundColor: colors.yellow }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ 
          width: 40, height: 40, 
          backgroundColor: colors.orange, 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "white"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2h7.6l-6.2 4.4 2.4 7.4-6.2-4.6-6.2 4.6 2.4-7.4-6.2-4.4h7.6z" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: colors.orange, lineHeight: 0.9 }}>Eager Minds</span>
          <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 12, color: colors.teal, letterSpacing: 2 }}>CLUB</span>
        </div>
      </div>

      {!isMobile && (
        <div style={{ display: "flex", gap: 30 }}>
          {["Home", "11+ Prep", "Competitions", "Arts & Craft", "Blog"].map((link) => (
            <a 
              key={link}
              href="#"
              onMouseEnter={() => setHoveredNav(link)}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 16,
                color: colors.brown,
                textDecoration: "none",
                padding: "8px 20px",
                borderRadius: 20,
                backgroundColor: hoveredNav === link ? colors.yellow : "transparent",
                transform: hoveredNav === link ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
            >
              {link}
            </a>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <a href="#" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: 14, color: colors.brown, textDecoration: "none" }}>Login</a>
        <button style={{
          backgroundColor: colors.orange,
          backgroundImage: `linear-gradient(135deg, ${colors.orange}, ${colors.yellow})`,
          padding: "12px 24px",
          borderRadius: 30,
          border: "none",
          color: "white",
          fontFamily: "'Fredoka One', cursive",
          fontSize: 14,
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(251, 133, 0, 0.3)",
        }}>
          Explore ☰
        </button>
      </div>
    </nav>
  );

  const Hero = () => (
    <section style={{
      position: "relative",
      minHeight: isMobile ? "800px" : "1000px",
      width: "100%",
      background: `linear-gradient(to bottom, ${colors.sky}, ${colors.skyLight}, #D4EDDA, ${colors.cream})`,
      overflow: "hidden",
      paddingTop: 100,
    }}>
      {/* Clouds */}
      <Cloud x="10%" y="15%" size={1.2} delay="0s" />
      <Cloud x="50%" y="8%" size={0.8} delay="2s" />
      <Cloud x="85%" y="12%" size={1.0} delay="4s" />

      {/* Stars */}
      <Star x="20%" y="10%" size={18} delay="0s" />
      <Star x="40%" y="30%" size={12} delay="1s" />
      <Star x="60%" y="5%" size={22} delay="2s" />
      <Star x="80%" y="25%" size={15} delay="3s" />
      <Star x="5%" y="40%" size={20} delay="4s" />
      <Star x="90%" y="50%" size={14} delay="5s" />

      {/* Ground Hills */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: 300, zIndex: 1 }}>
        <svg width="100%" height="300" viewBox="0 0 1440 300" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0 }}>
          <path d="M0,200 C300,50 600,250 1440,100 L1440,300 L0,300 Z" fill="#95D5B2" opacity="0.5" />
          <path d="M0,250 C400,100 800,280 1440,150 L1440,300 L0,300 Z" fill={colors.grass} />
        </svg>
      </div>

      {/* Houses & Trees */}
      <div style={{ position: "absolute", bottom: 80, width: "100%", zIndex: 2, pointerEvents: "none" }}>
        {!isMobile && (
          <>
            <House x="15%" y="0" />
            <House x="75%" y="-20" color="#FFD166" />
            <Tree x="10%" y="10" />
            <Tree x="25%" y="30" />
            <Tree x="70%" y="40" />
            <Tree x="85%" y="10" />
          </>
        )}
      </div>

      {/* Floating Decorations */}
      <Book x="15%" y="35%" delay="1s" />
      <Book x="80%" y="30%" delay="3s" />
      <Book x="45%" y="65%" delay="5s" />
      <Pencil x="10%" y="60%" delay="0s" />
      <Pencil x="90%" y="15%" delay="2s" />
      <Paintbrush x="85%" y="65%" delay="1s" />
      <Puzzle x="5%" y="20%" delay="4s" />
      <PaperPlane x="70%" y="20%" delay="0s" />

      {/* Main Illustration: Hot Air Balloon */}
      <div style={{ 
        position: "absolute", 
        left: isMobile ? "10%" : "25%", 
        top: "20%", 
        animation: "balloonFloat 6s ease-in-out infinite",
        zIndex: 5,
        width: 300
      }}>
        <HotAirBalloon />
      </div>

      {/* Ground Characters */}
      <div style={{ position: "absolute", bottom: 120, left: "20%", zIndex: 6, animation: "bounce 3s infinite" }}>
        <Rabbit />
      </div>
      <div style={{ position: "absolute", bottom: 100, right: "25%", zIndex: 6, animation: "wiggle 4s infinite alternate" }}>
        <ReadingKid />
      </div>
      <div style={{ position: "absolute", bottom: 80, left: "60%", zIndex: 6, animation: "wiggle 2s infinite alternate" }}>
        <SmallDog />
      </div>

      {/* Content Layer */}
      <div style={{ 
        position: "relative", 
        zIndex: 10, 
        textAlign: "center", 
        paddingTop: isMobile ? 350 : 0, 
        marginLeft: isMobile ? 0 : "45%" ,
        pointerEvents: "auto",
        maxWidth: isMobile ? "90%" : "50%",
        margin: isMobile ? "350px auto 0" : "0 0 0 45%"
      }}>
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: 10, 
          backgroundColor: "white", 
          padding: "8px 24px", 
          borderRadius: 30, 
          border: `2px solid ${colors.orange}`,
          color: colors.orange,
          fontFamily: "'Fredoka One', cursive",
          fontSize: 14,
          marginBottom: 30,
          animation: "fadeInUp 0.8s ease-out forwards"
        }}>
          ✦ THE HAPPY LAND OF EAGER MINDS
        </div>

        <h1 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: isMobile ? 48 : 68,
          color: colors.brown,
          lineHeight: 1.1,
          margin: "0 0 20px 0",
          animation: "fadeInUp 0.8s ease-out 0.2s forwards",
          opacity: 0,
        }}>
          Where Curious Minds<br />
          <span style={{ 
            background: `linear-gradient(to right, ${colors.orange}, ${colors.yellow})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Grow Brilliant Ideas</span>
        </h1>

        <p style={{
          fontFamily: "Nunito, sans-serif",
          fontSize: isMobile ? 16 : 18,
          color: "#7A6A5B",
          lineHeight: 1.6,
          margin: "0 0 40px 0",
          animation: "fadeInUp 0.8s ease-out 0.4s forwards",
          opacity: 0,
        }}>
          Explore worksheets, competitions, and creative adventures<br />
          designed for young learners.
        </p>

        <div style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", 
          gap: 20, 
          justifyContent: "center",
          animation: "fadeInUp 0.8s ease-out 0.6s forwards",
          opacity: 0,
        }}>
          <button 
            onMouseEnter={() => setHoveredCTA(true)}
            onMouseLeave={() => setHoveredCTA(false)}
            style={{
              backgroundColor: colors.orange,
              backgroundImage: `linear-gradient(135deg, ${colors.orange}, ${colors.yellow})`,
              padding: "20px 40px",
              borderRadius: 50,
              border: "none",
              color: "white",
              fontFamily: "'Fredoka One', cursive",
              fontSize: 18,
              cursor: "pointer",
              boxShadow: hoveredCTA ? "0 10px 30px rgba(251, 133, 0, 0.5)" : "0 6px 20px rgba(251, 133, 0, 0.3)",
              transform: hoveredCTA ? "translateY(-4px)" : "translateY(0)",
              transition: "all 0.3s ease",
            }}
          >
            🚀 Start Learning
          </button>
          <button style={{
            backgroundColor: "white",
            padding: "20px 40px",
            borderRadius: 50,
            border: `3px solid ${colors.orange}`,
            color: colors.orange,
            fontFamily: "'Fredoka One', cursive",
            fontSize: 18,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}>
            ✨ Explore Adventures
          </button>
        </div>

        <div style={{ marginTop: 30, fontFamily: "Nunito, sans-serif", fontWeight: 700, color: colors.brown, opacity: 0.8 }}>
          🌟 Join 10,000+ young learners already exploring!
        </div>
      </div>
    </section>
  );

  const Features = () => (
    <section style={{ 
      backgroundColor: "white", 
      padding: "100px 20px",
      position: "relative"
    }}>
      {/* Wave divider */}
      <div style={{ position: "absolute", top: -80, left: 0, width: "100%", height: 100, zIndex: 0 }}>
        <svg width="100%" height="100" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C400,-20 800,120 1440,50 L1440,100 L0,100 Z" fill="white" />
        </svg>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <h2 style={{ 
          fontFamily: "'Fredoka One', cursive", 
          fontSize: 42, 
          color: colors.orange,
          marginBottom: 60
        }}>
          ✨ What Awaits You?
        </h2>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", 
          gap: 30 
        }}>
          {[
            { id: 1, icon: "📝", title: "11+ Prep", desc: "Master English, Maths & Reasoning", color: colors.blue },
            { id: 2, icon: "🏆", title: "Competitions", desc: "Win exciting prizes & certificates", color: colors.yellow },
            { id: 3, icon: "🎨", title: "Arts & Craft", desc: "Express your creativity freely", color: colors.orange },
            { id: 4, icon: "📖", title: "Story Worksheets", desc: "Learn through magical stories", color: colors.green },
          ].map((item) => (
            <div 
              key={item.id}
              onMouseEnter={() => setHoveredFeature(item.id)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                backgroundColor: "white",
                padding: 40,
                borderRadius: 24,
                boxShadow: hoveredFeature === item.id ? "0 15px 40px rgba(0,0,0,0.1)" : "0 5px 20px rgba(0,0,0,0.05)",
                border: `4px solid ${hoveredFeature === item.id ? colors.yellow : "transparent"}`,
                transform: hoveredFeature === item.id ? "translateY(-10px)" : "translateY(0)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
            >
              <div style={{ fontSize: 60, marginBottom: 20 }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: colors.brown, margin: "0 0 10px 0" }}>{item.title}</h3>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 16, color: colors.gray, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Testimonials = () => (
    <section style={{ backgroundColor: "#FFF9E6", padding: "100px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 40 }}>
          {[
            { name: "Leo", age: 7, quote: "I love the space adventure worksheets! They make me feel like a real astronaut.", avatar: "#FFD166" },
            { name: "Mia", age: 9, quote: "The drawing competitions are so much fun. I won a silver medal last month!", avatar: "#8ECAE6" },
            { name: "Noah", age: 10, quote: "English prep feels like reading a storybook now. No more boring homework!", avatar: "#FB8500" },
          ].map((t, i) => (
            <div 
              key={i}
              style={{
                backgroundColor: "white",
                padding: 40,
                borderRadius: 30,
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotate(-2deg) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{ width: 80, height: 80, backgroundColor: t.avatar, borderRadius: "50%", margin: "0 auto 20px", overflow: "hidden" }}>
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <circle cx="50" cy="45" r="25" fill="#FFE5D9" />
                  <circle cx="43" cy="40" r="3" fill="#333" />
                  <circle cx="57" cy="40" r="3" fill="#333" />
                  <path d="M40 55 Q50 65 60 55" fill="none" stroke="#F08080" strokeWidth="4" />
                  <path d="M30 30 Q50 10 70 30 L70 50 Q50 60 30 50 Z" fill={t.avatar} opacity="0.8" />
                </svg>
              </div>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 18, color: colors.gray, fontStyle: "italic", marginBottom: 20 }}>"{t.quote}"</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 15 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: colors.orange, fontSize: 20 }}>★</span>)}
              </div>
              <h4 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: colors.brown, margin: 0 }}>{t.name}, {t.age}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const CTABanner = () => (
    <section style={{ 
      background: `linear-gradient(135deg, ${colors.orange}, ${colors.yellow})`,
      padding: "100px 20px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.2 }}>
        <Star x="10%" y="20%" size={40} delay="0s" />
        <Star x="90%" y="15%" size={30} delay="2s" />
        <Star x="30%" y="80%" size={25} delay="4s" />
        <Star x="70%" y="70%" size={35} delay="1s" />
        <PaperPlane x="20%" y="50%" delay="3s" />
        <PaperPlane x="80%" y="30%" delay="1s" />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: isMobile ? 36 : 56, color: "white", marginBottom: 20 }}>
          Ready for Your Adventure?
        </h2>
        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 20, color: "white", marginBottom: 40, opacity: 0.9 }}>
          Join thousands of curious minds today and start growing brilliant ideas.
        </p>
        <button style={{
          backgroundColor: "white",
          padding: "24px 60px",
          borderRadius: 60,
          border: "none",
          color: colors.orange,
          fontFamily: "'Fredoka One', cursive",
          fontSize: 22,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)"; }}
        >
          Join Free Today →
        </button>
      </div>
    </section>
  );

  const Footer = () => (
    <footer style={{ backgroundColor: colors.cream, padding: "80px 20px", textAlign: "center", borderTop: `2px solid ${colors.sky}` }}>
       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, backgroundColor: colors.orange, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>★</div>
            <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: colors.orange }}>Eager Minds CLUB</span>
          </div>
          <p style={{ fontFamily: "Nunito, sans-serif", color: colors.gray, maxWidth: 400 }}>
             Where Curious Minds Grow Brilliant Ideas. Making learning a magical adventure for every child since 2025.
          </p>
          <div style={{ display: "flex", gap: 30, margin: "20px 0" }}>
             {["Privacy", "Terms", "Support", "Careers"].map(link => (
               <a key={link} href="#" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: colors.brown, textDecoration: "none", fontSize: 14 }}>{link}</a>
             ))}
          </div>
          <div style={{ fontFamily: "Nunito, sans-serif", color: colors.gray, fontSize: 14 }}>
             © 2025 Eager Minds Club — Where Learning is an Adventure 🌟
          </div>
       </div>
    </footer>
  );

  // SVG Components
  
  const Cloud = ({ x, y, size = 1, delay = "0s" }) => (
    <div style={{ 
      position: "absolute", 
      left: x, 
      top: y, 
      transform: `scale(${size})`,
      animation: `cloudDrift 8s ease-in-out infinite alternate ${delay}`,
      zIndex: 0,
      opacity: 0.9
    }}>
      <svg width="120" height="60" viewBox="0 0 120 60">
        <circle cx="30" cy="35" r="25" fill="white" />
        <circle cx="60" cy="25" r="25" fill="white" />
        <circle cx="90" cy="35" r="25" fill="white" />
      </svg>
    </div>
  );

  const Star = ({ x, y, size = 20, delay = "0s" }) => (
    <div style={{ 
      position: "absolute", 
      left: x, 
      top: y, 
      animation: `twinkle 3s ease-in-out infinite ${delay}`,
      zIndex: 0
    }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill={colors.yellow}>
        <path d="M12 2l2.4 7.2h7.6l-6.2 4.4 2.4 7.4-6.2-4.6-6.2 4.6 2.4-7.4-6.2-4.4h7.6z" />
      </svg>
    </div>
  );

  const HotAirBalloon = () => (
    <div style={{ position: "relative" }}>
      {/* Balloon Envelope */}
      <svg width="250" height="350" viewBox="0 0 200 280">
        {/* Balloon Body */}
        <path d="M30,100 Q30,20 100,20 Q170,20 170,100 Q170,180 100,220 Q30,180 30,100" fill={colors.orange} />
        {/* Stripes */}
        <path d="M70,22 Q50,50 50,100 Q50,150 85,210" fill="transparent" stroke={colors.yellow} strokeWidth="20" opacity="0.8" />
        <path d="M130,22 Q150,50 150,100 Q150,150 115,210" fill="transparent" stroke={colors.blue} strokeWidth="20" opacity="0.8" />
        
        {/* Ropes */}
        <line x1="60" y1="200" x2="75" y2="240" stroke={colors.brown} strokeWidth="2" />
        <line x1="140" y1="200" x2="125" y2="240" stroke={colors.brown} strokeWidth="2" />
        
        {/* Basket */}
        <rect x="70" y="240" width="60" height="40" rx="10" fill="#8B4513" />
        <path d="M70,250 L130,250 M70,260 L130,260 M70,270 L130,270" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <path d="M80,240 L80,280 M100,240 L100,280 M120,240 L120,280" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        
        {/* Kid 1 - Reading */}
        <circle cx="85" cy="235" r="12" fill="#FFE5D9" />
        <rect x="78" y="225" width="14" height="6" rx="3" fill="#333" /> {/* Hair */}
        <rect x="75" y="240" width="20" height="15" fill={colors.green} />
        <rect x="75" y="238" width="18" height="10" fill="white" transform="rotate(-10)" /> {/* Book */}
        
        {/* Kid 2 - Waving */}
        <circle cx="115" cy="235" r="12" fill="#FFE5D9" />
        <path d="M105,225 Q115,220 125,225 L125,235 L105,235 Z" fill="#FFB703" /> {/* Cap */}
        <rect x="105" y="240" width="20" height="15" fill={colors.blue} />
        <line x1="125" y1="245" x2="140" y2="225" stroke="#FFE5D9" strokeWidth="6" strokeLinecap="round" /> {/* Waving arm */}

        {/* Friendly Fox beside basket */}
        <g transform="translate(140, 240) scale(0.6)">
           <circle cx="30" cy="30" r="25" fill={colors.orange} />
           <path d="M10,15 L15,0 L25,10 Z" fill={colors.orange} />
           <path d="M50,15 L45,0 L35,10 Z" fill={colors.orange} />
           <circle cx="20" cy="25" r="2" fill="white" />
           <circle cx="40" cy="25" r="2" fill="white" />
           <circle cx="30" cy="35" r="2" fill="#333" />
           <path d="M55,30 Q75,10 65,50" fill="transparent" stroke={colors.orange} strokeWidth="10" strokeLinecap="round" /> {/* Tail */}
        </g>
      </svg>
    </div>
  );

  const House = ({ x, y, color = "#FB8500" }) => (
    <div style={{ position: "absolute", left: x, bottom: y, transform: "scale(0.8)" }}>
      <svg width="60" height="80" viewBox="0 0 60 80">
        <rect x="10" y="30" width="40" height="50" fill="white" stroke="#333" strokeWidth="2" />
        <polygon points="5,30 30,5 55,30" fill={color} stroke="#333" strokeWidth="2" />
        <rect x="25" y="55" width="10" height="25" fill="#5A4A3B" />
        <circle cx="20" cy="45" r="5" fill={colors.sky} />
      </svg>
    </div>
  );

  const Tree = ({ x, y }) => (
    <div style={{ position: "absolute", left: x, bottom: y, transform: "scale(0.7)" }}>
      <svg width="40" height="80" viewBox="0 0 40 80">
        <rect x="17" y="50" width="6" height="30" fill="#5A4A3B" />
        <circle cx="20" cy="35" r="25" fill={colors.green} opacity="0.9" />
        <circle cx="15" cy="25" r="5" fill="#409167" />
        <circle cx="25" cy="40" r="4" fill="#409167" />
      </svg>
    </div>
  );

  const Book = ({ x, y, delay }) => (
    <div style={{ position: "absolute", left: x, top: y, animation: `balloonFloat 5s ease-in-out infinite ${delay}` }}>
      <svg width="40" height="30" viewBox="0 0 40 30">
        <rect x="2" y="5" width="36" height="20" rx="2" fill="white" stroke={colors.brown} strokeWidth="1" />
        <line x1="20" y1="5" x2="20" y2="25" stroke={colors.brown} strokeWidth="1" />
        <path d="M5,10 H18 M5,15 H18 M5,20 H12 M22,10 H35 M22,15 H35 M22,20 H28" stroke="#ccc" strokeWidth="1" />
      </svg>
    </div>
  );

  const Pencil = ({ x, y, delay }) => (
    <div style={{ position: "absolute", left: x, top: y, animation: `wiggle 2s ease-in-out infinite alternate ${delay}` }}>
      <svg width="50" height="15" viewBox="0 0 50 15">
        <polygon points="0,7.5 10,0 45,0 45,15 10,15" fill={colors.yellow} stroke={colors.brown} strokeWidth="1" />
        <polygon points="45,0 50,7.5 45,15" fill="#FFE5D9" />
        <circle cx="48" cy="7.5" r="1.5" fill="#333" />
        <rect x="5" y="0" width="5" height="15" fill="#E94A4A" />
      </svg>
    </div>
  );

  const Paintbrush = ({ x, y, delay }) => (
    <div style={{ position: "absolute", left: x, top: y, animation: `wiggle 3s ease-in-out infinite alternate ${delay}` }}>
      <svg width="60" height="15" viewBox="0 0 60 15">
        <rect x="0" y="5" width="40" height="5" fill="#8B4513" rx="2" />
        <rect x="40" y="4" width="8" height="7" fill="#ccc" />
        <path d="M48,7.5 Q60,0 60,7.5 Q60,15 48,7.5" fill={colors.orange} />
      </svg>
    </div>
  );

  const Puzzle = ({ x, y, delay }) => (
    <div style={{ position: "absolute", left: x, top: y, animation: `bounce 4s ease-in-out infinite ${delay}` }}>
      <svg width="30" height="30" viewBox="0 0 30 30">
        <path d="M10,5 Q15,0 20,5 L20,10 Q15,15 20,20 L15,20 Q10,25 5,20 L5,15 Q0,10 5,5 Z" fill={colors.teal} stroke={colors.brown} strokeWidth="1" />
      </svg>
    </div>
  );

  const PaperPlane = ({ x, y, delay }) => (
    <div style={{ position: "absolute", left: x, top: y, animation: `planeDrift 6s ease-in-out infinite ${delay}` }}>
      <svg width="40" height="30" viewBox="0 0 40 30">
        <path d="M0,15 L40,0 L15,20 L15,30 L22,23 L40,0" fill="white" stroke={colors.blue} strokeWidth="1" />
      </svg>
    </div>
  );

  const Rabbit = () => (
    <svg width="60" height="80" viewBox="0 0 60 80">
      <ellipse cx="30" cy="60" rx="20" ry="15" fill="white" />
      <circle cx="30" cy="45" r="15" fill="white" />
      <rect x="20" y="10" width="8" height="25" rx="4" fill="white" />
      <rect x="32" y="10" width="8" height="25" rx="4" fill="white" />
      <circle cx="25" cy="42" r="2" fill="#333" />
      <circle cx="35" cy="42" r="2" fill="#333" />
      <circle cx="30" cy="48" r="1.5" fill="#F08080" />
      {/* Small pencil in hand */}
      <rect x="40" y="55" width="4" height="15" fill={colors.yellow} transform="rotate(45)" />
    </svg>
  );

  const ReadingKid = () => (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="30" r="15" fill="#FFE5D9" />
      <rect x="30" y="20" width="20" height="8" rx="4" fill="#5A4A3B" />
      <rect x="30" y="45" width="20" height="25" fill={colors.orange} />
      <rect x="20" y="65" width="40" height="10" rx="5" fill="#333" />
      {/* Book */}
      <g transform="translate(30, 50)">
         <rect x="0" y="0" width="20" height="15" fill="white" stroke="#333" />
         <line x1="10" y1="0" x2="10" y2="15" stroke="#333" />
      </g>
    </svg>
  );

  const SmallDog = () => (
    <svg width="60" height="40" viewBox="0 0 60 40">
      <ellipse cx="30" cy="25" rx="20" ry="12" fill="#8B4513" />
      <circle cx="45" cy="20" r="10" fill="#8B4513" />
      <rect x="52" y="15" width="4" height="12" rx="2" fill="#5A4A3B" /> {/* Ear */}
      <circle cx="48" cy="18" r="1.5" fill="white" />
      <path d="M5,25 Q10,15 0,10" fill="none" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" /> {/* Tail */}
    </svg>
  );

  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
