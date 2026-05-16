function sanitize(value = '') {

  return String(value || '').trim();
}

function safeNumber(value) {

  const num = Number(value);

  return Number.isNaN(num)
    ? 0
    : num;
}

function createSlug(text = '') {

  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function parseList(value = '') {

  if (Array.isArray(value)) {
    return value
      .map(item => String(item || '').trim())
      .filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function qs(selector) {

  return document.querySelector(selector);
}

function qsa(selector) {

  return document.querySelectorAll(selector);
}