// ============================================================
// MindSafe AI — Single File App
// All components in one file, clean comments
// ============================================================

import React, { useState } from "react";
import "./App.css";

const API_URL = process.env.NODE_ENV === "production"
  ? ""         
  : "http://localhost:8000";  

// Demo data for sidebar on first load
// No demo data — start empty, fill from real user input
const DEMO_HISTORY = [];

// ── Translations (TH / EN) ──────────────────────────────────
const TEXT = {
  TH: {
    // Header
    app_sub:      "ระบบตรวจจับภาวะสุขภาพจิตด้วย AI",
    nav_analyze:  "วิเคราะห์",
    nav_dash:     "แดชบอร์ด",
    nav_emg:      "ฉุกเฉิน",
    // Sidebar
    history:      "ประวัติการวิเคราะห์",
    no_history:   "ยังไม่มีประวัติ\nเริ่มวิเคราะห์ข้อความแรกได้เลยค่ะ",
    badge_safe:   "ปลอดภัย",
    badge_risk:   "เสี่ยง",
    // Analyze
    a_heading:    "วิเคราะห์สุขภาพจิต",
    a_sub:        "พิมพ์ความรู้สึกของคุณ ระบบ AI จะวิเคราะห์และให้คำแนะนำ รองรับภาษาไทยและอังกฤษ",
    a_ph:         "พิมพ์ความรู้สึกของคุณที่นี่...\nเช่น ช่วงนี้รู้สึกเครียดมาก นอนไม่หลับ หมดแรง...",
    a_btn:        "วิเคราะห์",
    a_loading:    "กำลังวิเคราะห์...",
    chars:        "ตัวอักษร",
    r_safe:       "😌 ปลอดภัย",
    r_risk:       "⚠️ มีความเสี่ยง",
    r_safe_desc:  "ไม่พบสัญญาณที่น่าเป็นห่วง คุณดูอยู่ในสภาวะที่ดีค่ะ",
    r_risk_desc:  "พบสัญญาณของความเครียดหรือวิกฤต แนะนำให้ขอความช่วยเหลือค่ะ",
    confidence:   "ความมั่นใจ",
    lbl_normal:   "ปลอดภัย",
    lbl_risk:     "มีความเสี่ยง",
    recs:         "💡 คำแนะนำ",
    sos:          "🆘 ขอความช่วยเหลือด่วน",
    translated:   "🌐 คำแปล",
    disclaimer:   "ระบบนี้สร้างขึ้นเพื่อการวิจัยเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์",
    err_empty:    "กรุณาพิมพ์ข้อความก่อนนะคะ",
    err_api:      "ไม่สามารถเชื่อมต่อ API ได้ กรุณาตรวจสอบว่า backend ทำงานบน port 8000",
    // Dashboard
    d_heading:    "แดชบอร์ด",
    d_sub:        "สรุปผลการวิเคราะห์สุขภาพจิตทั้งหมด",
    d_total:      "วิเคราะห์ทั้งหมด",
    d_safe:       "ปลอดภัย",
    d_risk:       "มีความเสี่ยง",
    d_rate:       "อัตราปลอดภัย",
    d_donut:      "สัดส่วนผลลัพธ์",
    d_bar:        "แนวโน้มรายวัน",
    d_recent:     "รายการที่มีความเสี่ยงล่าสุด",
    d_nodata:     "ยังไม่มีข้อมูล\nเริ่มวิเคราะห์ข้อความเพื่อดูสถิติ",
    d_norisk:     "ยังไม่พบรายการที่มีความเสี่ยง 🎉",
    days:         ["จ","อ","พ","พฤ","ศ","ส","อา"],
    today:        "วันนี้",
    // Emergency
    e_heading:    "ขอความช่วยเหลือ",
    e_sub:        "หากคุณหรือคนที่คุณรักกำลังเผชิญกับวิกฤต โปรดติดต่อความช่วยเหลือได้ทันทีค่ะ",
    e_imm:        "🚨 สายด่วนฉุกเฉิน",
    e_sup:        "💬 สายด่วนสุขภาพจิต",
    e_tips:       "💡 วิธีรับมือเบื้องต้น",
    e_reminder:   "คุณไม่ได้อยู่คนเดียว ความช่วยเหลืออยู่ใกล้คุณเสมอค่ะ ❤️",
    btn_call:     "📞 โทร",
  },
  EN: {
    app_sub:      "AI-Powered Mental Health Detection",
    nav_analyze:  "Analyze",
    nav_dash:     "Dashboard",
    nav_emg:      "Emergency",
    history:      "Analysis History",
    no_history:   "No history yet\nStart by analyzing your first text",
    badge_safe:   "Safe",
    badge_risk:   "At-risk",
    a_heading:    "Mental Health Analysis",
    a_sub:        "Type how you're feeling. Our AI will analyze and give recommendations. Supports Thai & English.",
    a_ph:         "Type how you're feeling here...\ne.g. I've been stressed, can't sleep, exhausted...",
    a_btn:        "Analyze",
    a_loading:    "Analyzing...",
    chars:        "characters",
    r_safe:       "😌 SAFE",
    r_risk:       "⚠️ AT-RISK",
    r_safe_desc:  "No signs of crisis detected. You seem to be doing well.",
    r_risk_desc:  "Signs of mental health concern detected. Please seek support.",
    confidence:   "Confidence",
    lbl_normal:   "Normal",
    lbl_risk:     "At-Risk",
    recs:         "💡 Recommendations",
    sos:          "🆘 Get Help Now",
    translated:   "🌐 Translated",
    disclaimer:   "For research purposes only. Not a substitute for professional medical advice.",
    err_empty:    "Please enter some text first.",
    err_api:      "Cannot connect to API. Make sure backend is running on port 8000.",
    d_heading:    "Dashboard",
    d_sub:        "Summary of all mental health analysis results",
    d_total:      "Total Analyzed",
    d_safe:       "Safe",
    d_risk:       "At-Risk",
    d_rate:       "Safe Rate",
    d_donut:      "Result Breakdown",
    d_bar:        "Daily Trend",
    d_recent:     "Recent At-Risk Entries",
    d_nodata:     "No data yet\nStart analyzing text to see statistics",
    d_norisk:     "No at-risk entries found 🎉",
    days:         ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    today:        "Today",
    e_heading:    "Get Help",
    e_sub:        "If you or someone you know is in a crisis, please reach out for help immediately.",
    e_imm:        "🚨 Emergency Lines",
    e_sup:        "💬 Mental Health Support",
    e_tips:       "💡 Coping Tips",
    e_reminder:   "You are not alone. Help is always available. ❤️",
    btn_call:     "📞 Call",
  },
};

// Static emergency contacts (names depend on language)
const getEmergency = (lang) => ({
  immediate: [
    { flag:"🇹🇭", name: lang==="TH"?"เหตุฉุกเฉิน (ไทย)":"Emergency (Thailand)", number:"1669" },
    { flag:"🌏", name: lang==="TH"?"นานาชาติ":"International",                  number:"+1-800-273-8255" },
  ],
  support: [
    { flag:"🇹🇭", name: lang==="TH"?"สายด่วนสุขภาพจิต กรมสุขภาพจิต":"Thailand Mental Health Hotline", number:"1323",         note: lang==="TH"?"ฟรี ตลอด 24 ชม.":"Free, 24 hrs" },
    { flag:"🇹🇭", name: lang==="TH"?"กรมสุขภาพจิต":"Dept. of Mental Health",                           number:"02-590-8556", note: lang==="TH"?"จ.-ศ. 08:30-16:30":"Mon-Fri 08:30-16:30" },
    { flag:"🌏", name: "Crisis Text Line",                                                               number: lang==="TH"?"SMS: HOME → 741741":"Text HOME to 741741", note: lang==="TH"?"สหรัฐอเมริกา":"USA" },
    { flag:"🌏", name: "Befrienders Worldwide",                                                          number:"befrienders.org", note: lang==="TH"?"นานาชาติ":"International" },
  ],
  tips: lang==="TH" ? [
    { icon:"🫁", title:"หายใจลึกๆ",                    desc:"หายใจเข้า 4 วินาที หยุด 4 วินาที หายใจออก 4 วินาที ทำซ้ำ 4 ครั้ง" },
    { icon:"👁️", title:"เทคนิค 5-4-3-2-1",             desc:"มองหา 5 สิ่งที่เห็น 4 ที่สัมผัสได้ 3 เสียง 2 กลิ่น 1 รส" },
    { icon:"📱", title:"ติดต่อคนที่ไว้ใจ",              desc:"โทรหาเพื่อนหรือครอบครัวที่คุณรู้สึกสบายใจที่จะพูดคุย" },
    { icon:"🏥", title:"ขอความช่วยเหลือผู้เชี่ยวชาญ",  desc:"นักจิตวิทยาและจิตแพทย์พร้อมช่วยเสมอ อย่าลังเลเลยค่ะ" },
    { icon:"🚶", title:"ออกไปข้างนอก",                  desc:"เดินสูดอากาศบริสุทธิ์ แม้แค่ไม่กี่นาทีก็ช่วยได้มากค่ะ" },
    { icon:"📓", title:"เขียนระบาย",                    desc:"เขียนความรู้สึกลงกระดาษ ไม่ต้องสวยงาม แค่ระบายออกมาก็ดีขึ้นค่ะ" },
  ] : [
    { icon:"🫁", title:"Deep Breathing",       desc:"Breathe in 4s, hold 4s, out 4s. Repeat 4 times." },
    { icon:"👁️", title:"5-4-3-2-1 Technique", desc:"Name 5 things you see, 4 touch, 3 hear, 2 smell, 1 taste." },
    { icon:"📱", title:"Reach Out",            desc:"Call a friend or family member you trust and feel safe talking to." },
    { icon:"🏥", title:"Seek Professional Help", desc:"Psychologists are ready to help. Don't hesitate." },
    { icon:"🚶", title:"Go Outside",           desc:"A short walk in fresh air, even a few minutes, helps a lot." },
    { icon:"📓", title:"Journal",              desc:"Write your feelings down. It doesn't need to be perfect." },
  ],
});

// ── HEADER ─────────────────────────────────────────────────
function Header({ dark, setDark, lang, setLang, page, setPage }) {
  const t = TEXT[lang];
  const NAV = [
    { id:"analyze",   icon:"🔍", label:t.nav_analyze },
    { id:"dashboard", icon:"📊", label:t.nav_dash    },
    { id:"emergency", icon:"🆘", label:t.nav_emg     },
  ];
  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">🧠</span>
        <div>
          <div className="header-name">MindSafe AI</div>
          <div className="header-sub">{t.app_sub}</div>
        </div>
      </div>
      <nav className="header-nav">
        {NAV.map(n => (
          <button key={n.id} className={`nav-btn ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
            <span>{n.icon}</span><span className="nav-label">{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="header-controls">
        <button className="ctrl-btn" onClick={()=>setLang(lang==="TH"?"EN":"TH")}>
          {lang==="TH"?"🇬🇧 EN":"🇹🇭 TH"}
        </button>
        <button className="ctrl-btn" onClick={()=>setDark(!dark)}>
          {dark?"☀️":"🌙"}
        </button>
      </div>
    </header>
  );
}

// ── SIDEBAR ─────────────────────────────────────────────────
function Sidebar({ history, lang }) {
  const [collapsed, setCollapsed] = useState(false);
  const t = TEXT[lang];

  // Group entries by their group key
  const groups = history.reduce((acc, item) => {
    const key = item.group || t.today;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <aside className={`sidebar ${collapsed?"collapsed":""}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-title">{t.history}</span>}
        <button className="collapse-btn" onClick={()=>setCollapsed(!collapsed)}>
          {collapsed?"›":"‹"}
        </button>
      </div>
      {!collapsed && (
        <div className="sidebar-body">
          {history.length === 0 ? (
            <div className="sidebar-empty">
              <span>🕐</span><p>{t.no_history}</p>
            </div>
          ) : (
            Object.entries(groups).map(([group, items]) => (
              <div key={group} className="history-group">
                <div className="group-label">{group}</div>
                {[...items].reverse().map((item, i) => (
                  <div key={i} className={`history-item ${item.prediction==="At-risk"?"item-risk":"item-safe"}`}>
                    <span className="h-dot" />
                    <div className="h-info">
                      <span className="h-text">
                        {item.text.length>35 ? item.text.slice(0,35)+"…" : item.text}
                      </span>
                      <span className="h-meta">
                        <span className={`h-badge ${item.prediction==="At-risk"?"badge-risk":"badge-safe"}`}>
                          {item.prediction==="At-risk" ? t.badge_risk : t.badge_safe}
                        </span>
                        <span className="h-time">{item.time}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  );
}

// ── ANALYZE PAGE ────────────────────────────────────────────
function AnalyzePage({ onResult, lang }) {
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);
  const t = TEXT[lang];

  const handleAnalyze = async () => {
    if (!text.trim()) { setError(t.err_empty); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const res  = await fetch(`${API_URL}/api/analyze`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const full = { ...data, text };
      setResult(full);
      onResult(full);
    } catch { setError(t.err_api); }
    finally  { setLoading(false); }
  };

  const isSafe = result?.prediction === "Normal";
  const circ   = 2 * Math.PI * 34;

  return (
    <div className="page">
      <h1 className="page-heading fade-up">{t.a_heading}</h1>
      <p  className="page-sub    fade-up">{t.a_sub}</p>

      {/* Input */}
      <div className="card input-card fade-up-1">
        <textarea className="text-input" placeholder={t.a_ph}
          value={text} onChange={e=>setText(e.target.value)} maxLength={1000} />
        <div className="input-footer">
          <span className="char-count">{text.length} / 1000 {t.chars}</span>
          <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
            {loading ? <><span className="spinner"/>{t.a_loading}</> : <>{t.a_btn} →</>}
          </button>
        </div>
      </div>

      {error && <div className="card error-card fade-up">⚠️ {error}</div>}

      {result && (
        <div className="result-area fade-up">
          {/* Translated banner */}
          {result.translated_text &&
           result.translated_text.toLowerCase() !== result.text.toLowerCase() && (
            <div className="translated-box">{t.translated}: <em>{result.translated_text}</em></div>
          )}

          {/* Result card */}
          <div className={`card result-card ${isSafe?"card-safe":"card-risk"}`}>
            <div className="result-top">
              <div>
                <div className={`result-label ${isSafe?"label-safe":"label-risk"}`}>
                  {isSafe ? t.r_safe : t.r_risk}
                </div>
                <div className="result-desc">{isSafe ? t.r_safe_desc : t.r_risk_desc}</div>
              </div>
              {/* Circular gauge */}
              <div className="conf-circle">
                <svg viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" className="circ-bg"/>
                  <circle cx="40" cy="40" r="34"
                    className={`circ-fill ${isSafe?"circ-safe":"circ-risk"}`}
                    strokeDasharray={`${result.confidence*circ} ${circ}`}
                    transform="rotate(-90 40 40)"/>
                </svg>
                <div className="conf-text">
                  <span className="conf-num">{(result.confidence*100).toFixed(0)}</span>
                  <span className="conf-pct">%</span>
                </div>
              </div>
            </div>
            {/* Probability bars */}
            {[
              { label:t.lbl_normal, val:result.probabilities.Normal,    cls:"bar-safe" },
              { label:t.lbl_risk,   val:result.probabilities["At-risk"], cls:"bar-risk" },
            ].map(row => (
              <div key={row.label} className="prob-row">
                <span className="prob-label">{row.label}</span>
                <div className="prob-track">
                  <div className={`prob-fill ${row.cls}`} style={{width:`${row.val*100}%`}}/>
                </div>
                <span className="prob-pct">{(row.val*100).toFixed(1)}%</span>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="card">
            <div className="recs-title">{t.recs}</div>
            {result.recommendations.map((rec,i) => (
              <div key={i} className="rec-item" style={{animationDelay:`${i*0.06}s`}}>
                <span className="rec-dot"/>{rec}
              </div>
            ))}
          </div>

          {/* SOS — only for At-risk */}
          {!isSafe && (
            <div className="card sos-card">
              <div className="sos-title">{t.sos}</div>
              {[
                { icon:"📞", text: lang==="TH"?"สายด่วนสุขภาพจิต: 1323 (ฟรี 24 ชม.)":"Thailand Mental Health: 1323 (Free 24hrs)" },
                { icon:"🚨", text: lang==="TH"?"ฉุกเฉิน: 1669":"Emergency: 1669" },
                { icon:"🌏", text: lang==="TH"?"นานาชาติ: +1-800-273-8255":"International: +1-800-273-8255" },
              ].map((l,i) => (
                <div key={i} className="sos-line"><span>{l.icon}</span><span>{l.text}</span></div>
              ))}
            </div>
          )}
        </div>
      )}
      <p className="disclaimer">⚠️ {t.disclaimer}</p>
    </div>
  );
}

// ── DASHBOARD PAGE ──────────────────────────────────────────
function DashboardPage({ history, lang }) {
  const t = TEXT[lang];
  const total     = history.length;
  const safeCount = history.filter(h=>h.prediction==="Normal").length;
  const riskCount = total - safeCount;
  const safeRate  = total>0 ? ((safeCount/total)*100).toFixed(1) : 0;

  // Donut
  const circ     = 2*Math.PI*52;
  const safeDash = total>0 ? (safeCount/total)*circ : 0;

  // Bar chart buckets by day index
  const barData = t.days.map((day,i) => ({
    day,
    safe: history.filter(h=>h.prediction==="Normal"  && parseInt(h.time)%7===i).length,
    risk: history.filter(h=>h.prediction==="At-risk" && parseInt(h.time)%7===i).length,
  }));
  const barMax = Math.max(...barData.map(d=>d.safe+d.risk), 1);

  const recentRisk = history.filter(h=>h.prediction==="At-risk").slice(-5).reverse();

  if (total===0) return (
    <div className="page dash-page">
      <h1 className="page-heading fade-up">{t.d_heading}</h1>
      <p  className="page-sub    fade-up">{t.d_sub}</p>
      <div className="card no-data fade-up-1">
        <span className="no-data-icon">📊</span>
        <p>{t.d_nodata}</p>
      </div>
    </div>
  );

  return (
    <div className="page dash-page">
      <h1 className="page-heading fade-up">{t.d_heading}</h1>
      <p  className="page-sub    fade-up">{t.d_sub}</p>

      {/* Stat cards */}
      <div className="stat-row fade-up-1">
        {[
          { label:t.d_total, value:total,         cls:"num-accent" },
          { label:t.d_safe,  value:safeCount,      cls:"num-safe"   },
          { label:t.d_risk,  value:riskCount,      cls:"num-risk"   },
          { label:t.d_rate,  value:safeRate+"%",   cls:"num-warn"   },
        ].map(s => (
          <div key={s.label} className="stat-card card">
            <span className={`stat-num ${s.cls}`}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-row fade-up-2">
        {/* Donut chart */}
        <div className="card chart-card">
          <div className="chart-title">{t.d_donut}</div>
          <div className="donut-wrap">
            <svg viewBox="0 0 120 120" className="donut-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--risk-dim)" strokeWidth="14"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--safe)" strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${safeDash} ${circ}`}
                transform="rotate(-90 60 60)"
                style={{transition:"stroke-dasharray 1s ease"}}/>
              <text x="60" y="54" textAnchor="middle" className="donut-num">{safeRate}%</text>
              <text x="60" y="68" textAnchor="middle" className="donut-sub">
                {lang==="TH"?"ปลอดภัย":"Safe"}
              </text>
            </svg>
            <div className="donut-legend">
              {[
                { cls:"dot-safe", label:t.d_safe, val:safeCount },
                { cls:"dot-risk", label:t.d_risk, val:riskCount },
              ].map(row => (
                <div key={row.label} className="legend-row">
                  <span className={`legend-dot ${row.cls}`}/>
                  <span className="legend-label">{row.label}</span>
                  <span className="legend-val">{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="card chart-card chart-wide">
          <div className="chart-title">{t.d_bar}</div>
          <div className="bar-chart">
            {barData.map(d => (
              <div key={d.day} className="bar-col">
                <div className="bar-stack">
                  <div className="bar-seg bar-risk-seg" style={{height:`${(d.risk/barMax)*100}%`}}/>
                  <div className="bar-seg bar-safe-seg" style={{height:`${(d.safe/barMax)*100}%`}}/>
                </div>
                <span className="bar-label">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="bar-legend">
            <span><span className="legend-dot dot-safe"/>{t.d_safe}</span>
            <span><span className="legend-dot dot-risk"/>{t.d_risk}</span>
          </div>
        </div>
      </div>

      {/* Recent at-risk list */}
      <div className="card fade-up-3">
        <div className="chart-title">⚠️ {t.d_recent}</div>
        {recentRisk.length===0 ? (
          <p className="no-risk">{t.d_norisk}</p>
        ) : (
          <div className="risk-list">
            {recentRisk.map((item,i) => (
              <div key={i} className="risk-row">
                <span className="risk-time">{item.time}</span>
                <span className="risk-text">{item.text.length>60?item.text.slice(0,60)+"…":item.text}</span>
                <span className="risk-badge">{t.badge_risk}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── EMERGENCY PAGE ──────────────────────────────────────────
function EmergencyPage({ lang }) {
  const t    = TEXT[lang];
  const data = getEmergency(lang);

  return (
    <div className="page emg-page">
      <h1 className="page-heading fade-up">{t.e_heading}</h1>
      <p  className="page-sub    fade-up">{t.e_sub}</p>

      {/* Reminder banner */}
      <div className="card reminder-banner fade-up-1">
        <span className="reminder-heart">❤️</span>
        <p>{t.e_reminder}</p>
      </div>

      {/* Emergency lines */}
      <section className="fade-up-1">
        <div className="section-title">{t.e_imm}</div>
        <div className="lines-grid">
          {data.immediate.map((line,i) => (
            <div key={i} className="card line-card line-risk">
              <span className="line-flag">{line.flag}</span>
              <div className="line-info">
                <span className="line-name">{line.name}</span>
                <span className="line-number num-risk">{line.number}</span>
              </div>
              <a href={`tel:${line.number}`} className="call-btn">{t.btn_call}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Support lines */}
      <section className="fade-up-2">
        <div className="section-title">{t.e_sup}</div>
        <div className="lines-grid">
          {data.support.map((line,i) => (
            <div key={i} className="card line-card line-accent">
              <span className="line-flag">{line.flag}</span>
              <div className="line-info">
                <span className="line-name">{line.name}</span>
                <span className="line-number num-accent">{line.number}</span>
                {line.note && <span className="line-note">{line.note}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coping tips */}
      <section className="fade-up-3">
        <div className="section-title">{t.e_tips}</div>
        <div className="tips-grid">
          {data.tips.map((tip,i) => (
            <div key={i} className="card tip-card">
              <span className="tip-icon">{tip.icon}</span>
              <div>
                <div className="tip-title">{tip.title}</div>
                <div className="tip-desc">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── ROOT APP ────────────────────────────────────────────────
export default function App() {
  const [dark,    setDark]    = useState(true);
  const [lang,    setLang]    = useState("TH");
  const [page,    setPage]    = useState("analyze");
  // Load history from localStorage on first render
const [history, setHistory] = useState(() => {
  try {
    const saved = localStorage.getItem("mindsafe_history");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

  // Add result to history after analysis
  const handleResult = (result) => {
  const newEntry = {
    time:       new Date().toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"}),
    date:       new Date().toLocaleDateString("th-TH"),
    text:       result.text,
    prediction: result.prediction,
    group:      new Date().toLocaleDateString(
                  lang==="TH" ? "th-TH" : "en-US",
                  { day:"numeric", month:"long" }
                ),
  };
  setHistory(prev => {
    const updated = [...prev, newEntry];
    // Save to localStorage every time
    try { localStorage.setItem("mindsafe_history", JSON.stringify(updated)); }
    catch { console.error("localStorage save failed"); }
    return updated;
  });
};

  const renderPage = () => {
    switch(page) {
      case "analyze":   return <AnalyzePage   onResult={handleResult} lang={lang}/>;
      case "dashboard": return <DashboardPage history={history}       lang={lang}/>;
      case "emergency": return <EmergencyPage                          lang={lang}/>;
      default:          return <AnalyzePage   onResult={handleResult} lang={lang}/>;
    }
  };

  return (
    <div className={`app ${dark?"dark":"light"}`}>
      <Header dark={dark} setDark={setDark} lang={lang} setLang={setLang} page={page} setPage={setPage}/>
      <div className="app-body">
        <Sidebar history={history} lang={lang}/>
        <main className="page-wrap">{renderPage()}</main>
      </div>
    </div>
  );
}
