export const categories = {
  adventure: { label:"⚡ Adventure", color:"#FF6B35" },
  explore: { label:"🧭 Explore", color:"#45B7D1" },
  thermal: { label:"✨ Thermal", color:"#96E6A1" },
  food: { label:"🍷 Food & Gastro", color:"#DDA0DD" },
  special: { label:"🌟 Special", color:"#FFD700" },
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
  { key:"all", label:"Any", color:"#888" },
  { key:"close", label:"🟢 < 1 hr", color:"#4CAF50", max:50 },
  { key:"mid", label:"🟡 1–2 hr", color:"#FFC107", min:51, max:150 },
  { key:"far", label:"🟠 2–3 hr", color:"#FF5722", min:151, max:250 },
  { key:"weekend", label:"🔴 3+ hr", color:"#E91E63", min:251 },
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

export function getDistColor(d) { 
  return d <= 50 ? "#4CAF50" : d <= 150 ? "#FFC107" : d <= 250 ? "#FF5722" : "#E91E63"; 
}

export function getDistDot(d) { 
  return d <= 50 ? "🟢" : d <= 150 ? "🟡" : d <= 250 ? "🟠" : "🔴"; 
}
