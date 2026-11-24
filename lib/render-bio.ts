// lib/render-bio.ts
// Chuyển bio do người dùng nhập thành HTML an toàn.
// Cách làm: escape toàn bộ, rồi chỉ mở lại các thẻ được phép:
// <b>, <i> và <a href="http(s)://..."> (không thuộc tính nào khác).

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderBio(bio: string): string {
  return escapeHtml(bio)
    .replace(/&lt;(\/?)(b|i)&gt;/g, "<$1$2>")
    .replace(
      /&lt;a href=&quot;(https?:\/\/[^\s&<>]+)&quot;&gt;/g,
      '<a href="$1" rel="noopener noreferrer nofollow" target="_blank">',
    )
    .replace(/&lt;\/a&gt;/g, "</a>");
}
