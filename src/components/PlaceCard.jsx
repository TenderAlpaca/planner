import React from 'react';
import { categories, getDistColor, getDistDot } from '../data/config';

export function PlaceCard({ place }) {
  const cat = categories[place.cat];
  
  return (
    <div style={{
      background:"rgba(255,255,255,0.03)",
      border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:14, padding:"18px 20px",
      transition:"all 0.25s ease",
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:22 }}>{place.emoji}</span>
            <h3 style={{ 
              fontFamily:"'Cormorant Garamond', Georgia, serif", 
              fontSize:21, 
              fontWeight:600, 
              color:"#F5F1EC", 
              margin:0 
            }}>
              {place.name}
            </h3>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#9A8B7A" }}>
            <span>{place.loc}</span>
            <span>•</span>
            <span style={{ color:getDistColor(place.km) }}>{getDistDot(place.km)} {place.km}km • {place.time}</span>
          </div>
        </div>
        {cat && (
          <div style={{
            background:`${cat.color}15`,
            border:`1px solid ${cat.color}40`,
            color:cat.color,
            padding:"4px 10px",
            borderRadius:12,
            fontSize:10,
            fontWeight:600,
            whiteSpace:"nowrap",
          }}>
            {cat.label}
          </div>
        )}
      </div>
      <p style={{ fontSize:13, lineHeight:"1.6", color:"#B5A693", margin:"0 0 10px 0" }}>
        {place.desc}
      </p>
      <div style={{
        background:"rgba(218,165,105,0.06)",
        border:"1px solid rgba(218,165,105,0.15)",
        borderRadius:8, padding:"8px 12px",
        fontSize:12, color:"#DAA569", lineHeight:"1.5",
        marginBottom:10,
      }}>
        💡 {place.tip}
      </div>
      <a 
        href={place.maps} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display:"inline-block",
          color:"#DAA569",
          fontSize:12,
          textDecoration:"none",
          borderBottom:"1px solid rgba(218,165,105,0.3)",
          transition:"all 0.2s ease",
        }}
      >
        📍 View on Maps
      </a>
    </div>
  );
}
