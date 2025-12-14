// Simple slugify utility: normalize, remove accents, keep a-z0-9, replace groups with '-'
export default function slugify(text = '') {
  return text
    .toString()
    .normalize('NFKD') // split accented characters
    .replace(/\p{Diacritic}/gu, '') // remove diacritics (requires u flag)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alnum with -
    .replace(/^-+|-+$/g, '') // trim leading/trailing -
    .slice(0, 100);
}
