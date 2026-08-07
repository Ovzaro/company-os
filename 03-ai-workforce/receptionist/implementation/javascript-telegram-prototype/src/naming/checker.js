const platforms = {
  instagram: { url: (name) => `https://www.instagram.com/${name}/`, reliable200: false },
  x: { url: (name) => `https://x.com/${name}`, reliable200: false },
  linkedin: { url: (name) => `https://www.linkedin.com/company/${name}`, reliable200: false },
  tiktok: { url: (name) => `https://www.tiktok.com/@${name}`, reliable200: false },
  threads: { url: (name) => `https://www.threads.net/@${name}`, reliable200: false },
  facebook: { url: (name) => `https://www.facebook.com/${name}`, reliable200: false },
  github: { url: (name) => `https://github.com/${name}`, reliable200: true },
  reddit: { url: (name) => `https://www.reddit.com/r/${name}/`, reliable200: false },
};

async function requestStatus(url, timeoutMs, reliable200 = true) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'CompanyNamingEngine/1.0 (+availability research)' },
    });
    if (response.status === 404) return 'Available';
    if (response.status === 200) return reliable200 ? 'Unavailable' : 'Unknown';
    return 'Unknown';
  } catch {
    return 'Unknown';
  } finally {
    clearTimeout(timer);
  }
}

async function checkDomain(name, timeoutMs) {
  const status = await requestStatus(`https://rdap.verisign.com/com/v1/domain/${name}.com`, timeoutMs);
  return status === 'Available' ? 'Available' : status === 'Unavailable' ? 'Unavailable' : 'Unknown';
}

export async function checkAvailability(name, { live = false, timeoutMs = 5000 } = {}) {
  if (!live) {
    return { domain: 'Unknown', ...Object.fromEntries(Object.keys(platforms).map((key) => [key, 'Unknown'])) };
  }
  const handle = name.toLowerCase();
  const [domain, ...socialResults] = await Promise.all([
    checkDomain(handle, timeoutMs),
    ...Object.values(platforms).map((platform) => requestStatus(platform.url(handle), timeoutMs, platform.reliable200)),
  ]);
  return {
    domain,
    ...Object.fromEntries(Object.keys(platforms).map((key, index) => [key, socialResults[index]])),
  };
}

export function failedChecks(availability) {
  return Object.values(availability).filter((status) => status === 'Unavailable').length;
}
