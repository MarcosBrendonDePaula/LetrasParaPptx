import requests
from bs4 import BeautifulSoup

class LyricsScraper:
    def __init__(self):
        self.session = requests.session()
        self.headers = requests.utils.default_headers()
        self.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
        })

    def load_page(self, url=""):
        page = self.session.get(url, headers=self.headers)
        return page.text

    def get_lyrics(self, html):
        try:
            soup = BeautifulSoup(html, 'html.parser')
            name = soup.find(class_="textStyle-primary").get_text().strip()
            lyrics_box = soup.find(class_='lyric-original')
            verses = lyrics_box.findAll('p')
            lyrics = []
            
            for verse in verses:
                lines = []
                for content in verse.contents:
                    if content.name == 'br':
                        continue
                    line = content.strip()
                    if line:  # Only add non-empty lines
                        lines.append(line)
                if lines:  # Only add non-empty verses
                    lyrics.append(lines)
            
            artist = self._extract_artist(soup)
            return {
                'title': name,
                'artist': artist,
                'verses': lyrics
            }
        except Exception as e:
            print(f"Error scraping: {str(e)}")
            return None

    def _extract_artist(self, soup):
        try:
            artist_elem = soup.find(class_="title-content").find(class_='textStyle-secondary')
            if artist_elem:
                return artist_elem.get_text().strip()
        except:
            pass
        return "Artista Desconhecido"
