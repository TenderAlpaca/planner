export const categories = {
  adventure: { label:"⚡ Adventure", color:"#D97745" },
  explore: { label:"🧭 Explore", color:"#5CA8BF" },
  thermal: { label:"✨ Thermal", color:"#84C89A" },
  food: { label:"🍷 Food & Gastro", color:"#B989C1" },
  special: { label:"🌟 Special", color:"#D9B85F" },
};

export const vibeFilters = [
  { key:"all", label:"All", icon:"✦" },
  { key:"chill", label:"Chill", icon:"🧘" },
  { key:"active", label:"Active", icon:"💪" },
  { key:"romantic", label:"Romantic", icon:"💕" },
  { key:"culture", label:"Culture", icon:"🎨" },
  { key:"foodie", label:"Foodie", icon:"🍴" },
  { key:"nature", label:"Nature", icon:"🌿" },
  { key:"outdoors", label:"Outdoors", icon:"☀️" },
  { key:"history", label:"History", icon:"📜" },
];

export const distanceRanges = [
  { key:"all", label:"Any", color:"#9A8F80" },
  { key:"close", label:"🟢 < 1 hr", color:"#6FBF82", max:50 },
  { key:"mid", label:"🟡 1–2 hr", color:"#D8B35A", min:51, max:150 },
  { key:"far", label:"🟠 2–3 hr", color:"#D88452", min:151, max:250 },
  { key:"weekend", label:"🔴 3+ hr", color:"#C85F7A", min:251 },
];

export const durationFilters = [
  { key:"all", label:"Any" },
  { key:"half", label:"Half Day" },
  { key:"full", label:"Full Day" },
  { key:"weekend", label:"Weekend" },
];

export const tripTypeFilters = [
  { key:"all", label:"All Plans" },
  { key:"day", label:"Day Trips" },
  { key:"weekend", label:"Weekend Getaways" },
];

export function getDistColor(d: number) { 
  return d <= 50 ? "#6FBF82" : d <= 150 ? "#D8B35A" : d <= 250 ? "#D88452" : "#C85F7A"; 
}

export function getDistDot(d: number) { 
  return d <= 50 ? "🟢" : d <= 150 ? "🟡" : d <= 250 ? "🟠" : "🔴"; 
}
