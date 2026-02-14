import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDataDir = path.join(rootDir, 'public', 'data');

const loadTsModule = (relativePath) => {
  const filePath = path.join(rootDir, relativePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
    },
  }).outputText;

  const module = { exports: {} };
  const exports = module.exports;
  const evaluator = new Function('exports', 'module', output);
  evaluator(exports, module);
  return module.exports;
};

const config = loadTsModule('src/data/config.ts');
const configHu = loadTsModule('src/data/config.hu.ts');
const places = loadTsModule('src/data/places.ts');
const placesHu = loadTsModule('src/data/places.hu.ts');
const combos = loadTsModule('src/data/combos.ts');
const combosHu = loadTsModule('src/data/combos.hu.ts');

const enData = {
  places: places.places,
  combos: combos.combos,
  categories: config.categories,
  vibeFilters: config.vibeFilters,
  distanceRanges: config.distanceRanges,
  durationFilters: config.durationFilters,
  tripTypeFilters: config.tripTypeFilters,
};

const huData = {
  places: placesHu.placesHu,
  combos: combosHu.combosHu,
  categories: configHu.categoriesHu,
  vibeFilters: configHu.vibeFiltersHu,
  distanceRanges: configHu.distanceRangesHu,
  durationFilters: configHu.durationFiltersHu,
  tripTypeFilters: configHu.tripTypeFiltersHu,
};

fs.mkdirSync(publicDataDir, { recursive: true });
fs.writeFileSync(path.join(publicDataDir, 'en.json'), JSON.stringify(enData, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'hu.json'), JSON.stringify(huData, null, 2));

console.log('Generated public/data/en.json and public/data/hu.json');
