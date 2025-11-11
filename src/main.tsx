import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
// Intentionally messy and unoptimized code
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Registering inside component later too (redundant) but here once anyway
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// using any for simplicity & bad typing
const moods: any = ["Happy", "Sad", "Stressed", "Calm", "Angry", "Excited"];

function App() {
  // storing everything in local state without memoization
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Happy");
  const [filterMood, setFilterMood] = useState("");
  const [entries, setEntries] = useState<any>(() => {
    try {
      const raw = localStorage.getItem('mindtrackr_entries');
      if (raw) return JSON.parse(raw);
    } catch(e) { console.error(e); }
    return [];
  });

  // Re-read localStorage on every render (bad)
  const allEntries = entries; // pretend we reloaded

  // redundantly register chart stuff again (bad)
  useEffect(() => {
    Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  });

  const save = () => {
    const newEntry: any = { id: Date.now(), date: new Date().toISOString().slice(0,10), mood, text };
    const updated = [...entries, newEntry];
    setEntries(updated);
    try { localStorage.setItem('mindtrackr_entries', JSON.stringify(updated)); } catch(e) { /* ignore */ }
    // not clearing text to show messy UX
  };

  // naive frequency calc every render
  const moodCounts: any = {};
  (allEntries || []).forEach((e:any) => { moodCounts[e.mood] = (moodCounts[e.mood]||0)+1; });

  // build chart repeatedly without cleanup causing leaks
  useEffect(() => {
    const ctx = document.getElementById('moodChart') as HTMLCanvasElement | null;
    if (!ctx) return;
    // eslint-disable-next-line
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(moodCounts),
        datasets: [{
          label: 'Mood Frequency',
          data: Object.keys(moodCounts).map(k => moodCounts[k]),
          backgroundColor: 'rgba(100,150,255,0.6)'
        }]
      },
      options: {
        responsive: true,
        animation: false,
        plugins: { legend: { display: true } }
      }
    });
  }, [entries, filterMood, text, mood]); // too many deps

  const filtered = filterMood ? allEntries.filter((e:any) => e.mood === filterMood) : allEntries;

  return (
    <div style={{ padding: 14 }}>
      <h1 style={{ margin: 4 }}>MindTrackr (Bad Baseline)</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid #ccc', padding: 10 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write something about your day..."
          style={{ minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }}
        />
        <select value={mood} onChange={e => setMood(e.target.value)} style={{ width: 160 }}>
          {moods.map((m:any, i:number) => <option key={i}>{m}</option>)}
        </select>
        <button onClick={save} style={{ background: '#4a90e2', color: 'white', padding: '8px 12px', border: 'none', cursor: 'pointer' }}>Save Entry</button>
      </div>

      <div style={{ marginTop: 20, border: '1px dashed #aaa', padding: 10 }}>
        <h2 style={{ margin: 0 }}>Mood Frequency</h2>
        <canvas id="moodChart" style={{ maxWidth: '100%', marginTop: 8 }}></canvas>
      </div>

      <div style={{ marginTop: 25, border: '1px solid #ddd', padding: 10 }}>
        <h2 style={{ marginTop:0 }}>Entries</h2>
        <div style={{ marginBottom: 10 }}>
          <span>Filter Mood: </span>
          <select value={filterMood} onChange={e => setFilterMood(e.target.value)} style={{ width: 140 }}>
            <option value="">(All)</option>
            {moods.map((m:any, i:number) => <option key={i}>{m}</option>)}
          </select>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filtered.map((e:any) => (
            <li key={e.id} style={{ marginBottom: 12, background: '#f9f9f9', padding: 10 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{e.date} - <b>{e.mood}</b></div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{e.text}</div>
            </li>
          ))}
          {filtered.length === 0 && <li style={{ color: '#888' }}>No entries yet for this mood.</li>}
        </ul>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
