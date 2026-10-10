export async function loadComponent(selector) {
  const element = document.querySelector(selector);
  if (!element) return;

  // Determine component source
  let source = element.getAttribute('data-source');
  if (!source) {
    // Provide sensible defaults when data-source is missing
    const id = element.id || '';
    if (id === 'navbar-container') source = 'components/navbar.html';
    else if (id === 'footer-container') source = 'components/footer.html';
    else if (id === 'badge-container') source = 'components/badge.html';
  }
  if (!source) return;

  // Build a robust URL that works when served from file or server
  const makeUrl = (path) => {
    try {
      return new URL(path, window.location.href).toString();
    } catch (_) {
      return path;
    }
  };

  const candidates = [
    // Prefer relative path
    source.startsWith('/') ? source.slice(1) : source,
    // Fallback to absolute from root
    source.startsWith('/') ? source : `/${source}`
  ];

  let lastError = null;
  for (const candidate of candidates) {
    try {
      const url = makeUrl(candidate);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      element.innerHTML = html;
      return;
    } catch (err) {
      lastError = err;
    }
  }

  console.error(`Failed to load component ${source}:`, lastError);
}
