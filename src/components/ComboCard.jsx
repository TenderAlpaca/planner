import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function ComboCard({ combo }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const isWeekend = combo.type === "weekend";
  
  return (
    <div 
      onClick={() => setOpen(!open)} 
      style={{
        background: open
          ? isWeekend ? "linear-gradient(135deg, rgba(233,30,99,0.08) 0%, rgba(255,255,255,0.02) 100%)" : "linear-gradient(135deg, rgba(218,165,105,0.1) 0%, rgba(255,255,255,0.02) 100%)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${open ? (isWeekend ? "rgba(233,30,99,0.25)" : "rgba(218,165,105,0.25)") : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16, 
        padding: "20px 24px", 
        cursor: "pointer", 
        transition: "all 0.25s ease",
        boxShadow: open ? (isWeekend ? "0 8px 24px rgba(233,30,99,0.08)" : "0 8px 24px rgba(218,165,105,0.08)") : "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:26 }}>{combo.emoji}</span>
          <div>
            <div style={{ 
              fontFamily:"'Cormorant Garamond', Georgia, serif", 
              fontSize:20, 
              fontWeight:600, 
              color:"#F5F1EC" 
            }}>
              {combo.title}
            </div>
            <div style={{ fontSize:11, color:"#8B7355", marginTop:2 }}>
              {combo.drive} • {combo.vibe}
            </div>
          </div>
        </div>
        <div style={{
          background: isWeekend ? "rgba(233,30,99,0.15)" : "rgba(218,165,105,0.15)",
          border: `1px solid ${isWeekend ? "rgba(233,30,99,0.3)" : "rgba(218,165,105,0.3)"}`,
          color: isWeekend ? "#E91E63" : "#DAA569",
          padding:"4px 12px", borderRadius:12, fontSize:10, fontWeight:600, whiteSpace:"nowrap",
        }}>
          {combo.type === 'weekend' ? t('tripType.weekend') : t('tripType.day')}
        </div>
      </div>
      
      {open && (
        <div style={{ 
          marginTop:16, 
          paddingTop:16, 
          borderTop:"1px solid rgba(255,255,255,0.08)" 
        }}>
          <ol style={{ 
            margin:0, 
            paddingLeft:20, 
            fontSize:13, 
            lineHeight:"1.8", 
            color:"#B5A693" 
          }}>
            {combo.steps.map((step, i) => (
              <li key={i} style={{ marginBottom:8 }}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
