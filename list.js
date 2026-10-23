// 상품 링크 페이지 규칙 — 화면(index.html)이 쓴다. 원본은 커센 저장소, 상품을 올릴 때 GitHub Pages로 함께 배포된다.
// (src/infrastructure/shopping/linkpage/ — link_page.py의 assets)

const MIN_PER_PAGE = 3;
const BUTTONS = 5;

// 공개 시각(open_at, UTC)이 지난 상품만 — 영상 예약 공개와 같은 때 보인다(2026-10-23). 시각이 없거나 못 읽으면 보인다.
export function visibleProducts(products, nowMs) {
  return (Array.isArray(products) ? products : []).filter((p) => {
    const t = Date.parse((p && p.open_at) || "");
    return !Number.isFinite(t) || t <= nowMs;
  });
}

// 검색 — 숫자면 상품 번호(앞 0 무시), 아니면 이름(띄어쓰기 무시)
export function matches(p, term) {
  const t = String(term || "").trim().toLowerCase().replace(/\s/g, "");
  if (!t) return true;
  if (/^\d+$/.test(t)) return p.no === Number(t);
  return String(p.name || "").toLowerCase().replace(/\s/g, "").includes(t);
}

// 한 화면에 들어가는 상품 수 — 화면 높이에서 목록이 시작하는 자리를 빼고 한 칸 높이로 나눈다(최소 3)
export function pageSize(viewportH, listTop, itemH) {
  const n = Math.floor((Number(viewportH) - Number(listTop)) / Number(itemH));
  return Number.isFinite(n) ? Math.max(MIN_PER_PAGE, n) : MIN_PER_PAGE;
}

// page(1부터) → 그 쪽 상품. 범위 밖이면 가장 가까운 쪽으로.
export function pageOf(items, page, per) {
  const pages = Math.max(1, Math.ceil(items.length / per));
  const p = Math.min(Math.max(1, Math.floor(Number(page) || 1)), pages);
  return { items: items.slice((p - 1) * per, p * per), page: p, pages };
}

// 쪽 번호 버튼 — 지금 쪽을 가운데로 최대 5개
export function pageButtons(page, pages) {
  const n = Math.min(BUTTONS, pages);
  const start = Math.min(Math.max(1, page - Math.floor(BUTTONS / 2)), pages - n + 1);
  return Array.from({ length: n }, (_, i) => start + i);
}
