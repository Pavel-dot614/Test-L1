import { NewsItem, searchNewsByKeyword } from './searchByKey';

describe('searchNewsByKeyword Function', () => {
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Breaking: New Political Agreement Reached',
      content: 'Details of the agreement...',
      tags: ['politics'],
    },
    {
      id: 2,
      title: 'Tech Company Announces Groundbreaking Innovation',
      content: 'New AI technology...',
      tags: ['technology'],
    },
    {
      id: 3,
      title: 'Sports: Local Team Wins Championship',
      content: 'The team secured their victory...',
      tags: ['sports'],
    },
  ];

  const searchKeyword = 'agreement';

  it('should return news items containing the keyword in the title or content', () => {
    const results = searchNewsByKeyword(newsItems, searchKeyword);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(1);
  });

  it('should return an empty array if no news items match the keyword', () => {
    const results = searchNewsByKeyword(newsItems, 'nonexistentkeyword');
    expect(results).toHaveLength(0);
  });

  it('should perform a case-insensitive search', () => {
    const results = searchNewsByKeyword(newsItems, 'AgReEmEnT');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(1);
  });

  it('should return an empty array when the keyword is an empty string', () => {
    const results = searchNewsByKeyword(newsItems, '');
    expect(results).toEqual(newsItems);
  });
});
