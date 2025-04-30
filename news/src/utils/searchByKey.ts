export interface NewsItem {
  id: number;
  title: string;
  content: string;
  tags: string[];
}

export const searchNewsByKeyword = (
  newsItems: NewsItem[],
  keyword: string,
): NewsItem[] => {
  const lowerKeyword = keyword.toLowerCase();
  return newsItems.filter(
    item =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.content.toLowerCase().includes(lowerKeyword),
  );
};
