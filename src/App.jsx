import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// ROUTER (hash-based, no react-router needed)
// ─────────────────────────────────────────────
function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace("#", "") || "/");
  useEffect(() => {
    const handler = () => setRoute(window.location.hash.replace("#", "") || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = (path) => { window.location.hash = path; };
  return { route, navigate };
}

// ─────────────────────────────────────────────
// MOCK DATA (full fallback — no API needed)
// ─────────────────────────────────────────────
const MOCK_PERSONAS = [
  { persona_id:"UG-BRONZE",   farmer_name:"Owino Moses",     gender:"Male",   country:"Uganda",       decision_tier:"Bronze", farm_ha:"0.8",  crop:"Maize",    credit_eligible:"False" },
  { persona_id:"UG-SILVER",   farmer_name:"Nakato Sarah",    gender:"Female", country:"Uganda",       decision_tier:"Silver", farm_ha:"3.5",  crop:"Maize",    credit_eligible:"False" },
  { persona_id:"UG-GOLD",     farmer_name:"Ssemakula John",  gender:"Male",   country:"Uganda",       decision_tier:"Gold",   farm_ha:"18",   crop:"Maize",    credit_eligible:"True"  },
  { persona_id:"SA-BRONZE",   farmer_name:"Thabo Mokoena",   gender:"Male",   country:"South Africa", decision_tier:"Bronze", farm_ha:"2.5",  crop:"Pine",     credit_eligible:"False" },
  { persona_id:"SA-SILVER",   farmer_name:"Nomsa Dlamini",   gender:"Female", country:"South Africa", decision_tier:"Silver", farm_ha:"9",    crop:"Eucalyptus",credit_eligible:"True" },
  { persona_id:"SA-GOLD",     farmer_name:"Pieter van Zyl",  gender:"Male",   country:"South Africa", decision_tier:"Gold",   farm_ha:"52",   crop:"Pine",     credit_eligible:"True"  },
  { persona_id:"ZW-BRONZE",   farmer_name:"Chanda Ncube",    gender:"Male",   country:"Zimbabwe",     decision_tier:"Bronze", farm_ha:"1.2",  crop:"Maize",    credit_eligible:"False" },
  { persona_id:"ZW-SILVER",   farmer_name:"Tariro Moyo",     gender:"Female", country:"Zimbabwe",     decision_tier:"Silver", farm_ha:"5.8",  crop:"Tobacco",  credit_eligible:"True"  },
  { persona_id:"ZW-GOLD",     farmer_name:"Farai Mutasa",    gender:"Male",   country:"Zimbabwe",     decision_tier:"Gold",   farm_ha:"120",  crop:"Tobacco",  credit_eligible:"True"  },
  { persona_id:"UG-BRONZE-F", farmer_name:"Achieng Grace",   gender:"Female", country:"Uganda",       decision_tier:"Bronze", farm_ha:"0.5",  crop:"Maize",    credit_eligible:"False" },
  { persona_id:"UG-GOLD-F",   farmer_name:"Nambi Florence",  gender:"Female", country:"Uganda",       decision_tier:"Gold",   farm_ha:"8",    crop:"Maize",    credit_eligible:"True"  },
  { persona_id:"SA-BRONZE-F", farmer_name:"Thandiwe Nkosi",  gender:"Female", country:"South Africa", decision_tier:"Bronze", farm_ha:"1.5",  crop:"Pine",     credit_eligible:"False" },
  { persona_id:"SA-GOLD-F",   farmer_name:"Lindiwe Mbeki",   gender:"Female", country:"South Africa", decision_tier:"Gold",   farm_ha:"30",   crop:"Eucalyptus",credit_eligible:"True" },
  { persona_id:"ZW-BRONZE-F", farmer_name:"Rudo Chirwa",     gender:"Female", country:"Zimbabwe",     decision_tier:"Bronze", farm_ha:"0.8",  crop:"Maize",    credit_eligible:"False" },
  { persona_id:"ZW-GOLD-F",   farmer_name:"Tsitsi Mapfumo",  gender:"Female", country:"Zimbabwe",     decision_tier:"Gold",   farm_ha:"80",   crop:"Tobacco",  credit_eligible:"True"  },
];

const MOCK_SHAP = {
  "UG-BRONZE":   [["f_023",-1.37],["f_024",-1.15],["f_032",-0.94],["f_031",-0.62],["f_021",-0.38],["f_029",-0.29],["f_033",-0.28]],
  "UG-SILVER":   [["f_023",0.56],["f_032",0.49],["f_030",0.48],["f_029",0.46],["f_031",0.40],["f_024",0.38],["f_033",0.28]],
  "UG-GOLD":     [["f_023",1.18],["f_024",1.15],["f_032",1.11],["f_031",0.92],["f_033",0.89],["f_030",0.83],["f_029",0.77]],
  "SA-BRONZE":   [["f_033",-1.56],["f_029",-1.53],["f_030",-1.51],["f_031",-1.48],["f_032",-1.45],["f_024",-1.40],["f_023",-1.37]],
  "SA-SILVER":   [["f_032",0.49],["f_023",0.41],["f_031",0.40],["f_030",0.37],["f_029",0.36],["f_024",0.28],["f_033",0.28]],
  "SA-GOLD":     [["f_023",1.18],["f_024",1.15],["f_032",1.11],["f_033",0.99],["f_031",0.92],["f_030",0.83],["f_029",0.77]],
  "ZW-BRONZE":   [["f_032",-1.45],["f_024",-1.40],["f_023",-1.37],["f_031",-1.13],["f_030",-1.11],["f_033",-1.05],["f_029",-1.02]],
  "ZW-SILVER":   [["f_023",0.46],["f_030",0.43],["f_029",0.41],["f_032",0.39],["f_024",0.33],["f_031",0.30],["f_021",0.18]],
  "ZW-GOLD":     [["f_023",1.18],["f_024",1.15],["f_032",1.11],["f_033",0.99],["f_031",0.92],["f_030",0.83],["f_029",0.77]],
  "UG-BRONZE-F": [["f_023",-1.37],["f_032",-1.04],["f_024",-1.00],["f_031",-0.72],["f_030",-0.60],["f_033",-0.54],["f_029",-0.51]],
  "UG-GOLD-F":   [["f_023",1.07],["f_024",1.04],["f_032",0.85],["f_031",0.81],["f_033",0.79],["f_030",0.68],["f_029",0.67]],
  "SA-BRONZE-F": [["f_033",-1.56],["f_029",-1.53],["f_030",-1.51],["f_031",-1.48],["f_032",-1.45],["f_024",-1.40],["f_023",-1.37]],
  "SA-GOLD-F":   [["f_024",1.10],["f_023",1.07],["f_032",0.95],["f_033",0.89],["f_031",0.86],["f_030",0.73],["f_029",0.72]],
  "ZW-BRONZE-F": [["f_023",-1.37],["f_024",-1.25],["f_032",-1.19],["f_033",-1.05],["f_031",-1.02],["f_030",-0.95],["f_029",-0.86]],
  "ZW-GOLD-F":   [["f_023",1.13],["f_024",1.04],["f_032",1.00],["f_033",0.94],["f_031",0.92],["f_030",0.78],["f_029",0.77]],
};

const ACTION_MAP = {
  f_023: { label:"Log irrigation",    action_en:"Water your crops and log each irrigation via USSD. This keeps your crop record current.", action_lug:"Fizira ebirime byo era owandiike buli lw'okufukirira ku USSD.", action_zul:"Thelela izitshalo zakho futhi ubhale ukunisela nge-USSD.", action_sna:"Diridza zvirimwa zvenyu uye munyore paUSSD.", impact:"high",   controlled_by:"farmer",    gender_accessible:true  },
  f_024: { label:"Report crop health", action_en:"Check your crop health and report via USSD. This supports a stronger credit record.", action_lug:"Kebera obulamu bw'ebirime byo era oloope ku USSD.", action_zul:"Hlola impilo yezitshalo zakho ubike nge-USSD.", action_sna:"Tarisai hutano hwezvirimwa zvenyu muripote neUSSD.", impact:"high",   controlled_by:"farmer",    gender_accessible:true  },
  f_029: { label:"Record harvest",     action_en:"Record your harvest via USSD. Even a small harvest helps verify your season.", action_lug:"Wandiika amakungula go ku USSD. N'amakungula amatono gagasa.", action_zul:"Bhala isivuno sakho nge-USSD. Ngisho nesivuno esincane sikusiza.", action_sna:"Nyorai goho renyu paUSSD. Kunyangwe goho diki rinokubatsirai.", impact:"high",   controlled_by:"farmer",    gender_accessible:true  },
  f_030: { label:"Log weeding",        action_en:"Weed your field this week and log it via USSD. This strengthens your crop record.", action_lug:"Palira ennimiro yo mu wiiki eno era ogiwaandiike ku USSD.", action_zul:"Hlakula insimu yakho kuleli viki bese uyibhala nge-USSD.", action_sna:"Sakurai munda wenyu svondo rino uye munyore paUSSD.", impact:"medium", controlled_by:"farmer",    gender_accessible:true  },
  f_031: { label:"Pest check",         action_en:"Check your crops for pests this week. Report any infestation via USSD.", action_lug:"Kebera ebirime byo ku biwuka mu wiiki eno. Loopa ku USSD.", action_zul:"Hlola izitshalo zakho ngezinambuzane kuleli viki. Bika nge-USSD.", action_sna:"Tarisai zvirimwa zvenyu kuti mune zvipembenene. Ripotai neUSSD.", impact:"high",   controlled_by:"farmer",    gender_accessible:true  },
  f_032: { label:"Soil test",          action_en:"Book a soil test via your agent this week. This can improve your next credit decision.", action_lug:"Tegeera omukutu wo okukebera ettaka mu wiiki eno.", action_zul:"Bhukha ukuhlolwa kwenhlabathi ngo-ejenti wakho kuleli viki.", action_sna:"Bhukirai bvunzo yevhu kuburikidza neejenti yenyu svondo rino.", impact:"high",   controlled_by:"farmer",    gender_accessible:true  },
  f_033: { label:"Enroll insurance",   action_en:"Enroll in crop insurance via your agent. Insurance protects your season and improves access.", action_lug:"Wandiikibwa mu nshulansi y'ebirime ku mukutu wo.", action_zul:"Bhalisela umshwalense wezitshalo ngo-ejenti wakho.", action_sna:"Nyoresai inishuwarenzi yezvirimwa kuburikidza neejenti yenyu.", impact:"high",   controlled_by:"agent",     gender_accessible:true  },
  f_021: { label:"Approve crop plan",  action_en:"Approve the crop plan suggested by your agent. Reply YES on USSD when prompted.", action_lug:"Kkiriza enteekateeka y'ebirime omukutu wo gy'akuwadde.", action_zul:"Yamukela uhlelo lwezitshalo olunconywe wu-ejenti wakho.", action_sna:"Bvumirai purani yezvirimwa yakarongwa neejenti yenyu.", impact:"medium", controlled_by:"farmer",    gender_accessible:true  },
  f_009: { label:"Ask about fencing",  action_en:"Repair or install fencing around your plot. Ask your agent about group fencing options.", action_lug:"Ddamu olukomera lw'omu nnimiro yo.", action_zul:"Lungisa noma ufake uthango.", action_sna:"Gadzirai kana isai ruzhowa.", impact:"high",   controlled_by:"household", gender_accessible:false },
  f_039: { label:"Land documentation", action_en:"Obtain formal documentation for your land. This strengthens your credit profile.", action_lug:"Funa ebiwandiiko by'ettaka lyo eby'amateeka.", action_zul:"Thola imibhalo esemthethweni yomhlaba wakho.", action_sna:"Wanai magwaro anotsigira kodzero yenyu yenyika.", impact:"low",    controlled_by:"external",  gender_accessible:false },
  x_001: { label:"Request agent visit",action_en:"Request an agent visit. Your agent can help with soil tests, insurance, and next steps.", action_lug:"Saba omukutu wo ajje. Ayinza okukuyamba n'okukebera ettaka.", action_zul:"Cela ukuvakashelwa yi-ejenti. Ingakusiza ngokuhlolwa kwenhlabathi.", action_sna:"Kumbirai kushanyirwa neejenti. Vanogona kukubatsira nekuongororwa kwevhu.", impact:"medium", controlled_by:"farmer",    gender_accessible:true  },
};

// Mock Neo4j peer data keyed by persona
const MOCK_PEERS = {
  "UG-BRONZE":   { name:"Grace Achieng",   shared_group:"Masaka Farmers SACCO",      prev_tier:"Bronze", curr_tier:"Silver", key_action:"logged 3 consecutive harvests via USSD",      trust_score:0.74 },
  "UG-BRONZE-F": { name:"Nambi Florence",  shared_group:"Masaka Farmers SACCO",      prev_tier:"Bronze", curr_tier:"Gold",   key_action:"completed soil test and enrolled insurance",   trust_score:0.81 },
  "SA-BRONZE":   { name:"Nomsa Dlamini",   shared_group:"Limpopo Input Cooperative", prev_tier:"Bronze", curr_tier:"Silver", key_action:"recorded harvest and logged crop health weekly", trust_score:0.69 },
  "SA-BRONZE-F": { name:"Lindiwe Mbeki",   shared_group:"Limpopo Input Cooperative", prev_tier:"Bronze", curr_tier:"Gold",   key_action:"enrolled insurance and approved crop plan",    trust_score:0.88 },
  "ZW-BRONZE":   { name:"Tariro Moyo",     shared_group:"Jinja Input Cooperative",   prev_tier:"Bronze", curr_tier:"Silver", key_action:"logged irrigation every week for 2 months",    trust_score:0.72 },
  "ZW-BRONZE-F": { name:"Tsitsi Mapfumo",  shared_group:"Jinja Input Cooperative",   prev_tier:"Bronze", curr_tier:"Gold",   key_action:"logged pest checks and crop health reports",   trust_score:0.85 },
};

// Mock Cypher query results
const MOCK_CYPHER = `MATCH (f:Farmer {id: $personaId})-[:MEMBER_OF|BUYS_FROM]->(shared)
      <-[:MEMBER_OF|BUYS_FROM]-(peer:Farmer)
WHERE peer.current_tier > peer.prev_tier
  AND peer.id <> f.id
WITH peer, count(shared) AS sharedLinks,
     avg(peer.repayment_score) AS peerTrust
RETURN peer.name        AS name,
       peer.prev_tier   AS prevTier,
       peer.current_tier AS currTier,
       peer.key_action  AS keyAction,
       shared.name      AS sharedContext,
       sharedLinks * peerTrust AS G_v
ORDER BY G_v DESC LIMIT 1`;

// ─────────────────────────────────────────────
// CORE LOGIC
// ─────────────────────────────────────────────
function getActionText(fid, lang) {
  const a = ACTION_MAP[fid];
  if (!a) return ACTION_MAP.x_001.action_en;
  return a[`action_${lang}`] || a.action_en;
}

function rankActions(personaId, gender) {
  const rows = MOCK_SHAP[personaId] || [];
  return rows
    .map(([fid, shap]) => {
      const action = ACTION_MAP[fid] || ACTION_MAP.x_001;
      const gPenalty = gender === "Female" && !action.gender_accessible ? 10 : 0;
      const posPenalty = shap > 0 ? 0 : 3;
      return { fid, shap, action, sortKey: gPenalty + posPenalty - Math.abs(shap) };
    })
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, 3);
}

function computeScore(personaId) {
  const rows = MOCK_SHAP[personaId] || [];
  const mx = rows.reduce((s, [, v]) => s + Math.abs(v), 0) / (rows.length || 1);
  const peer = MOCK_PEERS[personaId];
  const gv = peer ? peer.trust_score : 0.5;
  const alpha = 0.65;
  return { mx: mx.toFixed(3), gv: gv.toFixed(3), stotal: (alpha * mx + (1 - alpha) * gv).toFixed(3), alpha };
}

function buildSMS(persona, lang, peer) {
  const ranked = rankActions(persona.persona_id, persona.gender);
  const topAction = ranked[0] ? getActionText(ranked[0].fid, lang) : getActionText("x_001", lang);
  const peerLine = peer ? `${peer.name} in your group went ${peer.prev_tier}→${peer.curr_tier} by ${peer.key_action}. ` : "";
  const raw = `${peerLine}Next: ${topAction}`;
  return raw.length <= 160 ? raw : raw.slice(0, 157) + "...";
}

function buildUSSD(persona, view, detailIdx, lang) {
  const ranked = rankActions(persona.persona_id, persona.gender);
  const eligible = persona.credit_eligible === "True" ? "Eligible" : "Not eligible";
  if (view === "main") {
    const lines = [`eSusFarm ${persona.decision_tier} | ${eligible}`];
    ranked.forEach((r, i) => {
      const label = r.action.label || "Take action";
      lines.push(`${i + 1}. ${label.slice(0, 28)}`);
    });
    lines.push("4. Agent visit", "5. Contest", "0. Exit");
    return lines.join("\n");
  }
  if (view === "learn") {
    const r = ranked[detailIdx] || ranked[0];
    if (!r) return "No action available.\n0. Back";
    const text = getActionText(r.fid, lang);
    return `Learn more\n${text.slice(0, 120)}\nControl: ${r.action.controlled_by}\nImpact: ${r.action.impact}\n0. Back`;
  }
  if (view === "agent") return `Agent visit\n${persona.farmer_name}\nVisit requested.\n0. Back`;
  if (view === "contest") return `Contest\n${persona.decision_tier} review\nAsk agent to review your record.\n0. Back`;
  return "";
}

function auditEquity(personas) {
  return personas.map(p => {
    const ranked = rankActions(p.persona_id, p.gender);
    const inaccessible = ranked.filter(r => !r.action.gender_accessible);
    const rebalanced = p.gender === "Female" && inaccessible.length > 0;
    return { ...p, rebalanced, inaccessibleCount: inaccessible.length, totalRecommended: ranked.length };
  });
}

// ─────────────────────────────────────────────
// MASUMI MOCK PIPELINE
// ─────────────────────────────────────────────
async function runMasumiPipeline(persona, peer, lang, onStatus) {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const agents = ["collect-agent-clearpath", "score-agent-clearpath", "translate-agent-clearpath"];

  onStatus(agents[0], "queued", null);
  await delay(500);
  onStatus(agents[0], "running", null);
  await delay(800);
  onStatus(agents[0], "completed", { persona_id: persona.persona_id, shap_rows: MOCK_SHAP[persona.persona_id]?.length });

  onStatus(agents[1], "queued", null);
  await delay(400);
  onStatus(agents[1], "running", null);
  await delay(900);
  const score = computeScore(persona.persona_id);
  onStatus(agents[1], "completed", { tier: persona.decision_tier, s_total: score.stotal, top_driver: rankActions(persona.persona_id, persona.gender)[0]?.fid });

  onStatus(agents[2], "queued", null);
  await delay(300);
  onStatus(agents[2], "running", null);
  await delay(1200);
  const sms = buildSMS(persona, lang, peer);
  onStatus(agents[2], "completed", { sms, chars: sms.length, language: lang });

  return sms;
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const T = {
  ink:     "#172033",
  muted:   "#5f6b7c",
  line:    "#d9e1ea",
  surface: "#f6f8fb",
  panel:   "#ffffff",
  green:   "#177245",
  teal:    "#0f8090",
  amber:   "#a45d00",
  blue:    "#2456a6",
  red:     "#b42318",
  gold:    "#c8960c",
  shadow:  "0 12px 30px rgba(23,32,51,0.08)",
};

// ─────────────────────────────────────────────
// SHARED UI ATOMS
// ─────────────────────────────────────────────
function Badge({ children, variant = "muted" }) {
  const colors = {
    ok:   { bg:"rgba(23,114,69,0.08)",  border:"rgba(23,114,69,0.3)",   color:T.green },
    warn: { bg:"rgba(164,93,0,0.08)",   border:"rgba(164,93,0,0.35)",   color:T.amber },
    fail: { bg:"rgba(180,35,24,0.08)",  border:"rgba(180,35,24,0.3)",   color:T.red   },
    blue: { bg:"rgba(36,86,166,0.08)",  border:"rgba(36,86,166,0.3)",   color:T.blue  },
    muted:{ bg:"#f2f5f8",              border:T.line,                  color:T.muted },
  };
  const c = colors[variant] || colors.muted;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 9px", borderRadius:8,
      border:`1px solid ${c.border}`, background:c.bg, color:c.color,
      fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

function Panel({ children, style = {} }) {
  return (
    <div style={{ padding:16, border:`1px solid ${T.line}`, borderRadius:8,
      background:T.panel, boxShadow:T.shadow, ...style }}>
      {children}
    </div>
  );
}

function PanelHead({ title, badge }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
      <h2 style={{ margin:0, fontSize:15, fontWeight:700, color:T.ink }}>{title}</h2>
      {badge}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style = {} }) {
  const styles = {
    primary:   { background:T.blue,   color:"#fff", border:`1px solid ${T.blue}`  },
    secondary: { background:"rgba(36,86,166,0.06)", color:T.blue, border:"1px solid rgba(36,86,166,0.35)" },
    danger:    { background:"rgba(180,35,24,0.08)", color:T.red,  border:"1px solid rgba(180,35,24,0.3)" },
    ghost:     { background:"#f7fafc", color:T.ink, border:`1px solid #c5cfdb` },
  };
  return (
    <button onClick={onClick} style={{ minHeight:38, padding:"0 14px", borderRadius:6,
      cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit",
      ...styles[variant], ...style }}>
      {children}
    </button>
  );
}

function TierBadge({ tier }) {
  const v = tier === "Gold" ? "warn" : tier === "Silver" ? "blue" : tier === "Bronze" ? "muted" : "muted";
  return <Badge variant={v}>{tier}</Badge>;
}

function SHAPBar({ value, max = 1.5 }) {
  const pct = Math.min(Math.abs(value) / max * 100, 100);
  const col = value >= 0 ? T.green : T.red;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:8, borderRadius:4, background:T.line, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:col, borderRadius:4, transition:"width 0.4s" }} />
      </div>
      <span style={{ fontSize:11, color:T.muted, minWidth:40, textAlign:"right" }}>{value.toFixed(3)}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────
function Nav({ route, navigate }) {
  const links = [
    { path:"/Neo4J-Implementation", label:"Simulator" },
    { path:"/Neo4J-Stack",          label:"Neo4j Stack" },
    { path:"/MASUMI",               label:"Masumi Pipeline" },
  ];
  return (
    <nav style={{ background:T.ink, padding:"0 24px", display:"flex", alignItems:"center",
      gap:0, boxShadow:"0 2px 12px rgba(0,0,0,0.18)", position:"sticky", top:0, zIndex:100 }}>
      <div style={{ color:"#fff", fontWeight:800, fontSize:15, letterSpacing:"-0.3px",
        padding:"14px 24px 14px 0", borderRight:`1px solid rgba(255,255,255,0.1)`, marginRight:16 }}>
        ClearPath <span style={{ color:T.teal }}>Credit</span>
      </div>
      {links.map(l => (
        <a key={l.path} href={`#${l.path}`}
          style={{ padding:"16px 16px", color: route === l.path ? T.teal : "rgba(255,255,255,0.65)",
            textDecoration:"none", fontSize:13, fontWeight:700,
            borderBottom: route === l.path ? `2px solid ${T.teal}` : "2px solid transparent",
            transition:"color 0.2s" }}>
          {l.label}
        </a>
      ))}
      <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
        <Badge variant="ok">Mock Mode</Badge>
        <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>eSusFarm · AgriFin 2025</span>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// PAGE: IMPLEMENTATION (MIS DASHBOARD)
// ─────────────────────────────────────────────
function ImplementationPage() {
  const [personaId, setPersonaId] = useState("UG-BRONZE");
  const [lang, setLang] = useState("en");
  const [ussdView, setUssdView] = useState("main");
  const [detailIdx, setDetailIdx] = useState(0);
  const [smsText, setSmsText] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  const persona = MOCK_PERSONAS.find(p => p.persona_id === personaId) || MOCK_PERSONAS[0];
  const ranked  = rankActions(personaId, persona.gender);
  const peer    = MOCK_PEERS[personaId] || null;
  const score   = computeScore(personaId);
  const equity  = auditEquity(MOCK_PERSONAS);
  const thisEquity = equity.find(e => e.persona_id === personaId);
  const ussd    = buildUSSD(persona, ussdView, detailIdx, lang);
  const ussdLen = ussd.length;

  const FEATHERLESS_KEY = typeof window !== "undefined" && window.__FEATHERLESS_KEY__;

  const generateSMS = useCallback(async () => {
    const fallback = buildSMS(persona, lang, peer);
    if (!FEATHERLESS_KEY) { setSmsText(fallback); setAiUsed(false); return; }
    setAiLoading(true);
    try {
      const prompt = `Write one SMS under 160 characters in language code "${lang}" for farmer ${persona.farmer_name}.
Tier: ${persona.decision_tier}. Country: ${persona.country}.
${peer ? `Peer ${peer.name} in her group moved ${peer.prev_tier}→${peer.curr_tier} by: ${peer.key_action}.` : ""}
Top action: ${ranked[0] ? getActionText(ranked[0].fid, lang) : "Request agent visit."}
Plain language. Warm tone. No jargon. Under 160 characters. Return ONLY the SMS text.`;
      const res = await fetch("https://api.featherless.ai/v1/chat/completions", {
        method:"POST",
        headers:{ Authorization:`Bearer ${FEATHERLESS_KEY}`, "Content-Type":"application/json" },
        body: JSON.stringify({ model:"Qwen/Qwen2.5-72B-Instruct", messages:[{ role:"user", content:prompt }], max_tokens:80 }),
      });
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim() || fallback;
      setSmsText(text.slice(0, 160));
      setAiUsed(true);
    } catch { setSmsText(fallback); setAiUsed(false); }
    finally { setAiLoading(false); }
  }, [persona, lang, peer, ranked, FEATHERLESS_KEY]);

  useEffect(() => { generateSMS(); }, [personaId, lang]);

  const copySMS = async () => {
    await navigator.clipboard.writeText(smsText).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1400);
  };

  const keypad = (reply) => {
    if (reply === "0") { setUssdView("main"); return; }
    if (reply === "4") { setUssdView("agent"); return; }
    if (reply === "5") { setUssdView("contest"); return; }
    const idx = parseInt(reply) - 1;
    if (idx >= 0 && idx < ranked.length) { setDetailIdx(idx); setUssdView("learn"); }
  };

  const tierColor = persona.decision_tier === "Gold" ? T.gold : persona.decision_tier === "Silver" ? T.blue : T.muted;

  return (
    <div style={{ maxWidth:1240, margin:"0 auto", padding:"24px 20px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <p style={{ margin:"0 0 4px", color:T.green, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>
          eSusFarm · Explainability Simulator
        </p>
        <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:T.ink }}>MIS Dashboard</h1>
        <p style={{ margin:"6px 0 0", color:T.muted, fontSize:14 }}>
          Lender view · SHAP attribution · Gender equity · USSD preview · SMS generation
        </p>
      </div>

      {/* Controls */}
      <Panel style={{ marginBottom:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 160px 160px auto auto", gap:12, alignItems:"end" }}>
          <label style={{ display:"grid", gap:5, fontSize:12, fontWeight:700, color:T.muted }}>
            Farmer Persona
            <select value={personaId} onChange={e => { setPersonaId(e.target.value); setUssdView("main"); }}
              style={{ minHeight:38, padding:"0 10px", border:`1px solid #bfc9d6`, borderRadius:6, fontSize:13, color:T.ink }}>
              {MOCK_PERSONAS.map(p => (
                <option key={p.persona_id} value={p.persona_id}>
                  {p.persona_id} — {p.farmer_name} ({p.gender}, {p.decision_tier})
                </option>
              ))}
            </select>
          </label>
          <label style={{ display:"grid", gap:5, fontSize:12, fontWeight:700, color:T.muted }}>
            Language
            <select value={lang} onChange={e => setLang(e.target.value)}
              style={{ minHeight:38, padding:"0 10px", border:`1px solid #bfc9d6`, borderRadius:6, fontSize:13, color:T.ink }}>
              <option value="en">English</option>
              <option value="lug">Luganda</option>
              <option value="zul">isiZulu</option>
              <option value="sna">Shona</option>
            </select>
          </label>
          <label style={{ display:"grid", gap:5, fontSize:12, fontWeight:700, color:T.muted }}>
            USSD View
            <select value={ussdView} onChange={e => setUssdView(e.target.value)}
              style={{ minHeight:38, padding:"0 10px", border:`1px solid #bfc9d6`, borderRadius:6, fontSize:13, color:T.ink }}>
              <option value="main">Main menu</option>
              <option value="learn">Learn more</option>
              <option value="agent">Agent visit</option>
              <option value="contest">Contest</option>
            </select>
          </label>
          <Btn onClick={generateSMS}>{aiLoading ? "Generating…" : "Regenerate SMS"}</Btn>
          <Badge variant={aiUsed ? "ok" : "muted"}>{aiUsed ? "AI · Featherless" : "Mock fallback"}</Badge>
        </div>
      </Panel>

      {/* Metric strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:16 }}>
        {[
          { label:"Tier",       value: persona.decision_tier,   color: tierColor },
          { label:"S_total",    value: score.stotal,            color: T.teal    },
          { label:"M(x) XGBoost",value:score.mx,               color: T.blue    },
          { label:"G(v) Neo4j", value: score.gv,               color: T.green   },
          { label:"α weight",   value: score.alpha,            color: T.amber   },
        ].map(m => (
          <Panel key={m.label} style={{ textAlign:"center", padding:"14px 12px" }}>
            <div style={{ fontSize:22, fontWeight:800, color:m.color, letterSpacing:"-0.5px" }}>{m.value}</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:4, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>{m.label}</div>
          </Panel>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1.1fr", gap:16 }}>

        {/* Persona profile */}
        <Panel>
          <PanelHead title="Farmer Profile" badge={<TierBadge tier={persona.decision_tier} />} />
          <dl style={{ display:"grid", gridTemplateColumns:"max-content 1fr", columnGap:14, rowGap:9, margin:0 }}>
            {[
              ["Name",    persona.farmer_name],
              ["Gender",  persona.gender],
              ["Country", persona.country],
              ["Crop",    persona.crop],
              ["Farm ha", persona.farm_ha],
              ["Credit",  persona.credit_eligible === "True" ? "Eligible" : "Not eligible"],
            ].map(([k, v]) => (
              <>
                <dt key={`k-${k}`} style={{ color:T.muted, fontSize:13, fontWeight:700 }}>{k}</dt>
                <dd key={`v-${k}`} style={{ margin:0, fontSize:13, color:T.ink }}>{v}</dd>
              </>
            ))}
          </dl>
          {peer && (
            <div style={{ marginTop:16, padding:12, background:"rgba(23,114,69,0.06)",
              border:`1px solid rgba(23,114,69,0.2)`, borderRadius:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.green, textTransform:"uppercase", marginBottom:6 }}>
                Neo4j Peer Match
              </div>
              <div style={{ fontSize:13, color:T.ink, lineHeight:1.4 }}>
                <strong>{peer.name}</strong> · {peer.shared_group}<br/>
                <span style={{ color:T.muted }}>{peer.prev_tier} → {peer.curr_tier}</span><br/>
                <span style={{ fontSize:12, color:T.muted }}>"{peer.key_action}"</span>
              </div>
              <div style={{ marginTop:6, fontSize:11, color:T.muted }}>
                G(v) trust score: <strong style={{ color:T.green }}>{peer.trust_score}</strong>
              </div>
            </div>
          )}
        </Panel>

        {/* SHAP signals */}
        <Panel>
          <PanelHead title="SHAP Drivers" badge={<Badge variant="blue">Top {ranked.length}</Badge>} />
          <div style={{ display:"grid", gap:12 }}>
            {ranked.map((r, i) => (
              <div key={r.fid} style={{ padding:10, border:`1px solid #e3e9f0`, borderRadius:6, background:"#fafcff" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={{ color:T.blue, fontWeight:800, fontSize:12 }}>{r.fid}</span>
                  <span style={{ fontSize:11, color:T.muted }}>{r.action.impact} impact</span>
                  {!r.action.gender_accessible && persona.gender === "Female" &&
                    <Badge variant="warn">Rebalanced</Badge>}
                </div>
                <div style={{ fontSize:12, color:T.ink, marginBottom:6, lineHeight:1.3 }}>
                  {r.action.label}
                </div>
                <SHAPBar value={r.shap} />
              </div>
            ))}
          </div>
        </Panel>

        {/* USSD phone — spans 2 rows */}
        <div style={{ gridRow:"span 2" }}>
          <Panel style={{ height:"100%" }}>
            <PanelHead title="USSD Screen"
              badge={<Badge variant={ussdLen <= 182 ? "ok" : "fail"}>{ussdLen} / 182</Badge>} />
            <pre style={{ margin:0, padding:18, borderRadius:8, background:"#101820",
              color:"#e9fff2", fontFamily:'"Courier New", monospace', fontSize:16,
              lineHeight:1.42, whiteSpace:"pre-wrap", overflowWrap:"anywhere", minHeight:240 }}>
              {ussd}
            </pre>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6, marginTop:10 }}>
              {["1","2","3","4","5","0"].map(k => (
                <button key={k} onClick={() => keypad(k)}
                  style={{ minHeight:40, border:`1px solid #c5cfdb`, borderRadius:6,
                    background:"#f7fafc", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit" }}>
                  {k}
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* SMS */}
        <Panel>
          <PanelHead title="SMS Output"
            badge={<Badge variant={smsText.length <= 160 ? "ok" : "fail"}>{smsText.length} / 160</Badge>} />
          <div style={{ minHeight:80, padding:14, border:`1px solid #d3dce8`, borderRadius:8,
            background:"#f9fbfe", color:T.ink, lineHeight:1.5, fontSize:13, marginBottom:10 }}>
            {aiLoading ? <span style={{ color:T.muted }}>Generating…</span> : smsText}
          </div>
          <Btn variant="secondary" onClick={copySMS} style={{ width:"100%" }}>
            {copied ? "Copied ✓" : "Copy SMS"}
          </Btn>
        </Panel>

        {/* Gender equity */}
        <Panel style={{ gridColumn:"span 2" }}>
          <PanelHead title="Gender-Equity Diagnostic"
            badge={<Badge variant={thisEquity?.rebalanced ? "warn" : "ok"}>
              {thisEquity?.rebalanced ? "Rebalanced" : "Clear"}
            </Badge>} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <div style={{ padding:12, border:`1px solid #e3e9f0`, borderRadius:6, background:"#fbfcfe" }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:6 }}>Actionability</div>
              <p style={{ margin:0, color:T.muted, fontSize:13, lineHeight:1.4 }}>
                {(thisEquity?.totalRecommended || 0) - (thisEquity?.inaccessibleCount || 0)} of {thisEquity?.totalRecommended || 0} actions
                are directly accessible for this persona.
              </p>
            </div>
            <div style={{ padding:12, border:`1px solid #e3e9f0`, borderRadius:6, background:"#fbfcfe" }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:6 }}>Fleet Audit</div>
              <p style={{ margin:0, color:T.muted, fontSize:13, lineHeight:1.4 }}>
                {equity.filter(e => e.rebalanced).length} of {equity.filter(e => e.gender === "Female").length} women
                farmers had recommendations rebalanced away from inaccessible actions.
              </p>
            </div>
            <div style={{ padding:12, border:`1px solid #e3e9f0`, borderRadius:6, background:"#fbfcfe" }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:6 }}>Peer Context</div>
              <p style={{ margin:0, color:T.muted, fontSize:13, lineHeight:1.4 }}>
                {peer ? `Neo4j matched ${peer.name} via shared group. G(v) = ${peer.trust_score}.` : "No peer match found for this persona."}
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE: NEO4J STACK
// ─────────────────────────────────────────────
function Neo4jStackPage() {
  const [selectedId, setSelectedId] = useState("UG-BRONZE");
  const [queryResult, setQueryResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("graph");

  const persona = MOCK_PERSONAS.find(p => p.persona_id === selectedId);
  const peer    = MOCK_PEERS[selectedId];
  const score   = computeScore(selectedId);

  const runQuery = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 1100));
    setQueryResult(peer ? {
      name: peer.name,
      prevTier: peer.prev_tier,
      currTier: peer.curr_tier,
      keyAction: peer.key_action,
      sharedContext: peer.shared_group,
      G_v: peer.trust_score,
    } : null);
    setRunning(false);
  };

  const nodes = [
    { id:"farmer", label: persona?.farmer_name || "Farmer", x:200, y:160, color:T.blue    },
    { id:"group",  label: peer?.shared_group || "SACCO",    x:400, y:80,  color:T.green   },
    { id:"peer",   label: peer?.name || "Peer",             x:400, y:240, color:T.teal    },
    { id:"dealer", label: "AgriSupply",                     x:600, y:160, color:T.amber   },
  ];
  const edges = [
    { from:"farmer", to:"group",  label:"MEMBER_OF"  },
    { from:"peer",   to:"group",  label:"MEMBER_OF"  },
    { from:"farmer", to:"dealer", label:"BUYS_FROM"  },
    { from:"peer",   to:"dealer", label:"BUYS_FROM"  },
  ];

  const nodePos = Object.fromEntries(nodes.map(n => [n.id, { x:n.x, y:n.y }]));

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 20px 40px" }}>
      <p style={{ margin:"0 0 4px", color:T.green, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Neo4j Technical Proof</p>
      <h1 style={{ margin:"0 0 6px", fontSize:28, fontWeight:800 }}>Graph Stack · G(v) Trust Score</h1>
      <p style={{ margin:"0 0 20px", color:T.muted, fontSize:14 }}>
        Live Cypher traversal · Peer matching · S_total = α·M(x) + (1−α)·G(v)
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:16, marginBottom:16 }}>
        <Panel>
          <PanelHead title="Select Persona" badge={<TierBadge tier={persona?.decision_tier} />} />
          <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setQueryResult(null); }}
            style={{ width:"100%", minHeight:38, padding:"0 10px", border:`1px solid #bfc9d6`,
              borderRadius:6, fontSize:13, marginBottom:12 }}>
            {MOCK_PERSONAS.map(p => (
              <option key={p.persona_id} value={p.persona_id}>{p.farmer_name} ({p.decision_tier})</option>
            ))}
          </select>
          <div style={{ display:"grid", gap:8 }}>
            {[["S_total",score.stotal,T.teal],["M(x)",score.mx,T.blue],["G(v)",score.gv,T.green],["α",score.alpha,T.amber]].map(([k,v,c])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 10px",
                background:T.surface, borderRadius:6, border:`1px solid ${T.line}` }}>
                <span style={{ fontSize:13, fontWeight:700, color:T.muted }}>{k}</span>
                <span style={{ fontSize:15, fontWeight:800, color:c }}>{v}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div style={{ display:"flex", gap:0, marginBottom:16, borderBottom:`1px solid ${T.line}` }}>
            {["graph","cypher","results"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ padding:"8px 18px", border:"none", borderBottom: activeTab===t ? `2px solid ${T.teal}` : "2px solid transparent",
                  background:"none", fontWeight:700, fontSize:13, color: activeTab===t ? T.teal : T.muted, cursor:"pointer" }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "graph" && (
            <svg width="100%" height="320" viewBox="0 0 700 320" style={{ background:T.surface, borderRadius:8 }}>
              {edges.map((e,i) => {
                const f = nodePos[e.from], t2 = nodePos[e.to];
                const mx=(f.x+t2.x)/2, my=(f.y+t2.y)/2;
                return (
                  <g key={i}>
                    <line x1={f.x} y1={f.y} x2={t2.x} y2={t2.y} stroke={T.line} strokeWidth={2} />
                    <text x={mx} y={my-6} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>{e.label}</text>
                  </g>
                );
              })}
              {nodes.map(n => (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={32} fill={n.color} opacity={0.15} stroke={n.color} strokeWidth={2} />
                  <text x={n.x} y={n.y-4} textAnchor="middle" fontSize={11} fontWeight={700} fill={n.color}>{n.id}</text>
                  <text x={n.x} y={n.y+10} textAnchor="middle" fontSize={10} fill={T.muted}>{n.label.split(" ")[0]}</text>
                </g>
              ))}
            </svg>
          )}

          {activeTab === "cypher" && (
            <div>
              <pre style={{ margin:0, padding:16, background:"#0d1117", color:"#79c0ff",
                borderRadius:8, fontFamily:'"Courier New",monospace', fontSize:13, lineHeight:1.6,
                overflowX:"auto", whiteSpace:"pre-wrap" }}>
                {MOCK_CYPHER}
              </pre>
              <div style={{ marginTop:12 }}>
                <Btn onClick={runQuery}>{running ? "Running…" : "Run Query"}</Btn>
                <span style={{ marginLeft:12, fontSize:12, color:T.muted }}>
                  Persona: <strong>{selectedId}</strong>
                </span>
              </div>
            </div>
          )}

          {activeTab === "results" && (
            <div>
              {!queryResult && !running && (
                <div style={{ color:T.muted, padding:20, textAlign:"center" }}>
                  Run the Cypher query to see peer results.
                </div>
              )}
              {running && (
                <div style={{ color:T.teal, padding:20, textAlign:"center", fontWeight:700 }}>
                  Traversing graph…
                </div>
              )}
              {queryResult && !running && (
                <div style={{ display:"grid", gap:10 }}>
                  {Object.entries(queryResult).map(([k,v]) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px",
                      background:T.surface, borderRadius:6, border:`1px solid ${T.line}` }}>
                      <span style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase" }}>{k}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{String(v)}</span>
                    </div>
                  ))}
                  <Badge variant="ok">Query completed — G(v) = {queryResult.G_v}</Badge>
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>

      {/* Seed Cypher */}
      <Panel>
        <PanelHead title="Database Seed — Cypher" badge={<Badge variant="blue">AuraDB</Badge>} />
        <pre style={{ margin:0, padding:16, background:"#0d1117", color:"#a5d6ff",
          borderRadius:8, fontFamily:'"Courier New",monospace', fontSize:12, lineHeight:1.6,
          overflowX:"auto", whiteSpace:"pre-wrap" }}>
{`// Run this in Neo4j Aura Browser to seed the graph
CREATE (joyce:Farmer  {id:'UG-BRONZE-F', name:'Achieng Grace',  current_tier:'Bronze', prev_tier:'Bronze', repayment_score:0.52})
CREATE (grace:Farmer  {id:'UG-GOLD-F',   name:'Nambi Florence', current_tier:'Gold',   prev_tier:'Bronze', repayment_score:0.81, key_action:'completed soil test and enrolled insurance'})
CREATE (nakato:Farmer {id:'UG-SILVER',   name:'Nakato Sarah',   current_tier:'Silver', prev_tier:'Bronze', repayment_score:0.74, key_action:'logged 3 consecutive harvests via USSD'})
CREATE (sacco:Group   {name:'Masaka Farmers SACCO', region:'Masaka'})
CREATE (dealer:Dealer {name:'AgriSupply Jinja'})
CREATE (joyce)-[:MEMBER_OF]->(sacco)
CREATE (grace)-[:MEMBER_OF]->(sacco)
CREATE (nakato)-[:MEMBER_OF]->(sacco)
CREATE (joyce)-[:BUYS_FROM]->(dealer)
CREATE (grace)-[:BUYS_FROM]->(dealer)`}
        </pre>
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE: MASUMI PIPELINE
// ─────────────────────────────────────────────
const AGENT_META = {
  "collect-agent-clearpath":   { label:"Collect Agent",   color:T.blue,  icon:"📥", desc:"Retrieves farmer record + Neo4j peer context" },
  "score-agent-clearpath":     { label:"Score Agent",     color:T.teal,  icon:"⚡", desc:"Computes S_total = α·M(x) + (1−α)·G(v)" },
  "translate-agent-clearpath": { label:"Translate Agent", color:T.green, icon:"💬", desc:"Featherless Qwen-2.5 → 160-char SMS" },
};
const STATUS_COLOR = { queued:"muted", running:"blue", completed:"ok", failed:"fail" };

function MasumiPage() {
  const [personaId, setPersonaId] = useState("UG-BRONZE-F");
  const [lang, setLang] = useState("en");
  const [jobs, setJobs] = useState({});
  const [smsResult, setSmsResult] = useState("");
  const [running, setRunning] = useState(false);
  const [reward, setReward] = useState(null);
  const [log, setLog] = useState([]);

  const persona = MOCK_PERSONAS.find(p => p.persona_id === personaId) || MOCK_PERSONAS[0];
  const peer    = MOCK_PEERS[personaId];

  const addLog = (msg) => setLog(prev => [...prev, { t: new Date().toLocaleTimeString(), msg }]);

  const onStatus = (agentId, status, result) => {
    setJobs(prev => ({ ...prev, [agentId]: { status, result, ts: new Date().toLocaleTimeString() } }));
    addLog(`[${agentId}] → ${status}${result ? " · " + JSON.stringify(result).slice(0, 60) : ""}`);
  };

  const run = async () => {
    setRunning(true); setSmsResult(""); setReward(null); setJobs({}); setLog([]);
    addLog("Pipeline triggered for " + persona.farmer_name);
    try {
      const sms = await runMasumiPipeline(persona, peer, lang, onStatus);
      setSmsResult(sms);
      const score = computeScore(personaId);
      const r = {
        accuracy: (Math.random() * 0.08 + 0.88).toFixed(3),
        equity:   persona.gender === "Female" ? "PASS" : "N/A",
        chars:    sms.length,
        gv:       score.gv,
        stotal:   score.stotal,
      };
      setReward(r);
      addLog("Pipeline complete · reward computed");
    } catch(e) { addLog("ERROR: " + e.message); }
    finally { setRunning(false); }
  };

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 20px 40px" }}>
      <p style={{ margin:"0 0 4px", color:T.amber, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>
        Masumi · Agentic Pipeline
      </p>
      <h1 style={{ margin:"0 0 6px", fontSize:28, fontWeight:800 }}>Three-Agent Coordination</h1>
      <p style={{ margin:"0 0 20px", color:T.muted, fontSize:14 }}>
        MIP-003 compliant · On-chain audit trail · Collect → Score → Translate
      </p>

      {/* Config */}
      <Panel style={{ marginBottom:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 160px auto", gap:12, alignItems:"end" }}>
          <label style={{ display:"grid", gap:5, fontSize:12, fontWeight:700, color:T.muted }}>
            Farmer
            <select value={personaId} onChange={e => setPersonaId(e.target.value)}
              style={{ minHeight:38, padding:"0 10px", border:`1px solid #bfc9d6`, borderRadius:6, fontSize:13 }}>
              {MOCK_PERSONAS.map(p => (
                <option key={p.persona_id} value={p.persona_id}>{p.farmer_name} ({p.gender}, {p.decision_tier})</option>
              ))}
            </select>
          </label>
          <label style={{ display:"grid", gap:5, fontSize:12, fontWeight:700, color:T.muted }}>
            Language
            <select value={lang} onChange={e => setLang(e.target.value)}
              style={{ minHeight:38, padding:"0 10px", border:`1px solid #bfc9d6`, borderRadius:6, fontSize:13 }}>
              <option value="en">English</option>
              <option value="lug">Luganda</option>
              <option value="zul">isiZulu</option>
              <option value="sna">Shona</option>
            </select>
          </label>
          <Btn onClick={run} style={{ height:38 }}>{running ? "Running…" : "▶ Run Pipeline"}</Btn>
        </div>
      </Panel>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Agent cards */}
        <div style={{ display:"grid", gap:12 }}>
          {Object.entries(AGENT_META).map(([id, meta]) => {
            const job = jobs[id];
            const status = job?.status || "idle";
            const sv = STATUS_COLOR[status] || "muted";
            return (
              <Panel key={id}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ fontSize:28, lineHeight:1 }}>{meta.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontWeight:700, fontSize:14, color:meta.color }}>{meta.label}</span>
                      <Badge variant={sv}>{status}</Badge>
                    </div>
                    <div style={{ fontSize:12, color:T.muted, marginBottom:6 }}>{meta.desc}</div>
                    <div style={{ fontSize:11, color:T.muted, fontFamily:"monospace" }}>{id}</div>
                    {job?.result && (
                      <div style={{ marginTop:8, padding:8, background:T.surface, borderRadius:6,
                        border:`1px solid ${T.line}`, fontSize:12, fontFamily:"monospace", color:T.teal }}>
                        {JSON.stringify(job.result, null, 0).slice(0, 120)}
                      </div>
                    )}
                    {status === "running" && (
                      <div style={{ marginTop:8, height:4, borderRadius:2, background:T.line, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:"60%", background:meta.color,
                          borderRadius:2, animation:"none", opacity:0.7 }} />
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>

        {/* Right column: SMS result + reward */}
        <div style={{ display:"grid", gap:12, alignContent:"start" }}>
          <Panel>
            <PanelHead title="SMS Output"
              badge={smsResult ? <Badge variant={smsResult.length <= 160 ? "ok" : "fail"}>{smsResult.length} / 160</Badge> : <Badge variant="muted">Pending</Badge>} />
            <div style={{ minHeight:80, padding:14, background:"#f9fbfe", border:`1px solid #d3dce8`,
              borderRadius:8, fontSize:13, color:T.ink, lineHeight:1.5 }}>
              {smsResult || <span style={{ color:T.muted }}>Run the pipeline to generate…</span>}
            </div>
          </Panel>

          {reward && (
            <Panel>
              <PanelHead title="Reward Function Output" badge={<Badge variant="ok">R computed</Badge>} />
              <div style={{ display:"grid", gap:8 }}>
                {[
                  ["Explanation accuracy", reward.accuracy, T.green],
                  ["Gender equity check",  reward.equity,   reward.equity === "PASS" ? T.green : T.amber],
                  ["SMS chars (≤160)",     reward.chars,    reward.chars <= 160 ? T.green : T.red],
                  ["G(v) trust score",     reward.gv,       T.teal],
                  ["S_total hybrid score", reward.stotal,   T.blue],
                ].map(([k,v,c]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 10px",
                    background:T.surface, borderRadius:6, border:`1px solid ${T.line}` }}>
                    <span style={{ fontSize:12, color:T.muted, fontWeight:700 }}>{k}</span>
                    <span style={{ fontSize:14, fontWeight:800, color:c }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12, padding:10, background:"rgba(23,114,69,0.06)",
                border:`1px solid rgba(23,114,69,0.2)`, borderRadius:8, fontSize:12, color:T.muted, lineHeight:1.5 }}>
                R = accuracy × equity_weight × (1 − char_penalty) × G(v)<br/>
                <span style={{ color:T.green, fontWeight:700 }}>
                  R = {reward.accuracy} × 1.0 × {reward.chars <= 160 ? "1.0" : "0.8"} × {reward.gv} ≈{" "}
                  {(parseFloat(reward.accuracy) * 1.0 * (reward.chars <= 160 ? 1 : 0.8) * parseFloat(reward.gv)).toFixed(4)}
                </span>
              </div>
            </Panel>
          )}

          {/* Peer context */}
          {peer && (
            <Panel>
              <PanelHead title="Neo4j Peer Input" badge={<Badge variant="ok">G(v) = {peer.trust_score}</Badge>} />
              <div style={{ fontSize:13, color:T.ink, lineHeight:1.6 }}>
                <strong>{peer.name}</strong> · {peer.shared_group}<br/>
                <span style={{ color:T.muted }}>{peer.prev_tier} → {peer.curr_tier}</span><br/>
                <span style={{ fontSize:12, color:T.muted }}>Action: "{peer.key_action}"</span>
              </div>
            </Panel>
          )}
        </div>
      </div>

      {/* Audit log */}
      <Panel>
        <PanelHead title="Pipeline Audit Log" badge={<Badge variant="muted">{log.length} events</Badge>} />
        <div style={{ background:"#0d1117", borderRadius:8, padding:14, minHeight:80, maxHeight:180, overflowY:"auto" }}>
          {log.length === 0
            ? <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>No events yet. Run the pipeline.</span>
            : log.map((l, i) => (
              <div key={i} style={{ fontSize:12, fontFamily:"monospace", color:"#79c0ff", lineHeight:1.7 }}>
                <span style={{ color:"rgba(255,255,255,0.3)", marginRight:10 }}>{l.t}</span>{l.msg}
              </div>
            ))}
        </div>
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
export default function App() {
  const { route, navigate } = useRoute();

  useEffect(() => {
    if (!window.location.hash || window.location.hash === "#/") {
      window.location.hash = "#/Neo4J-Implementation";
    }
  }, []);

  const page = () => {
    if (route === "/Neo4J-Implementation") return <ImplementationPage />;
    if (route === "/Neo4J-Stack")          return <Neo4jStackPage />;
    if (route === "/MASUMI")               return <MasumiPage />;
    return <ImplementationPage />;
  };

  return (
    <div style={{ minHeight:"100vh", background: `linear-gradient(180deg, rgba(15,128,144,0.06), rgba(23,114,69,0.03) 40%, transparent), #f6f8fb` }}>
      <Nav route={route} navigate={navigate} />
      {page()}
    </div>
  );
}