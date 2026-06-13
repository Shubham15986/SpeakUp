import { Request, Response } from 'express';

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const extractTitleSlug = async (input: string): Promise<string | null> => {
  // If it's a full URL
  const match = input.match(/leetcode\.com\/problems\/([^/]+)/);
  if (match) return match[1];

  // If it's a serial number
  if (!isNaN(Number(input))) {
    const id = Number(input);
    try {
      const res = await fetch('https://leetcode.com/api/problems/all/');
      if (res.ok) {
        const data = await res.json();
        const problem = data.stat_status_pairs.find((p: any) => p.stat.frontend_question_id === id);
        if (problem) {
          return problem.stat.question__title_slug;
        }
      }
    } catch (e) {
      console.error('Failed to fetch from leetcode all problems API', e);
    }
  }

  // If it's already a slug
  if (/^[a-z0-9-]+$/.test(input)) {
    return input;
  }

  return null;
};

export const extractQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const titleSlug = await extractTitleSlug(url);
    if (!titleSlug) {
       return res.status(400).json({ error: 'Invalid LeetCode URL or Problem Number' });
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

  } catch (error: any) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to extract question data' });
  }
};
