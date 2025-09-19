export const PREPOSITIONS = new Set([
  'in','on','at','for','of','to','a','an','the','and','or','but','with','by','from','as','over','under','into','onto','off','up','down','about','after','before','between','without'
]);

/** Check Title Case; allow prepositions are lowercase */
export function isTitleCaseWithPrepositions(title: string): boolean {
  const words = title.trim().split(/\s+/);
  if (words.length === 0) return false;
  return words.every((w, i) => {
    const clean = w.replace(/[^A-Za-z]/g, '');
    if (!clean) return true;
    const lower = clean.toLowerCase();
    const mustCap = i === 0 || i === words.length - 1;
    if (mustCap) return clean[0] === clean[0].toUpperCase();
    if (PREPOSITIONS.has(lower)) return lower === clean; // giữ lowercase
    return clean[0] === clean[0].toUpperCase();
  });
}

export function parseMoney(m: string): number {
  const digits = m.replace(/[^0-9.]/g, '');
  const val = parseFloat(digits);
  return isNaN(val) ? 0 : val;
}
