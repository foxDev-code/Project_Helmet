import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollSequence from './ScrollSequence';
import ThreeHelmet from './ThreeHelmet';
import VerificationModal from './VerificationModal';

gsap.registerPlugin(ScrollTrigger);

const newsCards = [
  {
    id: 'doc-chamoli',
    category: 'construction',
    deaths: 'TUNNEL COLLAPSE',
    outlet: 'Associated Press',
    title: 'Chamoli Hydroelectric Tunnel Collapse trapped crews',
    desc: 'Vishnugad-Pipalkoti project construction tunnel collapsed after sudden water and debris ingress, causing multiple fatalities.',
    link: 'https://apnews.com/article/6ba136b3137fd828ef1837dede5a95a7?utm_source=chatgpt.com'
  },
  {
    id: 'doc-bengaluru',
    category: 'construction',
    deaths: 'MUD CAVE-IN',
    outlet: 'Times of India',
    title: 'Bengaluru Underpass Mud Cave-In Kills 2',
    desc: 'Two daily-wage workers died after mud caved in at an active underpass construction site in North Bengaluru.',
    link: 'https://timesofindia.indiatimes.com/city/bengaluru/2-workers-killed-after-mud-caves-in-at-underpass-construction-site-in-bengaluru/articleshow/133148850.cms?utm_source=chatgpt.com'
  },
  {
    id: 'doc-trichy',
    category: 'construction',
    deaths: 'MASON SITE FALL',
    outlet: 'Times of India',
    title: 'Trichy Mason Falls to Death; Contractor Booked',
    desc: 'Construction worker fell from height. Contractor and site engineer booked over failure to provide required safety harnesses.',
    link: 'https://timesofindia.indiatimes.com/city/trichy/mason-falls-to-death-two-booked/articleshow/133188552.cms?utm_source=chatgpt.com'
  },
  {
    id: 'doc-noida',
    category: 'construction',
    deaths: 'SAFETY BELT SNAP',
    outlet: 'Times of India',
    title: 'Noida snaps belt: 2 Fall 37 Floors to Death',
    desc: 'Two construction workers fell to their death at a high-rise project site in Greater Noida after their safety harness belt snapped.',
    link: 'https://timesofindia.indiatimes.com/city/noida/safety-belt-snaps-2-workers-fall-37-floors-to-death-at-project-site/articleshow/131668309.cms?utm_source=chatgpt.com'
  },
  {
    id: 'doc-chhattisgarh',
    category: 'factory',
    deaths: 'STEAM PIPE BLAST',
    outlet: 'IndustriALL Union',
    title: 'Chhattisgarh Power Plant Steam Explosion Kills 20',
    desc: 'High-pressure steam-pipe explosion at a Vedanta power plant in Singhitarai killed at least 20 workers and exposed 50.',
    link: 'https://www.industriall-union.org/singhitarai-explosion-india/?utm_source=chatgpt.com'
  },
  {
    id: 'doc-tamilnadu',
    category: 'factory',
    deaths: 'AMMONIA LEAK',
    outlet: 'The Hindu',
    title: 'Tamil Nadu Seafood Factory Ammonia Gas Leak',
    desc: 'Five workers died and dozens were hospitalised after a severe ammonia gas leak occurred at a seafood-processing plant.',
    link: 'https://www.thehindu.com/news/national/tamil-nadu/five-workers-die-dozens-hospitalised-after-ammonia-gas-leak-in-tn/article67104085.ece'
  },
  {
    id: 'doc-gujarat',
    category: 'factory',
    deaths: 'CHEMICAL FIRE',
    outlet: 'PIB India',
    title: 'Gujarat Chemical Factory Explosion; 16 Injured',
    desc: 'Explosion and fire at a chemical factory in Bharuch district. NHRC took suo motu cognizance and sought compensation safety reports.',
    link: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2256278&lang=1&reg=1&utm_source=chatgpt.com'
  },
  {
    id: 'doc-mumbai',
    category: 'construction',
    deaths: 'GANTRY CRANE FALL',
    outlet: 'Indian Express',
    title: 'Coastal Road Crane Fall: 2 Workers Die',
    desc: 'Two workers died after falling from a gantry crane at a Mumbai coastal-road construction site, prompting structural safety probe.',
    link: 'https://indianexpress.com/article/cities/mumbai/2-workers-fall-to-death-from-gantry-crane-at-site-for-coastal-road-10668423/?utm_source=chatgpt.com'
  },
  {
    id: 'doc-crushed',
    category: 'auto-sector',
    deaths: '7,000+ CRUSHED',
    outlet: 'Safe in India',
    title: 'CRUSHED 2024: Automobile Workplace Injuries Report',
    desc: 'Based on experiences of 7,000+ injured automobile supply chain workers. Assisted 10,000+ injured workers overall since 2016.',
    link: 'https://www.safeinindia.org/post/crushed-2024-india-s-only-annual-report-on-workplace-injuries-and-workers-safety-in-the-automobile'
  }
];

const matchMatrix = [
  {
    num: 'PROBLEM 01',
    icon: 'fa-solid fa-person-digging',
    title: 'Sewer & Manhole Safety',
    gap: 'No affordable pre-entry toxic gas testing equipment on site. Workers enter blind into sewer shafts, leading to sudden loss of consciousness and delayed rescue attempts.',
    solution: 'Pre-entry MQ4/MQ6 toxic gas detection, visual SAFE/DANGER indication on helmet RGB ring & OLED screen, plus automatic remote emergency alerts.'
  },
  {
    num: 'PROBLEM 02',
    icon: 'fa-solid fa-vial-circle-check',
    title: 'Toxic Gas Asphyxiation',
    gap: 'Silent Methane (CH4) and Hydrogen Sulfide (H2S) build-up in confined chambers causes asphyxiation within 30 seconds without any smell or visual warning.',
    solution: 'Dual chemical gas sampling probes continuous 100ms monitoring, 85dB piezo buzzer alert, visual 12-LED hazard strobe, and instant supervisor telemetry broadcast.'
  },
  {
    num: 'PROBLEM 03',
    icon: 'fa-solid fa-person-falling',
    title: 'Scaffolding & Height Falls',
    gap: 'Workers falling from multi-story scaffolding often remain unconscious and unlocated in complex industrial or construction sites for critical hours.',
    solution: 'Real-time MPU6050 6-axis IMU detects free-fall acceleration trajectories (>4.8G) and triggers immediate GPS coordinates rescue dispatch.'
  },
  {
    num: 'PROBLEM 04',
    icon: 'fa-solid fa-helmet-safety',
    title: 'Un-Alerted Hard Impact Strikes',
    gap: 'Hard strikes from falling debris or machinery cause severe head injuries without triggering an automatic SOS alert to site emergency medical staff.',
    solution: 'Impact-resistant IP67 sealed helmet shell with G-force spike registration and automatic emergency distress beacon broadcast.'
  },
  {
    num: 'PROBLEM 05',
    icon: 'fa-solid fa-map-location-dot',
    title: 'Construction Safety',
    gap: 'Falls from height and hard impact strikes go unnoticed in complex multi-story sites, resulting in slow medical response and unlocated workers.',
    solution: 'Real-time MPU6050 fall/impact detection, Hall sensor wear verification, GPS location sharing, and instant supervisor alarm notifications.'
  }
];

export default function LandingPage({ onGoToDashboard, playHoverClick, playExplodeHiss, onScrubAlarm }) {
  const [newsFilter, setNewsFilter] = useState('all');
  const [activeDoc, setActiveDoc] = useState(null);

  // Fluctuating Telemetry Values
  const [clockTime, setClockTime] = useState('');
  const [liveGas, setLiveGas] = useState(120);
  const [liveGpsSats, setLiveGpsSats] = useState(9);
  const [liveSpO2, setLiveSpO2] = useState(98);
  const [liveHeartRate, setLiveHeartRate] = useState(74);

  const newsTrackRef = useRef(null);
  const piTrackRef = useRef(null);

  const filteredNews = newsCards.filter(
    (card) => newsFilter === 'all' || card.category.includes(newsFilter)
  );

  const handleCardClick = (docId) => {
    if (playHoverClick) playHoverClick();
    setActiveDoc(docId);
  };

  const handleSyncClick = () => {
    if (playHoverClick) playHoverClick();
    const btn = document.getElementById('btn-sync-live-news');
    const icon = document.getElementById('sync-icon');
    const text = document.getElementById('sync-text');
    if (btn && icon && text) {
      btn.classList.add('syncing');
      icon.classList.add('fa-spin');
      text.textContent = 'Syncing Wire...';
      setTimeout(() => {
        btn.classList.remove('syncing');
        icon.classList.remove('fa-spin');
        text.textContent = 'Sync Live Safety Wire';
      }, 1200);
    }
  };

  const scrollSlider = (trackRef, offset) => {
    if (playHoverClick) playHoverClick();
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Drag scroll mouse listeners
  const handleDragStart = (e, trackRef) => {
    const track = trackRef.current;
    if (!track) return;
    track.isDown = true;
    track.startX = e.pageX - track.offsetLeft;
    track.scrollLeftPos = track.scrollLeft;
  };

  const handleDragLeaveOrUp = (trackRef) => {
    const track = trackRef.current;
    if (!track) return;
    track.isDown = false;
  };

  const handleDragMove = (e, trackRef) => {
    const track = trackRef.current;
    if (!track || !track.isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - track.startX) * 1.8;
    track.scrollLeft = track.scrollLeftPos - walk;
  };

  // Ticker clock updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setClockTime(`${hrs}:${mins}:${secs} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry fluctuation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGas(Math.floor(118 + Math.random() * 8));
      setLiveGpsSats(Math.floor(8 + Math.random() * 3));
      setLiveSpO2(Math.floor(97 + Math.random() * 3));
      setLiveHeartRate(Math.floor(72 + Math.random() * 6));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // GSAP Viewport Scroll Animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
    // Animate Hero section elements on load
    gsap.fromTo('.hero-copy > *, .hero-product',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power4.out', delay: 0.2 }
    );

    // Stagger section headers entering viewport
    const headers = document.querySelectorAll('.section-header');
    headers.forEach((header) => {
      gsap.fromTo(header,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // Stagger matrix & safety report cards entering viewport
    const sliders = document.querySelectorAll('.news-slider-track, .pi-slider-track, .hardware-modules-grid');
    sliders.forEach((slider) => {
      const cards = slider.children;
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: slider,
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          }
        );
      }
    });

    });
    return () => context.revert();
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          <a href="#hero" className="brand-logo" aria-label="Suraksha One home">
            <span className="brand-icon-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3 4 6v6c0 4 3 7 8 9 5-2 8-5 8-9V6z" />
                <path d="m8 12 3 3 5-6" />
              </svg>
            </span>
            <span className="brand-title-group">
              <span className="brand-name">suraksha<span className="brand-one">one.</span></span>
              <span className="brand-tag">CONNECTED WORKER SAFETY</span>
            </span>
          </a>
          <nav aria-label="Main navigation">
            <ul className="nav-links">
              <li><a href="#hero" className="nav-link">Overview</a></li>
              <li><a href="#sequence" className="nav-link">How it works</a></li>
              <li><a href="#hardware" className="nav-link">Hardware</a></li>
              <li><a href="#impact" className="nav-link">Research</a></li>
            </ul>
          </nav>
          <button onClick={onGoToDashboard} className="btn-header-dashboard">Open dashboard <span aria-hidden="true">↗</span></button>
          <details className="mobile-nav">
            <summary aria-label="Open navigation">Menu <span aria-hidden="true">+</span></summary>
            <nav aria-label="Mobile navigation" onClick={(event) => { event.currentTarget.closest('details').open = false; }}>
              <a href="#hero">Overview</a>
              <a href="#sequence">How it works</a>
              <a href="#hardware">Hardware</a>
              <a href="#impact">Research</a>
              <a href="#helmet-explorer">3D explorer</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="main-content">
        <section id="hero" className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-badge"><span className="pill-dot" />SMART HELMET. HUMAN FIRST.</div>
            <h1 id="hero-title" className="hero-title">Safety.<br />One step<br /><span className="highlight">ahead.</span></h1>
            <p className="hero-subtitle">Sense danger before stepping into it. Pre-entry gas detection, fall alerts, and connected monitoring — built into one smart helmet.</p>
            <div className="hero-cta-group">
              <button onClick={onGoToDashboard} className="btn-primary">Explore dashboard <span aria-hidden="true">↗</span></button>
              <a href="#sequence" className="btn-secondary"><span className="play-icon" aria-hidden="true">▷</span> Discover the system</a>
            </div>
            <div className="hero-proof"><span className="proof-symbol" aria-hidden="true">✓</span> Open hardware. Connected protection.<br /><span className="proof-caption">For construction sites and confined spaces.</span></div>
          </div>

          <div id="helmet-explorer" className="hero-product">
            <div className="product-topline"><span><span className="pill-dot" /> SURAKSHA ONE / V1</span><span className="product-tag">INTERACTIVE CONCEPT</span></div>
            <div className="product-orbit" aria-hidden="true" />
            <span className="product-watermark" aria-hidden="true">S1</span>
            <ThreeHelmet hero playHoverClick={playHoverClick} playExplodeHiss={playExplodeHiss} />
            <div className="product-readout">
              <div className="readout-heading"><span><span className="pill-dot" /> Sensor preview</span><span>SIMULATED</span></div>
              <div className="readout-values">
                <div><span>Gas level</span><strong>{liveGas}<small> ppm</small></strong></div>
                <div><span>Blood oxygen</span><strong>{liveSpO2}<small> %</small></strong></div>
                <div><span>Heart rate</span><strong>{liveHeartRate}<small> bpm</small></strong></div>
              </div>
            </div>
            <div className="product-caption"><span>01 / THE CONNECTED HELMET</span><a href="#hardware">Meet the hardware ↗</a></div>
          </div>
        </section>

        <div className="capability-strip" aria-label="Helmet capabilities">
          <div><span className="capability-index">01</span><div><strong>Detect before entry</strong><span>MQ4 & MQ6 gas sensing</span></div></div>
          <div><span className="capability-index">02</span><div><strong>Stay connected</strong><span>Vitals & location monitoring</span></div></div>
          <div><span className="capability-index">03</span><div><strong>Respond to danger</strong><span>Fall & impact alerts</span></div></div>
          <a href="#sequence" className="strip-link">Discover the system <span aria-hidden="true">↓</span></a>
        </div>

        <div className="section-divider"></div>

        <section id="schematic" className="system-preview content-section" aria-labelledby="system-title">
          <div className="system-intro">
            <div className="section-tag">AWARENESS. BUILT IN.</div>
            <h2 id="system-title" className="section-title">One helmet.<br />A wider view.</h2>
            <p className="section-desc">From the air around you to the people beside you. Bring every signal into focus.</p>
            <button onClick={onGoToDashboard} className="btn-secondary">Enter the demo console <span aria-hidden="true">↗</span></button>
          </div>
          <div className="signal-card gas-signal">
            <div className="signal-card-top"><span>01 / ENVIRONMENT</span><i className="fa-solid fa-wind" aria-hidden="true" /></div>
            <div className="signal-value">{liveGas}<small> ppm</small></div>
            <svg className="signal-wave" viewBox="0 0 300 60" fill="none" aria-hidden="true"><path d="M0 46 25 46 38 25 52 48 73 40 91 43 109 12 125 48 145 39 160 43 178 18 193 41 220 33 235 45 257 24 276 41 300 38" /></svg>
            <h3>Know before you go.</h3><p>Gas sensing before entry.</p><span className="signal-note"><span className="pill-dot" /> SIMULATED READING</span>
          </div>
          <div className="signal-card vitals-signal">
            <div className="signal-card-top"><span>02 / PEOPLE</span><i className="fa-solid fa-heart-pulse" aria-hidden="true" /></div>
            <div className="signal-value">{liveHeartRate}<small> bpm</small></div>
            <svg className="signal-wave" viewBox="0 0 300 60" fill="none" aria-hidden="true"><path d="M0 33H62L74 23 85 40 102 4 116 57 131 26 143 33H200L212 23 222 39 238 8 251 51 263 28 275 33H300" /></svg>
            <h3>Every worker, connected.</h3><p>Vitals in a shared safety view.</p><span className="signal-note">DEMO DATA / {liveSpO2}% SpO₂</span>
          </div>
        </section>

        {/* Scroll Sequence Section */}
        <ScrollSequence onScrubAlarm={onScrubAlarm} />

        <div className="section-divider"></div>

        {/* Live Telemetry & National Toll Ticker Stream Bar */}
        <div className="ticker-banner-container">
          <div className="hero-ticker-bar">
            <div className="ticker-label-group">
              <span className="ticker-label">
                <span className="live-pulse-dot"></span>
                DEMO STREAM
              </span>
              <span className="ticker-timestamp">{clockTime}</span>
            </div>
            <div className="ticker-track">
              <div className="ticker-content">
                [SIMULATED SENSOR STREAM] Node #04 ESP32 Online &bull; MQ4 Gas: {liveGas} PPM (SAFE) &bull; MPU6050: 1.0G &bull; GPS: {liveGpsSats} Satellites Locked &bull; SpO2: {liveSpO2}% &bull; Heart Rate: {liveHeartRate} BPM &nbsp;&bull;&nbsp; [SAFE IN INDIA CRUSHED DATA] 7,000+ Automobile Supply Chain Injuries &bull; 10,000+ Injured Workers Assisted Since 2016 &bull; [CONSTRUCTION COMPLIANCE] Bengaluru site safety audits ordered &bull; Sewri-Worli elevated contractor penalised.
              </div>
            </div>
          </div>
        </div>

        {/* Impact Stat Section */}
        <section id="impact" className="content-section">
          <div className="impact-stat-wrapper hazard-stripe-top">
            <div className="impact-grid">
              <div className="impact-stat-box">
                <div className="stat-number">7,000+</div>
                <div className="stat-label">Injured Auto-Sector Workers</div>
                <div className="stat-timeframe">Safe in India Report • 10,000+ Assisted Cases</div>
              </div>
              <div className="impact-citation-box">
                <p className="citation-text">
                  "Safe in India's CRUSHED 2024 report compiles the experiences of over 7,000+ injured auto-sector supply chain workers, providing critical safety audits, machine safeguards, and rehabilitation support across Gurugram, Manesar, Pune, and national manufacturing hubs."
                </p>
                <button
                  onClick={() => handleCardClick('doc-crushed')}
                  className="citation-source-link cursor-pointer"
                  style={{ background: 'none', border: 'none', textAlign: 'left' }}
                >
                  <i className="fa-solid fa-landmark text-amber-bright mr-2"></i>
                  INSPECT VERIFIED CRUSHED 2024 SAFETY AUDIT &rarr;
                </button>
              </div>
            </div>
          </div>

          <div className="section-header">
            <div className="section-tag">THE REASON WE BUILD</div>
            <h2 className="section-title">Behind every statistic, a worker.</h2>
            <p className="section-desc">
              Click any card to inspect the official safety reports, foundation publications (Safe in India), and verified news audits (The Hindu, Indian Express) detailing industrial hazards.
            </p>
          </div>

          {/* Interactive Category Filter Chips & Live Sync Button */}
          <div className="news-filter-bar">
            {['all', 'construction', 'factory', 'auto-sector'].map((filter) => (
              <button
                key={filter}
                onClick={() => setNewsFilter(filter)}
                aria-pressed={newsFilter === filter}
                className={`filter-chip ${newsFilter === filter ? 'active' : ''}`}
              >
                {filter === 'all' ? 'All Safety Reports' : filter.toUpperCase().replace('-', ' ')}
              </button>
            ))}
            <button
              id="btn-sync-live-news"
              onClick={handleSyncClick}
              className="filter-chip sync-btn cursor-pointer"
            >
              <i className="fa-solid fa-arrows-rotate mr-1" id="sync-icon"></i>
              <span id="sync-text">Sync Live Safety Wire</span>
            </button>
          </div>

          {/* Horizontal Side-Scrolling News Carousel */}
          <div className="news-slider-wrapper relative">
            <button
              onClick={() => scrollSlider(newsTrackRef, -400)}
              id="news-prev-btn"
              className="slider-arrow arrow-left"
              aria-label="Scroll Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div
              ref={newsTrackRef}
              id="news-slider-track"
              className="news-slider-track flex overflow-x-auto gap-8"
              onMouseDown={(e) => handleDragStart(e, newsTrackRef)}
              onMouseLeave={() => handleDragLeaveOrUp(newsTrackRef)}
              onMouseUp={() => handleDragLeaveOrUp(newsTrackRef)}
              onMouseMove={(e) => handleDragMove(e, newsTrackRef)}
            >
              {filteredNews.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleCardClick(card.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Read report: ${card.title}`}
                  className="news-card-slide"
                  data-category={card.category}
                  data-doc-id={card.id}
                >
                  <div>
                    <div className="news-meta">
                      <span className="news-date">{card.deaths}</span>
                      <span className="news-outlet">{card.outlet}</span>
                    </div>
                    <h3 className="news-title">{card.title}</h3>
                    <p className="news-body">{card.desc}</p>
                  </div>
                  <span className="news-link">
                    <i className={`fa-solid ${
                      card.category === 'construction' ? 'fa-person-digging text-amber-bright' :
                      card.category === 'factory' ? 'fa-industry text-danger-bright' : 'fa-helmet-safety text-hud-cyan'
                    } mr-1`}></i>
                    Inspect Safety Report &rarr;
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollSlider(newsTrackRef, 400)}
              id="news-next-btn"
              className="slider-arrow arrow-right"
              aria-label="Scroll Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="news-takeaway-banner mt-14">
            <h4 className="takeaway-title">The Two Lethal Failures Suraksha One Solves</h4>
            <p className="takeaway-desc text-white">
              <strong>1. No pre-entry check before entry.</strong> &nbsp;&bull;&nbsp; 
              <strong>2. No automatic emergency signal when a worker collapses.</strong>
            </p>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* Match matrix */}
        <section className="content-section">
          <div className="section-header">
            <div className="section-tag">DESIGNED AROUND REAL RISKS</div>
            <h2 className="section-title">Closing the safety gap.</h2>
            <p className="section-desc">
              Mapping Suraksha One's hardware & sensor innovations directly to the 5 core workplace hazards causing preventable fatalities across India.
            </p>
          </div>

          {/* Side-Scrolling Problem Matrix Slider */}
          <div className="pi-slider-wrapper relative">
            <button
              onClick={() => scrollSlider(piTrackRef, -440)}
              id="pi-prev-btn"
              className="slider-arrow arrow-left"
              aria-label="Scroll Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div
              ref={piTrackRef}
              id="pi-slider-track"
              className="pi-slider-track flex overflow-x-auto gap-8"
              onMouseDown={(e) => handleDragStart(e, piTrackRef)}
              onMouseLeave={() => handleDragLeaveOrUp(piTrackRef)}
              onMouseUp={() => handleDragLeaveOrUp(piTrackRef)}
              onMouseMove={(e) => handleDragMove(e, piTrackRef)}
            >
              {matchMatrix.map((item, idx) => (
                <div key={idx} className="pi-card">
                  <div className="pi-header">
                    <span className="pi-num">
                      <i className={`${item.icon} mr-2`}></i>
                      {item.num}
                    </span>
                    <h3 className="pi-title">{item.title}</h3>
                  </div>
                  <div className="pi-content">
                    <div className="pi-box gap">
                      <div className="pi-box-label">
                        <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                        EXISTING GAP
                      </div>
                      <div className="pi-box-desc">{item.gap}</div>
                    </div>
                    <div className="pi-box solution">
                      <div className="pi-box-label">
                        <i className="fa-solid fa-circle-check mr-1"></i>
                        SURAKSHA ONE IMPACT
                      </div>
                      <div className="pi-box-desc">{item.solution}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollSlider(piTrackRef, 440)}
              id="pi-next-btn"
              className="slider-arrow arrow-right"
              aria-label="Scroll Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* Hardware specifications grid */}
        <section id="hardware" className="content-section">
          <div className="section-header">
            <div className="section-tag">HARDWARE SPECIFICATION</div>
            <h2 className="section-title">Small components. A bigger purpose.</h2>
            <p className="section-desc">
              Every component in Suraksha One is selected for industrial reliability, low power consumption, and real-time telemetry throughput.
            </p>
          </div>

          <div className="hardware-modules-grid">
            <div className="hw-card">
              <div className="hw-icon-box">
                <i className="fa-solid fa-vial-circle-check text-xl text-amber-bright"></i>
              </div>
              <h3 className="hw-category">Gas & Hazard Detection</h3>
              <ul className="hw-list">
                <li className="hw-item"><span className="hw-item-chip">MQ4</span> Methane (CH4) & Gas Probe</li>
                <li className="hw-item"><span className="hw-item-chip">MQ6</span> LPG & Gas Sensor</li>
                <li className="hw-item"><span className="hw-item-chip">PRE-ENTRY</span> Calibrated safe baseline indicator</li>
              </ul>
            </div>

            <div className="hw-card">
              <div className="hw-icon-box">
                <i className="fa-solid fa-heart-pulse text-xl text-danger-bright"></i>
              </div>
              <h3 className="hw-category">Worker Vitals & Climate</h3>
              <ul className="hw-list">
                <li className="hw-item"><span className="hw-item-chip">MAX30100</span> Heart Rate & Blood Oxygen</li>
                <li className="hw-item"><span className="hw-item-chip">DS18B20</span> Body Temperature probe</li>
                <li className="hw-item"><span className="hw-item-chip">DHT11</span> Ambient Temperature & Humidity</li>
              </ul>
            </div>

            <div className="hw-card">
              <div className="hw-icon-box">
                <i className="fa-solid fa-person-falling-burst text-xl text-hud-cyan-bright"></i>
              </div>
              <h3 className="hw-category">Motion & Wear compliance</h3>
              <ul className="hw-list">
                <li className="hw-item"><span className="hw-item-chip">MPU6050</span> 6-Axis IMU (Fall detection)</li>
                <li className="hw-item"><span className="hw-item-chip">HALL EFFECT</span> Harness latched compliance check</li>
                <li className="hw-item"><span className="hw-item-chip">NEODYMIUM</span> Dual safety latch magnets</li>
              </ul>
            </div>

            <div className="hw-card">
              <div className="hw-icon-box">
                <i className="fa-solid fa-bullhorn text-xl text-amber-bright"></i>
              </div>
              <h3 className="hw-category">Comms & Alert System</h3>
              <ul className="hw-list">
                <li className="hw-item"><span className="hw-item-chip">NEO-6M</span> satellite GPS receiver</li>
                <li className="hw-item"><span className="hw-item-chip">INMP441</span> Noise-canceling digital mic</li>
                <li className="hw-item"><span className="hw-item-chip">MAX98357A</span> 3W Audio amp & speaker</li>
                <li className="hw-item"><span className="hw-item-chip">RGB RING</span> 12-LED visual warning ring</li>
              </ul>
            </div>

            <div className="hw-card">
              <div className="hw-icon-box">
                <i className="fa-solid fa-microchip text-xl text-safe-bright"></i>
              </div>
              <h3 className="hw-category">Dual Processing Core</h3>
              <ul className="hw-list">
                <li className="hw-item"><span className="hw-item-chip">ESP32 Core</span> Xtensa Dual-Core microcontroller</li>
                <li className="hw-item"><span className="hw-item-chip">ESP32-CAM</span> Video streaming and optics</li>
              </ul>
            </div>

            <div className="hw-card">
              <div className="hw-icon-box">
                <i className="fa-solid fa-car-battery text-xl text-amber-bright"></i>
              </div>
              <h3 className="hw-category">Power & Enclosure</h3>
              <ul className="hw-list">
                <li className="hw-item"><span className="hw-item-chip">BATTERY</span> Li-ion rechargeable cell pack</li>
                <li className="hw-item"><span className="hw-item-chip">BUCK</span> High-efficiency DC buck regulator</li>
                <li className="hw-item"><span className="hw-item-chip">IP67</span> Impact-resistant waterproof seal</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* Call to action */}
        <div className="cta-banner-section">
          <h2 className="cta-banner-title">See the whole picture.</h2>
          <p className="cta-banner-desc">
            Explore the demo console for worker vitals, gas readings, and emergency alerts in one place.
          </p>
          <button onClick={onGoToDashboard} className="btn-primary">Open dashboard <span aria-hidden="true">↗</span></button>
        </div>

      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="brand-name">SURAKSHA ONE</span>
              <p className="mt-4">
                An open hardware & software safety platform engineered to eradicate preventable deaths in confined-space sanitation and construction environments.
              </p>
            </div>

            <div className="footer-citations text-left">
              <strong className="text-white">DATA SOURCE CITATIONS:</strong><br />
              &bull; 332 Deaths (Jan 2021 – Jun 2026): Lok Sabha Written Reply by MoS for Social Justice & Empowerment, NCSK Data via PIB India.<br />
              &bull; 498 Deaths (2019 – 2026): Nationwide sewer & septic tank toll cited by Outlook India.<br />
              &bull; 66 Sanitation Worker Fatalities: Documented by DASAM advocacy group (Feb–Jul 2026).
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; 2026 Suraksha One Industrial Safety Initiative. Open Hardware (CERN-OHL).</span>
            <span>Built with Three.js, GSAP & React Motion Springs</span>
          </div>
        </div>
      </footer>

      {/* Global verification modal */}
      {activeDoc && (
        <VerificationModal docId={activeDoc} onClose={() => setActiveDoc(null)} />
      )}
    </>
  );
}
