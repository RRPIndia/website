let pagefindInstance = null;

async function getPagefind() {
  if (!pagefindInstance) {
    try {
      pagefindInstance = await import('/pagefind/pagefind.js');
      await pagefindInstance.init();
    } catch (err) {
      console.warn("Pagefind index not found. Ensure site is built with Pagefind.");
    }
  }
  return pagefindInstance;
}

const searchInput = document.getElementById('site-search-input');
const authorSelect = document.getElementById('filter-author');
const groupSelect = document.getElementById('filter-group');
const resultsWrapper = document.getElementById('search-results-wrapper');
const resultsList = document.getElementById('search-results-list');

// Populate filter dropdowns from Pagefind facet indexes
async function loadFilters() {
  const pagefind = await getPagefind();
  if (!pagefind) return;

  const filters = await pagefind.filters();
  if (!filters) return;

  if (filters.author && authorSelect) {
    Object.keys(filters.author).sort().forEach(author => {
      if (!author || author === 'undefined') return;
      const opt = document.createElement('option');
      opt.value = author;
      opt.textContent = `${author} (${filters.author[author]})`;
      authorSelect.appendChild(opt);
    });
  }

  if (filters.group && groupSelect) {
    Object.keys(filters.group).sort().forEach(group => {
      if (!group || group === 'undefined') return;
      const opt = document.createElement('option');
      opt.value = group;
      opt.textContent = `${group} (${filters.group[group]})`;
      groupSelect.appendChild(opt);
    });
  }
}

async function executeSearch() {
  const query = searchInput.value.trim();
  const selectedAuthor = authorSelect?.value || null;
  const selectedGroup = groupSelect?.value || null;

  if (!query && !selectedAuthor && !selectedGroup) {
    resultsWrapper.hidden = true;
    resultsList.innerHTML = '';
    return;
  }

  const pagefind = await getPagefind();
  if (!pagefind) return;

  // Build filter options
  const filterObj = {};
  if (selectedAuthor) filterObj.author = selectedAuthor;
  if (selectedGroup) filterObj.group = selectedGroup;

  const searchOptions = {
    filters: Object.keys(filterObj).length ? filterObj : undefined
  };

  const [enRes, hiRes] = await Promise.all([
    pagefind.search(query || null, { ...searchOptions, language: 'en' }),
    pagefind.search(query || null, { ...searchOptions, language: 'hi' })
  ]);

  const combined = [
    ...(enRes?.results || []),
    ...(hiRes?.results || [])
  ];

  combined.sort((a, b) => b.score - a.score);
  const topResults = combined.slice(0, 15);

  if (topResults.length === 0) {
    resultsList.innerHTML = '<li class="search-empty">No matching posts found</li>';
    resultsWrapper.hidden = false;
    return;
  }

  const loaded = await Promise.all(topResults.map(r => r.data()));

  resultsList.innerHTML = loaded.map(item => `
    <li class="search-result-item">
      <a href="${item.url}">
        <strong class="search-title">${item.meta.title || item.raw_url || 'Facebook Post'}</strong>
        <p class="search-excerpt">${item.excerpt}</p>
      </a>
    </li>
  `).join('');

  resultsWrapper.hidden = false;
}

if (searchInput) {
  let debounceTimer;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(executeSearch, 200);
  });

  authorSelect?.addEventListener('change', executeSearch);
  groupSelect?.addEventListener('change', executeSearch);

  // Load facet lists once page loads
  loadFilters();
}
