import { useEffect, useRef } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';

interface SelectedLocation {
  address: string;
  lat: number;
  lng: number;
}

interface LocationAutocompleteInputProps {
  id?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (location: SelectedLocation) => void;
  disabled?: boolean;
  placeholder?: string;
  style?: CSSProperties;
  className?: string;
  language?: 'en' | 'hu';
  describedBy?: string;
  autoFocus?: boolean;
  hasError?: boolean;
}

export function LocationAutocompleteInput({
  id,
  value,
  onChange,
  onSelect,
  disabled,
  placeholder,
  style,
  className,
  language = 'en',
  describedBy,
  autoFocus,
  hasError,
}: LocationAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: 'hu' },
        fields: ['formatted_address', 'geometry']
      }
    );
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onSelect && onSelect({
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    });
    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onSelect, language]);

  return (
    <input
      id={id}
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      disabled={disabled}
      autoComplete="off"
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      autoFocus={autoFocus}
      className={className}
    />
  );
}
