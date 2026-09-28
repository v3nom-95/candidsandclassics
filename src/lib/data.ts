import Papa from 'papaparse';

export interface Portfolio {
  clientName: string;
  photos: string[];
}

// Default mock data in case the Google Sheet URL is not provided yet
const MOCK_CSV_DATA = `Client Name,Photo 1,Photo 2,Photo 3,Photo 4
Rohan & Anjali,https://images.unsplash.com/photo-1583939000240-690db252f4dc?auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80
Vikram & Neha,https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1543880884-6338e55e0903?auto=format&fit=crop&q=80
Arjun & Priya,https://images.unsplash.com/photo-1544078755-9b2fdfb8fb5e?auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80
`;

// Replace this with the actual published CSV link from Google Sheets
export const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1AxmyiMhkZOYT_fVKXzT1nBxhBTvxwFTyy4dT696ZERk/export?format=csv'; 

export const fetchPortfolios = async (): Promise<Portfolio[]> => {
  return new Promise((resolve, reject) => {
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
          reject(error);
        }
      });
    };

    if (GOOGLE_SHEET_CSV_URL) {
      fetch(GOOGLE_SHEET_CSV_URL)
        .then(res => res.text())
        .then(text => parseData(text))
        .catch(err => {
          console.error("Failed to fetch from Google Sheets, using mock data", err);
          parseData(MOCK_CSV_DATA);
        });
    } else {
      parseData(MOCK_CSV_DATA);
    }
  });
};
