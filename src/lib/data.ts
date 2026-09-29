import Papa from 'papaparse';

export interface Portfolio {
  clientName: string;
  photos: string[];
}

export type PortfolioCategory = 'weddings' | 'kids-photography' | 'everyday-joys';

export interface WeddingFilm {
  title: string;
  videoId: string;
  description: string;
}

export const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1AxmyiMhkZOYT_fVKXzT1nBxhBTvxwFTyy4dT696ZERk/export?format=csv';
export const PORTFOLIO_SHEET_CSV_URLS: Record<PortfolioCategory, string> = {
  weddings: GOOGLE_SHEET_CSV_URL,
  'kids-photography': 'https://docs.google.com/spreadsheets/d/11o6D6lYRvB7buJQ7G7YCJpD56HUCp59AmnlUgfa8xp8/export?format=csv',
  'everyday-joys': '',
};
export const WEDDING_FILMS_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1UafxfsA9-TcYhCJ1Q5MZJ0YJgz7sP8CGn85ztK3q9po/export?format=csv';

export const fetchPortfolios = async (category: PortfolioCategory = 'weddings'): Promise<Portfolio[]> => {
  const sheetUrl = PORTFOLIO_SHEET_CSV_URLS[category];
  if (!sheetUrl) return [];

  return new Promise((resolve) => {
    const parseData = (csvString: string) => {
      Papa.parse(csvString, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as string[][];
          const portfolios: Portfolio[] = [];
          
          // Assuming row 0 is headers, so skip it
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row && row.length > 0) {
              const clientName = row[0];
              const photos = row.slice(1)
                .filter(url => url && url.trim().length > 0)
                .map(url => {
                  let finalUrl = url.trim();
                  // Convert Google Drive links to direct image URLs using lh3.googleusercontent.com
                  // This is more reliable than drive.google.com/uc which often gets blocked by redirects
                  const fileMatch = finalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                  if (fileMatch && fileMatch[1]) {
                    finalUrl = `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w1200`;
                  } else if (finalUrl.includes('drive.google.com/open?id=')) {
                    const idMatch = finalUrl.match(/id=([a-zA-Z0-9_-]+)/);
                    if (idMatch && idMatch[1]) {
                      finalUrl = `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1200`;
                    }
                  } else if (finalUrl.includes('drive.google.com/uc')) {
                    const idMatch = finalUrl.match(/id=([a-zA-Z0-9_-]+)/);
                    if (idMatch && idMatch[1]) {
                      finalUrl = `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1200`;
                    }
                  }
                  return finalUrl;
                });
              if (clientName) {
                portfolios.push({ clientName, photos });
              }
            }
          }
          resolve(portfolios);
        },
        error: (error: Error) => {
          console.error(`Failed to parse ${category} portfolio sheet`, error);
          resolve([]);
        }
      });
    };

    fetch(sheetUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Google Sheets returned ${response.status}`);
        return response.text();
      })
      .then(parseData)
      .catch((error: Error) => {
        console.error(`Failed to fetch ${category} portfolio sheet`, error);
        resolve([]);
      });
  });
};

const getYouTubeVideoId = (url: string): string => {
  const match = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|watch\?v=))([\w-]{11})/);
  return match?.[1] ?? '';
};

export const fetchWeddingFilms = async (): Promise<WeddingFilm[]> => {
  if (!WEDDING_FILMS_SHEET_CSV_URL) return [];

  try {
    const response = await fetch(WEDDING_FILMS_SHEET_CSV_URL);
    if (!response.ok) throw new Error(`Google Sheets returned ${response.status}`);
    const result = Papa.parse<string[]>(await response.text(), { skipEmptyLines: true });
    return result.data.slice(1).flatMap((row) => {
      const videoId = getYouTubeVideoId(row[1] ?? '');
      return videoId ? [{
        title: row[0] || 'Wedding Film',
        videoId,
        description: row[2] || '',
      }] : [];
    });
  } catch (error) {
    console.error('Failed to fetch wedding films from Google Sheets', error);
    return [];
  }
};
