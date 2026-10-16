import Papa from 'papaparse';

export interface Portfolio {
  clientName: string;
  photos: string[];
}

export type PortfolioCategory = 'weddings' | 'kids-photography' | 'documentary-films';
export type VideoCategory = 'wedding-films' | 'kids-films' | 'documentary-films';

export interface WeddingFilm {
  title: string;
  videoId: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  link?: string;
}

// -------------------------------------------------------------
// SHEET CONFIGURATION (11 SHEETS TOTAL)
// -------------------------------------------------------------

// 1. HOME PAGE SHEETS (5 Sheets)
const HOME_PHOTO_SHEETS: Record<string, string> = {
  weddings: 'https://docs.google.com/spreadsheets/d/1o3Tozp9cngoarI9WQyuJI1GKe3JyGGJ89u0TAXXWJKc/export?format=csv',
  'kids-photography': 'https://docs.google.com/spreadsheets/d/1FTaCRUtB7hJZKWaJxJzEIIl7rZmZYLmXsrVkHDTn4kc/export?format=csv',
  'documentary-films': '',
};

const HOME_VIDEO_SHEETS: Record<string, string> = {
  'wedding-films': 'https://docs.google.com/spreadsheets/d/1S_Cx4j8cBU3Y6OxEraT9nMYe05WLciqx83x0_tEYJPw/export?format=csv',
  'kids-films': 'https://docs.google.com/spreadsheets/d/1aqs1jlH2ATeFEXkvi-BZY-4BjsbrW_7ZH0VMsubKmqA/export?format=csv',
  'documentary-films': 'https://docs.google.com/spreadsheets/d/1HPu0UT2vYn1AayQgIJaFxwfLdAB5z-R58wMj_Z-u4kQ/export?format=csv',
};

// 2. PORTFOLIO PAGE SHEETS (5 Sheets)
const PORTFOLIO_PHOTO_SHEETS: Record<string, string> = {
  weddings: 'https://docs.google.com/spreadsheets/d/1BWCDanBTSx_s0XMoOVwZKiDg-vpqAwvw3RBsrLLr8rc/export?format=csv',
  'kids-photography': 'https://docs.google.com/spreadsheets/d/1tm5szHaE3eZCJL5CPkvPpGuyEijN9jiisiaR7TAu1kQ/export?format=csv',
  'documentary-films': '',
};

const PORTFOLIO_VIDEO_SHEETS: Record<string, string> = {
  'wedding-films': 'https://docs.google.com/spreadsheets/d/1HWlMexyUF9y8be0YBK7zgHgZsVTKonoEW6y62SxYy3U/export?format=csv',
  'kids-films': 'https://docs.google.com/spreadsheets/d/1uDh5ds7tDjkfDM491Icxdf9S39yWqw9NWeCBOdU9jBg/export?format=csv',
  'documentary-films': 'https://docs.google.com/spreadsheets/d/1dAASW7IzT0EETaK-MS5NBzFyEzTJVBRe9pVms5NbKOY/export?format=csv',
};

// 3. BLOG SHEET (1 Sheet)
export const BLOG_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1JRepF-k3NYweaWIRxA9-tBuX03x8Ae0vZqzJT0vTlNA/export?format=csv';

// -------------------------------------------------------------
// DATA FETCHING LOGIC
// -------------------------------------------------------------

export const fetchPortfolios = async (category: PortfolioCategory = 'weddings', isHome: boolean = false): Promise<Portfolio[]> => {
  const sheetUrl = isHome ? HOME_PHOTO_SHEETS[category] : PORTFOLIO_PHOTO_SHEETS[category];
  if (!sheetUrl) return [];

  return new Promise((resolve) => {
    const parseData = (csvString: string) => {
      Papa.parse(csvString, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as string[][];
          // Both home and portfolio pages: treat every cell in every row (skip header row 0)
          // as a photo URL — no client-wise separation.
          const allPhotos: string[] = [];

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;
            // For home the whole row is URLs; for portfolio the sheet may have
            // a client name in col 0 — we skip that if it doesn't look like a URL.
            const startCol = (!isHome && row[0] && !row[0].trim().startsWith('http')) ? 1 : 0;
            for (let c = startCol; c < row.length; c++) {
              const raw = row[c]?.trim();
              if (!raw) continue;
              let finalUrl = raw;
              const fileMatch = finalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
              if (fileMatch?.[1]) {
                finalUrl = `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w1200`;
              } else if (finalUrl.includes('drive.google.com/open?id=') || finalUrl.includes('drive.google.com/uc')) {
                const idMatch = finalUrl.match(/id=([a-zA-Z0-9_-]+)/);
                if (idMatch?.[1]) finalUrl = `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1200`;
              }
              allPhotos.push(finalUrl);
            }
          }

          resolve(allPhotos.length > 0 ? [{ clientName: 'Gallery', photos: allPhotos }] : []);
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
  if (!url) return '';
  const clean = url.trim();
  const match = clean.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|watch\?(?:.*&)?v=))([\w-]{11})/);
  if (match?.[1]) return match[1];
  const fallback = clean.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return fallback?.[1] ?? '';
};

export const fetchVideoCollection = async (category: VideoCategory, isHome: boolean = false): Promise<WeddingFilm[]> => {
  const sheetUrl = isHome ? HOME_VIDEO_SHEETS[category] : PORTFOLIO_VIDEO_SHEETS[category];
  if (!sheetUrl) return [];

  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error(`Google Sheets returned ${response.status}`);
    const result = Papa.parse<string[]>(await response.text(), { skipEmptyLines: true });
    return result.data.slice(1).flatMap((row) => {
      const videoId = getYouTubeVideoId(row[1] ?? '');
      return videoId ? [{
        title: row[0] || category.replace('-', ' '),
        videoId,
        description: row[2] || '',
      }] : [];
    });
  } catch (error) {
    console.error(`Failed to fetch ${category} from Google Sheets`, error);
    return [];
  }
};

export const fetchWeddingFilms = async (isHome: boolean = false): Promise<WeddingFilm[]> => fetchVideoCollection('wedding-films', isHome);
export const fetchKidsFilms = async (isHome: boolean = false): Promise<WeddingFilm[]> => fetchVideoCollection('kids-films', isHome);
export const fetchDocumentaryFilms = async (isHome: boolean = false): Promise<WeddingFilm[]> => fetchVideoCollection('documentary-films', isHome);

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  if (!BLOG_SHEET_CSV_URL || BLOG_SHEET_CSV_URL.includes('BLOG_SHEET_ID')) return [];
  try {
    const response = await fetch(BLOG_SHEET_CSV_URL);
    if (!response.ok) throw new Error(`Google Sheets returned ${response.status}`);
    const result = Papa.parse<string[]>(await response.text(), { skipEmptyLines: true });
    return result.data.slice(1).flatMap((row, index) => {
      const title = row[0]?.trim();
      if (!title) return [];
      let image = row[2]?.trim() || '';
      const fileMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileMatch && fileMatch[1]) {
        image = `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w1200`;
      } else if (image.includes('drive.google.com/open?id=') || image.includes('drive.google.com/uc')) {
        const idMatch = image.match(/id=([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
          image = `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1200`;
        }
      }
      return [{
        id: String(index + 1),
        title,
        date: row[1]?.trim() || '',
        image,
        excerpt: row[3]?.trim() || '',
        link: row[4]?.trim() || '',
      }];
    });
  } catch (error) {
    console.error('Failed to fetch blog posts from Google Sheets', error);
    return [];
  }
};
