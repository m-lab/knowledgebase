<script lang="ts">
  import { onMount } from 'svelte';
  import lunr from 'lunr';

  interface Tag {
    name: string;
    label: string;
    color?: string;
  }

  interface Props {
    siteTitle: string;
    siteTagline: string;
    tags: Tag[];
    searchIndexUrl: string;
  }

  let { siteTitle, siteTagline, tags, searchIndexUrl }: Props = $props();

  let activeTag = $state('all');
  let query = $state('');
  let matchIds = $state<Set<string> | null>(null);

  let lunrIndex: lunr.Index | null = null;
  let indexState = $state<'idle' | 'loading' | 'ready'>('idle');

  async function loadIndex() {
    if (indexState !== 'idle') return;
    indexState = 'loading';
    try {
      const docs = await fetch(searchIndexUrl).then(r => r.json());
      lunrIndex = lunr(function () {
        this.ref('id');
        this.field('title',       { boost: 10 });
        this.field('tags',        { boost: 8 });
        this.field('description', { boost: 5 });
        this.field('content');
        docs.forEach((doc: object) => { this.add(doc); });
      });
      indexState = 'ready';
    } catch (e) {
      console.warn('KB: search index unavailable', e);
      indexState = 'idle';
    }
  }

  function doSearch(q: string): Set<string> | null {
    if (!lunrIndex || !q) return null;
    try {
      const terms = q.trim().split(/\s+/);
      const qStr = terms.map((t, i) => i === terms.length - 1 ? t + '*' : t).join(' ');
      return new Set(lunrIndex.search(qStr).map(r => r.ref));
    } catch {
      try {
        return new Set(lunrIndex.search(q).map(r => r.ref));
      } catch { return new Set(); }
    }
  }

  let debounce: ReturnType<typeof setTimeout>;

  function onInput(e: Event) {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const val = (e.target as HTMLInputElement).value.trim();
      query = val;
      if (!val) { matchIds = null; applyFilter(); return; }
      if (indexState !== 'ready') await loadIndex();
      matchIds = doSearch(val);
      applyFilter();
    }, 200);
  }

  async function onFocus() {
    if (indexState === 'idle') loadIndex();
  }

  function applyFilter() {
    const items = document.querySelectorAll<HTMLElement>('.article-grid__item');
    let visible = 0;
    items.forEach(item => {
      const itemTags = (item.dataset.tags || '').split(' ');
      const matchTag    = activeTag === 'all' || itemTags.includes(activeTag);
      const matchSearch = matchIds === null || matchIds.has(item.dataset.url || '');
      const show = matchTag && matchSearch;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const noResults = document.getElementById('no-results');
    if (noResults) noResults.hidden = visible > 0;
  }

  $effect(() => {
    // Re-run filter whenever reactive state changes
    activeTag; matchIds;
    applyFilter();
  });

  onMount(async () => {
    // Pre-fill from ?q= URL param (navigated from another page)
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') ?? '';

    const headerInput = document.querySelector<HTMLInputElement>('#header-search');

    if (initialQuery) {
      query = initialQuery;
      if (headerInput) headerInput.value = initialQuery;
      await loadIndex();
      matchIds = doSearch(initialQuery);
    }

    // Wire the header search input to this component for live filtering
    if (headerInput) {
      headerInput.addEventListener('input', onInput);
      headerInput.addEventListener('focus', onFocus);
    }

    applyFilter();
  });

  function selectTag(name: string) {
    activeTag = name === activeTag ? 'all' : name;
  }
</script>

<div class="browse-header">
  <h1>{siteTitle}</h1>
  <p>{siteTagline}</p>
</div>

<div class="tag-filter-bar" id="tag-filter-bar">
  <span class="tag-filter-bar__label">Browse by tag:</span>
  <button
    class="tag tag-filter {activeTag === 'all' ? 'is-active' : ''}"
    data-filter="all"
    onclick={() => { activeTag = 'all'; }}
  >All</button>
  {#each tags as tag}
    <button
      class="tag {activeTag === tag.name ? 'is-active' : ''}"
      data-tag={tag.name}
      style={tag.color ? `--tag-color:${tag.color}` : ''}
      onclick={() => selectTag(tag.name)}
    >{tag.label}</button>
  {/each}
</div>
