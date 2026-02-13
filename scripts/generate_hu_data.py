import json
import subprocess
from pathlib import Path

from deep_translator import GoogleTranslator


ROOT = Path(__file__).resolve().parents[1]


def load_js_array(export_name: str, source: str):
    command = [
        "node",
        "--input-type=module",
        "-e",
        f"import {{ {export_name} }} from '{source}'; console.log(JSON.stringify({export_name}));",
    ]
    result = subprocess.run(command, cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def collect_strings(places, combos):
    values = set()
    for place in places:
        for key in ("name", "loc", "time", "desc", "tip"):
            text = place.get(key)
            if isinstance(text, str) and text.strip():
                values.add(text)
    for combo in combos:
        for key in ("title", "drive", "vibe"):
            text = combo.get(key)
            if isinstance(text, str) and text.strip():
                values.add(text)
        for step in combo.get("steps", []):
            if isinstance(step, str) and step.strip():
                values.add(step)
    return sorted(values)


def translate_strings(strings):
    translator = GoogleTranslator(source="en", target="hu")
    translated = {}
    batch_size = 40
    for index in range(0, len(strings), batch_size):
        batch = strings[index:index + batch_size]
        try:
            items = translator.translate_batch(batch)
        except Exception:
            items = []
            for text in batch:
                items.append(translator.translate(text))
        for source, target in zip(batch, items):
            translated[source] = target
        print(f"Translated {min(index + batch_size, len(strings))}/{len(strings)}")
    return translated


def apply_translations(places, combos, translations):
    for place in places:
        for key in ("name", "loc", "time", "desc", "tip"):
            text = place.get(key)
            if isinstance(text, str) and text in translations:
                place[key] = translations[text]
    for combo in combos:
        for key in ("title", "drive", "vibe"):
            text = combo.get(key)
            if isinstance(text, str) and text in translations:
                combo[key] = translations[text]
        combo["steps"] = [translations.get(step, step) for step in combo.get("steps", [])]
    return places, combos


def write_js(path: Path, export_name: str, payload):
    path.write_text(
        f"export const {export_name} = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )


def main():
    places = load_js_array("places", "./src/data/places.js")
    combos = load_js_array("combos", "./src/data/combos.js")

    strings = collect_strings(places, combos)
    translations = translate_strings(strings)
    places_hu, combos_hu = apply_translations(places, combos, translations)

    write_js(ROOT / "src/data/places.hu.js", "placesHu", places_hu)
    write_js(ROOT / "src/data/combos.hu.js", "combosHu", combos_hu)
    print("Generated Hungarian datasets.")


if __name__ == "__main__":
    main()