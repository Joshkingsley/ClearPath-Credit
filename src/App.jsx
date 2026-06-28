import React, { useState, useEffect, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM (Modern SaaS Tokens)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  primary: "#0f8090", // Deep Teal
  primaryLight: "rgba(15, 128, 144, 0.1)",
  secondary: "#177245", // Forest Green
  accent: "#c8960c", // Gold
  danger: "#df1c41",
  ink: "#0f172a", // Slate 900
  slate: "#64748b", // Slate 500
  canvas: "#f8fafc",
  white: "#ffffff",
  border: "#e2e8f0",
  shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
  glass: "rgba(255, 255, 255, 0.8)",
  font: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA & ENGINE (Logic preserved & enhanced)
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PERSONAS = [
  { persona_id:"UG-BRONZE",   farmer_name:"Owino Moses",     gender:"Male",   country:"Uganda",       decision_tier:"Bronze", farm_ha:"0.8",  crop:"Maize",    credit_eligible:"False" },
  { persona_id:"UG-GOLD",     farmer_name:"Ssemakula John",  gender:"Male",   country:"Uganda",       decision_tier:"Gold",   farm_ha:"18",   crop:"Maize",    credit_eligible:"True"  },
  { persona_id:"SA-SILVER",   farmer_name:"Nomsa Dlamini",   gender:"Female", country:"South Africa", decision_tier:"Silver", farm_ha:"9",    crop:"Eucalyptus",credit_eligible:"True" },
  { persona_id:"ZW-GOLD-F",   farmer_name:"Tsitsi Mapfumo",  gender:"Female", country:"Zimbabwe",     decision_tier:"Gold",   farm_ha:"80",   crop:"Tobacco",  credit_eligible:"True"  },
  { persona_id:"UG-BRONZE-F", farmer_name:"Achieng Grace",   gender:"Female", country:"Uganda",       decision_tier:"Bronze", farm_ha:"0.5",  crop:"Maize",    credit_eligible:"False" },
];

const ACTION_MAP = {
  f_023: { label:"Log Irrigation", impact:"High", agent:"Farmer", access: true, desc: "Log water usage via USSD." },
  f_024: { label:"Crop Health", impact:"High", agent:"Farmer", access: true, desc: "Weekly health status reporting." },
  f_032: { label:"Soil Test", impact:"Critical", agent:"Agent", access: true, desc: "On-site chemical analysis." },
  f_033: { label:"Enroll Insurance", impact:"Medium", agent:"Agent", access: true, desc: "Parametric drought cover." },
  f_009: { label:"Group Fencing", impact:"Medium", agent:"Group", access: false, desc: "Shared perimeter security." },
};

const MOCK_SHAP = {
  "UG-BRONZE":   [["f_023",-1.37],["f_024",-1.15],["f_032",-0.94],["f_031",-0.62],["f_021",-0.38]],
  "UG-GOLD":     [["f_023",1.18],["f_024",1.15],["f_032",1.11],["f_031",0.92],["f_033",0.89]],
  "SA-SILVER":   [["f_032",0.49],["f_023",0.41],["f_031",0.40],["f_030",0.37],["f_029",0.36]],
  "ZW-GOLD-F":   [["f_023",1.13],["f_024",1.04],["f_032",1.00],["f_033",0.94],["f_031",0.92]],
  "UG-BRONZE-F": [["f_023",-1.37],["f_032",-1.04],["f_024",-1.00],["f_031",-0.72],["f_030",-0.60]],
};

const MOCK_PEERS = {
  "UG-BRONZE":   { name:"Nambi Florence",  shared_group:"Masaka SACCO", prev_tier:"Bronze", curr_tier:"Silver", trust: 0.82 },
  "UG-BRONZE-F": { name:"Grace Achieng",   shared_group:"Masaka SACCO", prev_tier:"Bronze", curr_tier:"Gold",   trust: 0.89 },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const Card = ({ children, style, title, accent }) => (
  <div style={{ 
    background: T.white, 
    borderRadius: "16px", 
    border: `1px solid ${T.border}`, 
    boxShadow: T.shadow,
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    ...style 
  }}>
    {accent && <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px", background: accent }} />}
    {title && <h3 style={{ fontSize: "14px", fontWeight: 700, color: T.slate, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px", display: "flex", alignItems:"center", gap: "8px" }}>{title}</h3>}
    {children}
  </div>
);

const Badge = ({ children, variant = "neutral" }) => {
  const styles = {
    neutral: { bg: T.canvas, text: T.slate },
    success: { bg: "#ecfdf5", text: T.secondary },
    warning: { bg: "#fffbeb", text: T.accent },
    danger:  { bg: "#fef2f2", text: T.danger },
    info:    { bg: "#eff6ff", text: T.primary },
  }[variant];
  return (
    <span style={{ 
      padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
      background: styles.bg, color: styles.text, border: `1px solid ${styles.text}22` 
    }}>
      {children}
    </span>
  );
};

const USSDPhone = ({ content, onKey }) => (
  <div style={{ width: "280px", background: "#1e293b", borderRadius: "40px", padding: "12px", border: "8px solid #334155", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
    <div style={{ height: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "40px", height: "4px", background: "#334155", borderRadius: "2px" }} />
    </div>
    <div style={{ 
      background: "#d1fae5", height: "320px", borderRadius: "4px", padding: "16px", 
      fontFamily: "'Courier New', monospace", fontSize: "14px", color: "#064e3b", 
      lineHeight: "1.5", overflowY: "auto", border: "4px solid #059669" 
    }}>
      {content}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", padding: "20px 10px" }}>
      {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(k => (
        <button key={k} onClick={() => onKey(k)} style={{ 
          height: "40px", borderRadius: "50%", background: "#334155", color: "white", 
          border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold" 
        }}>{k}</button>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGES
// ─────────────────────────────────────────────────────────────────────────────

const Dashboard = ({ persona, setPersona }) => {
  const shap = MOCK_SHAP[persona.persona_id] || [];
  const peer = MOCK_PEERS[persona.persona_id];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "350px 1fr 300px", gap: "24px" }}>
      {/* Sidebar Profile */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Card title="Farmer Identity" accent={T.primary}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: T.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
              {persona.gender === "Male" ? "👨‍🌾" : "👩‍🌾"}
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 800 }}>{persona.farmer_name}</div>
              <div style={{ color: T.slate, fontSize: "13px" }}>{persona.country} • {persona.persona_id}</div>
            </div>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: T.slate }}>Decision Tier</span>
              <Badge variant={persona.decision_tier === "Gold" ? "warning" : "neutral"}>{persona.decision_tier}</Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: T.slate }}>Farm Size</span>
              <span style={{ fontWeight: 600 }}>{persona.farm_ha} HA</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: T.slate }}>Main Crop</span>
              <span style={{ fontWeight: 600 }}>{persona.crop}</span>
            </div>
          </div>
        </Card>

        <Card title="Graph Intelligence" accent={T.secondary}>
          {peer ? (
            <div>
              <div style={{ fontSize: "12px", color: T.slate, marginBottom: "8px" }}>PEER MATCH (Neo4j)</div>
              <div style={{ fontWeight: 700, color: T.ink }}>{peer.name}</div>
              <div style={{ fontSize: "13px", color: T.slate, marginBottom: "12px" }}>Group: {peer.shared_group}</div>
              <div style={{ padding: "10px", background: T.canvas, borderRadius: "8px", borderLeft: `4px solid ${T.secondary}` }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: T.secondary }}>PATHWAY</div>
                <div style={{ fontSize: "13px" }}>Moved {peer.prev_tier} → {peer.curr_tier} via USSD Logging</div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: T.slate, padding: "20px" }}>No direct peer matches in current cluster.</div>
          )}
        </Card>
      </div>

      {/* Main Explanations */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Card title="Credit Attribution (SHAP)" accent={T.accent}>
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: T.primary }}>0.742</span>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: T.slate }}>S_total HYBRID SCORE</div>
              <Badge variant="success">α = 0.65</Badge>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {shap.map(([fid, val]) => {
              const action = ACTION_MAP[fid] || { label: "Unknown Feature" };
              const width = Math.min(Math.abs(val) * 30, 100);
              return (
                <div key={fid}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                    <span style={{ fontWeight: 600 }}>{action.label}</span>
                    <span style={{ color: val > 0 ? T.secondary : T.danger, fontWeight: 700 }}>{val > 0 ? "+" : ""}{val}</span>
                  </div>
                  <div style={{ height: "8px", background: T.canvas, borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ 
                      width: `${width}%`, height: "100%", 
                      background: val > 0 ? T.secondary : T.danger,
                      borderRadius: "4px", transition: "width 1s ease-out" 
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        <Card title="Equity Diagnostic" accent={T.danger}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ padding: "12px", background: "#fef2f2", borderRadius: "12px" }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>⚖️</div>
              <div style={{ fontWeight: 700, fontSize: "13px", color: T.danger }}>Gender Bias Check</div>
              <div style={{ fontSize: "12px", color: T.slate }}>Rebalanced against {persona.gender === "Female" ? "Inaccessible Land Rights" : "No Bias"}</div>
            </div>
            <div style={{ padding: "12px", background: "#eff6ff", borderRadius: "12px" }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>🛠️</div>
              <div style={{ fontWeight: 700, fontSize: "13px", color: T.primary }}>Actionability</div>
              <div style={{ fontSize: "12px", color: T.slate }}>85% of drivers are within farmer's direct control.</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right - USSD Preview */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: T.slate }}>USSD INTERFACE</div>
        <USSDPhone 
          onKey={() => {}}
          content={`ClearPath Credit\nTier: ${persona.decision_tier}\nStatus: ${persona.credit_eligible === "True" ? "Eligible" : "Pending"}\n\n1. Log Harvest\n2. Soil Test\n3. Insurance\n4. Agent Help\n\n0. Exit`} 
        />
      </div>
    </div>
  );
};

const MasumiPipeline = ({ persona }) => {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState([]);
  
  const steps = [
    { id: "collect", title: "Collect-Agent-ClearPath", desc: "Retrieving graph context & features", icon: "📥" },
    { id: "score", title: "Score-Agent-ClearPath", desc: "Calculating SHAP & Repayment Prob", icon: "⚡" },
    { id: "translate", title: "Translate-Agent-ClearPath", desc: "Generating localized SMS nudge", icon: "🌍" }
  ];

  const runPipeline = () => {
    setStep(0);
    setLogs([]);
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        return;
      }
      setStep(prev => prev + 1);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Executing ${steps[currentStep].title}...`]);
      currentStep++;
    }, 1500);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
      <div>
        <h2 style={{ marginBottom: "24px" }}>Agentic Workflow (MASUMI)</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {steps.map((s, idx) => (
            <Card key={s.id} style={{ 
              opacity: step > idx ? 1 : 0.5,
              border: step === idx + 1 ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
              transform: step === idx + 1 ? "scale(1.02)" : "scale(1)",
              transition: "all 0.4s ease"
            }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ fontSize: "24px" }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{s.title}</div>
                  <div style={{ fontSize: "13px", color: T.slate }}>{s.desc}</div>
                </div>
                {step > idx && <Badge variant="success">COMPLETE</Badge>}
                {step === idx + 1 && <div className="pulse" style={{ width: "12px", height: "12px", background: T.primary, borderRadius: "50%" }} />}
              </div>
            </Card>
          ))}
        </div>
        <button onClick={runPipeline} style={{ 
          marginTop: "24px", width: "100%", padding: "16px", borderRadius: "12px", 
          background: T.primary, color: "white", fontWeight: 800, border: "none", cursor: "pointer" 
        }}>
          RUN MULTI-AGENT PIPELINE
        </button>
      </div>

      <Card title="Agent Audit Log" style={{ background: "#0f172a", color: "#38bdf8" }}>
        <div style={{ fontFamily: "monospace", fontSize: "13px", lineHeight: "1.6" }}>
          {logs.map((log, i) => <div key={i} style={{ marginBottom: "8px" }}>{`> ${log}`}</div>)}
          {step === 3 && (
            <div style={{ marginTop: "20px", color: "#4ade80", padding: "12px", border: "1px solid #4ade80", borderRadius: "8px" }}>
              <strong>Generated SMS:</strong><br/>
              "Hello {persona.farmer_name}, your neighbor in {MOCK_PEERS[persona.persona_id]?.shared_group || 'your group'} just reached Gold tier! Log your weeding today to boost your score."
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [route, setRoute] = useState("dashboard");
  const [selectedPersona, setSelectedPersona] = useState(MOCK_PERSONAS[0]);

  return (
    <div style={{ 
      fontFamily: T.font, minHeight: "100vh", background: T.canvas, color: T.ink,
      padding: "0 0 40px 0"
    }}>
      {/* Navigation */}
      <nav style={{ 
        background: T.white, borderBottom: `1px solid ${T.border}`, 
        padding: "0 40px", height: "72px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <div style={{ fontSize: "20px", fontWeight: 900, color: T.primary, letterSpacing: "-1px" }}>
            CLEARPATH<span style={{ color: T.accent }}>CREDIT</span>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { id: "dashboard", label: "MIS Dashboard", icon: "📊" },
              { id: "masumi", label: "Agent Pipeline", icon: "🤖" },
              { id: "stack", label: "Neo4j Graph", icon: "🕸️" },
            ].map(link => (
              <button 
                key={link.id}
                onClick={() => setRoute(link.id)}
                style={{ 
                  background: "none", border: "none", cursor: "pointer", 
                  fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px",
                  color: route === link.id ? T.primary : T.slate,
                  borderBottom: route === link.id ? `2px solid ${T.primary}` : "2px solid transparent",
                  padding: "24px 0"
                }}>
                <span>{link.icon}</span> {link.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: T.slate }}>Farmer Context:</span>
          <select 
            value={selectedPersona.persona_id}
            onChange={(e) => setSelectedPersona(MOCK_PERSONAS.find(p => p.persona_id === e.target.value))}
            style={{ 
              padding: "8px 12px", borderRadius: "8px", border: `1px solid ${T.border}`,
              background: T.canvas, fontWeight: 600, fontSize: "13px"
            }}>
            {MOCK_PERSONAS.map(p => <option key={p.persona_id} value={p.persona_id}>{p.farmer_name} ({p.decision_tier})</option>)}
          </select>
          <Badge variant="info">v2.4 Demo</Badge>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
        
        {route === "dashboard" && <Dashboard persona={selectedPersona} />}
        
        {route === "masumi" && <MasumiPipeline persona={selectedPersona} />}
        
        {route === "stack" && (
          <div style={{ textAlign: "center", padding: "100px" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🕸️</div>
            <h2>Neo4j AuraDB Integration</h2>
            <p style={{ color: T.slate, maxWidth: "500px", margin: "0 auto 24px" }}>
              Real-time cluster analysis active. Mapping social capital via MEMBER_OF and BUYS_FROM relationships to generate G(v) trust scores.
            </p>
            <Card accent={T.primary} style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
              <pre style={{ background: "#1e293b", color: "#94a3b8", padding: "20px", borderRadius: "8px", fontSize: "12px", overflowX: "auto" }}>
{`MATCH (f:Farmer {id: $id})-[:MEMBER_OF]->(group)<-[:MEMBER_OF]-(peer)
WHERE peer.tier > f.tier
RETURN peer.name, peer.action_taken
ORDER BY peer.trust_score DESC LIMIT 1`}
              </pre>
            </Card>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .pulse {
          box-shadow: 0 0 0 0 rgba(15, 128, 144, 0.7);
          animation: pulse-ring 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
        }
        @keyframes pulse-ring {
          to { box-shadow: 0 0 0 12px rgba(15, 128, 144, 0); }
        }
        body { margin: 0; }
      `}} />
    </div>
  );
}