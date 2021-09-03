export function setQuery(term: string) {
  const url = new URL(window.location.href);
  if (term) {
    url.searchParams.set("q", encodeURIComponent(term));
  } else {
    url.searchParams.delete("q");
  }
  window.history.replaceState(null, document.title, url.toString());
}

export function getQuery() {
  const url = new URL(window.location.href);
  return url.searchParams.get("q");
}
