import type { Language, LocalizedData } from '../types/domain';

const dataCache: Partial<Record<Language, LocalizedData>> = {};
const dataBaseUrl = (import.meta.env.VITE_DATA_BASE_URL ?? `${import.meta.env.BASE_URL}data`).replace(/\/+$/, '');

export async function fetchLocalizedData(language: Language): Promise<LocalizedData> {
  if (dataCache[language]) {
    return dataCache[language] as LocalizedData;
  }

  const response = await fetch(`${dataBaseUrl}/${language}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load localized data for ${language}`);
  }

  const data = (await response.json()) as LocalizedData;
  dataCache[language] = data;
  return data;
}
