import { Request, Response } from 'express';

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const extractTitleSlug = (url: string) => {
  const match = url.match(/leetcode\.com\/problems\/([^/]+)/);
  return match ? match[1] : null;
};

export const extractQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (url.includes('leetcode.com')) {
      const titleSlug = extractTitleSlug(url);
      if (!titleSlug) {
         return res.status(400).json({ error: 'Invalid LeetCode URL' });
      }

      const query = `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            title
            content
            difficulty
            topicTags {
              name
            }
          }
        }
      `;

      const response = await fetch(LEETCODE_GRAPHQL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify({
          query,
          variables: { titleSlug }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from LeetCode');
      }

      const data = await response.json();
      const question = data.data?.question;
      
      if (!question) {
        return res.status(404).json({ error: 'Question not found on LeetCode' });
      }

      // Clean HTML from content
      const cleanContent = question.content ? question.content.replace(/<[^>]*>?/gm, '').trim() : '';

      return res.status(200).json({
        title: question.title,
        description: cleanContent,
        difficulty: question.difficulty,
        topics: question.topicTags?.map((t: any) => t.name) || [],
        source: 'LeetCode'
      });

    } else {
      // Basic fallback for other URLs or HackerRank (not fully implemented)
      return res.status(400).json({ error: 'Only LeetCode URLs are currently supported.' });
    }

  } catch (error: any) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to extract question data' });
  }
};
