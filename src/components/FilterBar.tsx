import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { FilterItem } from '../types/domain';

interface FilterBarProps {
  label: string;
  items: FilterItem[];
  active: string[];
  onSelect: (key: string) => void;
}

const fallbackFilterColors: Record<string, string> = {
  chill: '#7AA58C',
  active: '#C8774E',
  romantic: '#C85F7A',
  culture: '#7F86C2',
  foodie: '#B98966',
  nature: '#6FAF83',
  outdoors: '#D8B35A',
  history: '#8D7A66',
  half: '#7C8DA6',
  full: '#9C7EB3',
  weekend: '#C85F7A',
  day: '#D8B35A',
};

function resolveFilterColor(item: FilterItem): string {
  return item.color || fallbackFilterColors[item.key] || '#C89A62';
}

export function FilterBar({ label, items, active, onSelect }: FilterBarProps) {
  const { t } = useLanguage();
  return (
    <section className="card bg-body-tertiary border-0 shadow-sm h-100">
      <div className="card-body p-3">
      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
        <div className="text-uppercase text-secondary fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
          {label}
        </div>
        {active.length > 0 && (
          <button
            onClick={(e) => { e.preventDefault(); onSelect("all"); }}
            className="btn btn-sm btn-outline-secondary"
          >
            {t('filters.clear')}
          </button>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2">
        {items.filter(i => i.key !== "all").map(item => {
          const isActive = active.includes(item.key);
          const itemColor = resolveFilterColor(item);
          return (
            <button
              key={item.key}
              onClick={(e) => { e.preventDefault(); onSelect(item.key); }}
              className={`btn btn-sm rounded-pill ${isActive ? 'filter-pill-active' : 'btn-outline-secondary'}`}
              aria-pressed={isActive}
              style={isActive
                ? {
                    borderColor: `${itemColor}88`,
                    backgroundColor: `${itemColor}3A`,
                    color: 'var(--app-text)'
                  }
                : undefined}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      </div>
    </section>
  );
}
