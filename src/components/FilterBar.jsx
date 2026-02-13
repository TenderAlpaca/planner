import React from 'react';

export function FilterBar({ label, items, active, onSelect }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ 
          fontSize:10, 
          fontFamily:"'Inter', sans-serif", 
          color:"#8B7355", 
          letterSpacing:"0.15em", 
          textTransform:"uppercase", 
          fontWeight:600 
        }}>
          {label}
        </div>
        {active.length > 0 && (
          <button 
            onClick={(e) => { e.preventDefault(); onSelect("all"); }}
            onTouchEnd={(e) => { e.preventDefault(); onSelect("all"); }}
            style={{
              background:"none", 
              border:"none", 
              color:"#8B7355", 
              fontSize:12, 
              cursor:"pointer",
              fontFamily:"'Inter', sans-serif", 
              textDecoration:"underline", 
              padding:"6px 10px",
              minHeight:"32px", 
              touchAction:"manipulation", 
              WebkitTapHighlightColor:"rgba(139,115,85,0.2)",
              userSelect:"none", 
              WebkitUserSelect:"none",
            }}
          >
            clear
          </button>
        )}
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {items.filter(i => i.key !== "all").map(item => {
          const isActive = active.includes(item.key);
          return (
            <button 
              key={item.key} 
              onClick={(e) => { e.preventDefault(); onSelect(item.key); }}
              onTouchEnd={(e) => { e.preventDefault(); onSelect(item.key); }}
              style={{
                background: isActive ? "rgba(218,165,105,0.15)" : "rgba(255,255,255,0.035)",
                border: `1px solid ${isActive ? (item.color || "rgba(218,165,105,0.4)") + (item.color?"60":"") : "rgba(255,255,255,0.08)"}`,
                color: isActive ? (item.color || "#DAA569") : "#8B7355",
                padding:"14px 22px", 
                borderRadius:26, 
                fontSize:13, 
                cursor:"pointer",
                fontFamily:"'Inter', sans-serif",
                fontWeight: isActive ? 600 : 500, 
                transition:"all 0.2s ease",
                display:"flex", 
                alignItems:"center", 
                gap:6,
                minHeight:"48px", 
                minWidth:"fit-content",
                touchAction:"manipulation", 
                WebkitTapHighlightColor:"rgba(218,165,105,0.2)",
                userSelect:"none", 
                WebkitUserSelect:"none",
              }}
            >
              {item.icon && <span style={{ fontSize:15, pointerEvents:"none" }}>{item.icon}</span>}
              <span style={{ pointerEvents:"none" }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
