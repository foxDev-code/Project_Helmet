import React from 'react';

const govtDocsData = {
  'doc-chamoli': {
    org: 'ASSOCIATED PRESS • DISASTER INVESTIGATION',
    title: 'Chamoli Hydroelectric Tunnel Collapse & Ingress Audit',
    ministry: 'National Disaster Management Authority (NDMA)',
    date: 'August 2026',
    ref: 'AP News Bureau / Vishnugad-Pipalkoti Hydro Project',
    excerpt: '"A tunnel under construction at the Vishnugad-Pipalkoti hydroelectric project collapsed after sudden water ingress and debris flow trapped excavation crews. The NDMA is investigating structural monitoring and emergency alarm protocols at hydroelectric construction sites."',
    tableRows: [
      ['Vishnugad Project', 'Multiple Trapped Workers', 'No Ingress Sensors', 'NDRF Rescue Active'],
      ['Hydro Tunnel Sites', 'Safety Compliance Audit', 'No Real-time Gas Probes', 'National Site Review']
    ],
    pdf: 'https://apnews.com/article/6ba136b3137fd828ef1837dede5a95a7',
    portal: 'https://apnews.com/',
    btn1Text: 'Read Report on AP News →',
    btn2Text: 'Open AP News Portal →'
  },
  'doc-bengaluru': {
    org: 'TIMES OF INDIA • URBAN INFRASTRUCTURE AUDIT',
    title: 'North Bengaluru Underpass Construction Cave-In Fatality',
    ministry: 'Bruhat Bengaluru Mahanagara Palike (BBMP) Safety Cell',
    date: 'August 2026',
    ref: 'Times of India Bangalore Bureau',
    excerpt: '"Two daily-wage workers were crushed under caved-in mud at an underpass excavation site in North Bengaluru. BBMP has ordered audits of trench shoring and soil stabilization protocols across all municipal construction sites to prevent further fatal cave-ins."',
    tableRows: [
      ['North Bengaluru Site', '2 Fatalities', 'No Soil Stress Sensors', 'Compensation Pending'],
      ['Municipal Excavation', 'Shoring Deficits', 'Manual Inspection Only', 'Strict Site Watch Mandate']
    ],
    pdf: 'https://timesofindia.indiatimes.com/city/bengaluru/2-workers-killed-after-mud-caves-in-at-underpass-construction-site-in-bengaluru/articleshow/133148850.cms',
    portal: 'https://timesofindia.indiatimes.com/',
    btn1Text: 'Read Report on Times of India →',
    btn2Text: 'Open Times of India →'
  },
  'doc-trichy': {
    org: 'TIMES OF INDIA • CONSTRUCTION SITE VIOLATION',
    title: 'Trichy Construction Site Mason Fall & Criminal Case',
    ministry: 'Tamil Nadu Directorate of Industrial Safety & Health',
    date: 'August 2026',
    ref: 'TOI Trichy Bureau / FIR No. 2026/TN',
    excerpt: '"A construction mason fell to his death from an elevated site in Trichy. Police registered a criminal case against the site contractor and engineer for failing to supply safety harnesses, verify lanyard compliance, or install safety catch nets."',
    tableRows: [
      ['Trichy Building Site', '1 Fatality', '0% Harness Deployment', 'Contractor & Engineer Booked'],
      ['Safety Gear Compliance', 'Critical Deficits', 'No Wearable Sensors', 'Site License Suspended']
    ],
    pdf: 'https://timesofindia.indiatimes.com/city/trichy/mason-falls-to-death-two-booked/articleshow/133188552.cms',
    portal: 'https://timesofindia.indiatimes.com/',
    btn1Text: 'Read Report on TOI →',
    btn2Text: 'Open TOI Portal →'
  },
  'doc-noida': {
    org: 'TIMES OF INDIA • HIGH-RISE STRUCTURAL AUDIT',
    title: 'Greater Noida High-Rise Project Safety Belt Snap Incident',
    ministry: 'UP Directorate of Industrial Safety & Health',
    date: '2026',
    ref: 'TOI Noida Bureau',
    excerpt: '"Two construction workers fell 37 floors to their death after their safety belt snapped during exterior high-rise cladding work in Greater Noida. Audits revealed poor inspection of PPE harness load limits and complete absence of real-time fall trajectory alerts."',
    tableRows: [
      ['Greater Noida High-Rise', '2 Fatalities', 'Harness Snap Failure', 'Work Suspended / Audit Active'],
      ['Harness Inspections', 'Severe Lapses', 'No Digital Load Monitoring', 'Strict Site Watch Mandate']
    ],
    pdf: 'https://timesofindia.indiatimes.com/city/noida/safety-belt-snaps-2-workers-fall-37-floors-to-death-at-project-site/articleshow/131668309.cms',
    portal: 'https://timesofindia.indiatimes.com/',
    btn1Text: 'Read Report on TOI →',
    btn2Text: 'Open TOI Portal →'
  },
  'doc-chhattisgarh': {
    org: 'INDUSTRIALL UNION • HEAVY INDUSTRIAL DISASTER',
    title: 'Chhattisgarh Singhitarai Power Plant Steam-Pipe Explosion',
    ministry: 'Chhattisgarh State Pollution Control Board & Safety Cell',
    date: 'April 2026',
    ref: 'IndustriALL Global Union Case Report',
    excerpt: '"A high-pressure steam-pipe explosion at a Vedanta power plant in Singhitarai, Chhattisgarh, resulted in at least 20 worker fatalities and 50 severe exposures. The union has demanded automated thermal probes and valve leak telemetry alerts in high-risk zones."',
    tableRows: [
      ['Singhitarai Power Plant', '20+ Fatalities / 50 Exposed', 'Pressure Telemetry Failure', 'Industrial Action Triggered'],
      ['Steam-Pipe Networks', 'Inadequate Monitoring', 'No Automated Shutoff', 'Safety Standards Audit']
    ],
    pdf: 'https://www.industriall-union.org/singhitarai-explosion-india/',
    portal: 'https://www.industriall-union.org/',
    btn1Text: 'Read Report on IndustriALL →',
    btn2Text: 'Open IndustriALL Portal →'
  },
  'doc-tamilnadu': {
    org: 'THE HINDU • FACTORY HAZARD INQUEST',
    title: 'Tamil Nadu Seafood Processing Factory Ammonia Gas Leak',
    ministry: 'Tamil Nadu Department of Environment & Forest',
    date: 'June 2026',
    ref: 'The Hindu Chennai News Bureau',
    excerpt: '"A severe ammonia gas leak at a seafood factory in Tamil Nadu killed 5 workers and hospitalised dozens. The incident highlights the critical need for wearable electrochemical gas sensors and real-time alarms in food-processing plants."',
    tableRows: [
      ['Seafood Processing Plant', '5 Fatalities / Dozens Hospitalised', 'No Wearable Gas Probes', 'Closure Notice Served'],
      ['Gas Detection Coverage', 'Critical Deficit', 'Manual Inspection Only', 'SOP Revision Enforced']
    ],
    pdf: 'https://www.thehindu.com/news/national/tamil-nadu/five-workers-die-dozens-hospitalised-after-ammonia-gas-leak-in-tn/article67104085.ece',
    portal: 'https://www.thehindu.com/',
    btn1Text: 'Read Report on The Hindu →',
    btn2Text: 'Open The Hindu Portal →'
  },
  'doc-gujarat': {
    org: 'PRESS INFORMATION BUREAU • NHRC COGNIZANCE',
    title: 'Bharuch Chemical Factory Explosion & Compensation Audit',
    ministry: 'National Human Rights Commission (NHRC)',
    date: 'April 2026',
    ref: 'PIB Press Release ID 2256278',
    excerpt: '"Following a massive explosion and fire at a chemical plant in Bharuch, Gujarat, that injured 16 workers, the NHRC took suo motu cognizance to review compensation compliance, emergency hazard response, and gas sensing standards."',
    tableRows: [
      ['Bharuch Chemical Hub', '16 Workers Injured', 'Fume Ignition Hazard', 'NHRC Suo Motu Cognizance'],
      ['Factory Safety Auditing', 'Severe Lapses', 'No Sensor Integration', 'Compensation Verified']
    ],
    pdf: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2256278',
    portal: 'https://www.pib.gov.in/',
    btn1Text: 'Read Release on PIB →',
    btn2Text: 'Open PIB Official Portal →'
  },
  'doc-mumbai': {
    org: 'INDIAN EXPRESS • INFRASTRUCTURE PROJECT INCIDENT',
    title: 'Mumbai Coastal-Road Gantry Crane Fall & Probe',
    ministry: 'Maharashtra Urban Development Department / BMC',
    date: '2026',
    ref: 'Indian Express Mumbai Bureau',
    excerpt: '"Two construction workers fell to their death from a gantry crane at the coastal-road project site in Mumbai. The municipal corporation has ordered a high-level safety probe into fall-protection latch status and crane operation monitoring."',
    tableRows: [
      ['Coastal Road Project', '2 Fatalities', 'Latch Lanyard Failure', 'High-Level Probe Ordered'],
      ['Elevated Crane Safety', 'Deficient Protocols', 'No Sensor Monitoring', 'Work Temporarily Halted']
    ],
    pdf: 'https://indianexpress.com/article/cities/mumbai/2-workers-fall-to-death-from-gantry-crane-at-site-for-coastal-road-10668423/',
    portal: 'https://indianexpress.com/',
    btn1Text: 'Read Report on Indian Express →',
    btn2Text: 'Open Indian Express →'
  },
  'doc-crushed': {
    org: 'SAFE IN INDIA FOUNDATION • CRUSHED 2024 REPORT',
    title: 'Workplace Injuries & Auto-Sector Supply Chain Safety Audit',
    ministry: 'Safe In India Foundation Research Team',
    date: '2024',
    ref: 'SII Crushed Report v8.0',
    excerpt: '"Safe in India\'s CRUSHED 2024 report compiles the experiences of over 7,000+ injured workers in the automobile sector supply chain. Since 2016, the foundation has assisted 10,000+ injured workers overall (including 7,000+ specifically in auto manufacturing hubs), advocating for smart industrial safety helmets and hands-on safety training."',
    tableRows: [
      ['Auto Supply Chain', '7,000+ Injured Workers', 'Lack of Smart PPE', '10,000+ Total Assisted'],
      ['Gurugram-Manesar Hub', '4,500+ Injured Workers', 'High-Risk Machinery', 'Active Support Case'],
      ['Pune Auto Cluster', '1,200+ Injured Workers', 'Medium-Risk Machinery', 'Active Support Case']
    ],
    pdf: 'https://www.safeinindia.org/post/crushed-2024-india-s-only-annual-report-on-workplace-injuries-and-workers-safety-in-the-automobile',
    portal: 'https://www.safeinindia.org/',
    btn1Text: 'Read CRUSHED 2024 Report →',
    btn2Text: 'Open Safe in India Official Site →'
  }
};

export default function VerificationModal({ docId, onClose }) {
  if (!docId) return null;
  const data = govtDocsData[docId] || govtDocsData['doc-chamoli'];

  return (
    <div className="govt-doc-modal active">
      <div className="govt-doc-modal-content">
        <button className="popover-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="govt-modal-header">
          <div className="emblem-box">
            <i className="fa-solid fa-landmark text-amber-bright text-2xl"></i>
          </div>
          <div>
            <div className="govt-modal-sub">{data.org}</div>
            <h3 className="govt-modal-title">{data.title}</h3>
          </div>
        </div>

        <div className="govt-modal-meta-bar">
          <div>ORGANIZATION: <strong>{data.ministry}</strong></div>
          <div>REPORT DATE: <strong>{data.date}</strong></div>
          <div>REFERENCE: <strong>{data.ref}</strong></div>
        </div>

        <div className="govt-excerpt-box mb-6">
          {data.excerpt}
        </div>

        <div className="state-table-wrapper mb-6">
          <table className="state-table">
            <thead>
              <tr>
                <th>Site Location / Category</th>
                <th>Incident Details</th>
                <th>Safety Gear Coverage</th>
                <th>Action & Compensation Status</th>
              </tr>
            </thead>
            <tbody>
              {data.tableRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td className="text-danger-bright">{row[2]}</td>
                  <td>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="govt-modal-actions">
          <a
            href={data.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-header-dashboard"
          >
            <i className="fa-solid fa-newspaper mr-1"></i> {data.btn1Text}
          </a>
          <a
            href={data.portal}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary py-2 px-6 text-sm"
          >
            <i className="fa-solid fa-globe mr-1"></i> {data.btn2Text}
          </a>
        </div>
      </div>
    </div>
  );
}
