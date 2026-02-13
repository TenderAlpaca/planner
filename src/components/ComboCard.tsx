import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Combo } from '../types/domain';

interface ComboCardProps {
  combo: Combo;
}

export function ComboCard({ combo }: ComboCardProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const isWeekend = combo.type === "weekend";
  
  return (
    <div 
      onClick={() => setOpen(!open)} 
      className={`card shadow-sm border-0 h-100 ${open ? 'bg-light' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body">
      <div className="d-flex align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize:26 }}>{combo.emoji}</span>
          <div>
            <div className="h5 mb-0">
              {combo.title}
            </div>
            <div className="text-secondary" style={{ fontSize:11 }}>
              {combo.drive} • {combo.vibe}
            </div>
          </div>
        </div>
        <div className={`badge rounded-pill ${isWeekend ? 'text-bg-danger' : 'text-bg-warning'}`}>
          {combo.type === 'weekend' ? t('tripType.weekend') : t('tripType.day')}
        </div>
      </div>
      
      {open && (
        <div className="border-top mt-3 pt-3">
          <ol className="mb-0" style={{ paddingLeft: 20, fontSize: 13, lineHeight: 1.8 }}>
            {combo.steps.map((step, i) => (
              <li key={i} className="mb-2 text-secondary">{step}</li>
            ))}
          </ol>
        </div>
      )}
      </div>
    </div>
  );
}
