export function serviceEmoji(nameEn: string): string {
  const name = nameEn.toLowerCase();
  if (name.includes('aadhar') || name.includes('aadhaar')) return '🪪';
  if (name.includes('pan')) return '💳';
  if (name.includes('money') || name.includes('transfer')) return '💸';
  if (name.includes('bill')) return '🧾';
  if (name.includes('print')) return '🖨️';
  if (name.includes('exam')) return '📝';
  if (name.includes('passport')) return '📘';
  if (name.includes('photocopy') || name.includes('copy')) return '🗂️';
  return '🧰';
}
