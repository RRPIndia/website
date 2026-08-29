function getTranslatedUrl(currentUrl, currentLang, collections) {
  const targetLang = currentLang === 'en' ? 'hi' : 'en';
  const fallbackUrl = targetLang === 'hi' ? '/hi/' : '/';

  let segments = currentUrl.split('/').filter(Boolean);

  // If neither 'en' nor 'hi' exists anywhere in the URL path, go straight to the homepage
  if (!segments.includes('en') && !segments.includes('hi')) {
    return fallbackUrl;
  }

  // 1. Try the exact translated URL first
  let exactSegments = segments.map(seg => (seg === currentLang ? targetLang : seg));
  
  if (exactSegments.length > 0) {
    const exactCandidate = '/' + exactSegments.join('/') + '/';
    const exactMatch = collections.find(p => p.url === exactCandidate || p.url === exactCandidate.slice(0, -1));
    if (exactMatch) {
      return exactMatch.url;
    }
  }

  // 2. If exact match fails, start walking up the parent tree
  let fallbackSegments = [...exactSegments];
  while (fallbackSegments.length > 0) {
    fallbackSegments.pop();
    if (fallbackSegments.length === 0) break;

    const candidateUrl = '/' + fallbackSegments.join('/') + '/';
    const match = collections.find(p => p.url === candidateUrl || p.url === candidateUrl.slice(0, -1));
    if (match) {
      return match.url;
    }
  }

  // 3. Final safety fallback to language root
  return fallbackUrl;
}

module.exports = { getTranslatedUrl };
