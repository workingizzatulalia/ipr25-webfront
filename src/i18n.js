// Site language, EN or BM ('ms'), remembered across visits. Each page's
// <head> script sets <html lang> from it before paint. Text in both
// languages is a { en, ms } pair; where the BM is still to come, English
// shows.
// The BM preview build (`npm run build:bm`, published at /bm/) has the
// toggle on, opens in BM and keeps its own stored choice. The main site has
// it off until the BM is approved: the toggle still animates (main.js), but
// the site stays in English and a stored BM choice is ignored.
const preview = import.meta.env.MODE === 'bm'
const STORAGE_KEY = preview ? 'ipr25-lang-preview' : 'ipr25-lang'
const languages = ['en', 'ms']
const defaultLang = preview ? 'ms' : 'en'

export const translationEnabled = preview

const stored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export let lang = translationEnabled && languages.includes(stored()) ? stored() : defaultLang
document.documentElement.lang = lang

export const t = (text) => (text?.constructor === Object ? text[lang] ?? text.en : text)

// A copy of `data` with every { en, ms } pair in it resolved by t().
export const localize = (data) => {
  if (Array.isArray(data)) return data.map(localize)
  if (data?.constructor !== Object) return data
  if ('en' in data) return t(data)
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, localize(value)]))
}

export const setLang = (next) => {
  if (!translationEnabled || next === lang || !languages.includes(next)) return
  lang = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {}
  document.documentElement.lang = next
  document.dispatchEvent(new Event('langchange'))
}

export const onLangChange = (render) => document.addEventListener('langchange', render)
