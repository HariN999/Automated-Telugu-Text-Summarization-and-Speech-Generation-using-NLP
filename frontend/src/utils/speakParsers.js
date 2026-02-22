const normalizeNewsItem = (item) => ({
  headline: String(item?.headline ?? "").trim(),
  firstLine: String(item?.firstLine ?? item?.first_line ?? "").trim(),
  brief: String(item?.brief ?? "").trim(),
  fullText: String(item?.fullText ?? item?.full_text ?? "").trim(),
  source: String(item?.source ?? "Unknown Source").trim(),
  audioUrl: item?.audioUrl ?? item?.audio_url ?? null,
});

export const normalizeNewsResponse = (payload) => {
  const rawNews = Array.isArray(payload) ? payload : payload?.news;
  if (!Array.isArray(rawNews)) return [];

  return rawNews
    .map(normalizeNewsItem)
    .filter((item) => item.headline && (item.firstLine || item.brief || item.fullText));
};
