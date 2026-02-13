import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { FilterItem } from '../types/domain';

interface FilterBarProps {
  label: string;
  items: FilterItem[];
  active: string[];
  onSelect: (key: string) => void;
}

export function FilterBar({ label, items, active, onSelect }: FilterBarProps) {
  const { t } = useLanguage();
  return (
    <section className="filter-bar">
      <div className="filter-bar-header">
        <div className="filter-bar-label">
          {label}
        </div>
        {active.length > 0 && (
          <button
            onClick={(e) => { e.preventDefault(); onSelect("all"); }}
            className="filter-clear-btn"
          >
            {t('filters.clear')}
          </button>
        )}
      </div>

      <div className="filter-chip-wrap">
        {items.filter(i => i.key !== "all").map(item => {
          const isActive = active.includes(item.key);
          return (
            <button
              key={item.key}
              onClick={(e) => { e.preventDefault(); onSelect(item.key); }}
              className={`filter-chip ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
              style={{
                '--chip-color': item.color || '#DAA569',
              } as React.CSSProperties}
            >
              {item.icon && <span className="filter-chip-icon">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
