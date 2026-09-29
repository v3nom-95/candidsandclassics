import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { PortfolioList } from './pages/PortfolioList';
import { PortfolioDetail } from './pages/PortfolioDetail';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { WeddingFilms } from './pages/WeddingFilms';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<PortfolioList />} />
          <Route path="portfolio/weddings" element={<PortfolioList />} />
          <Route path="portfolio/kids-photography" element={<PortfolioList />} />
          <Route path="portfolio/everyday-joys" element={<PortfolioList />} />
          <Route path="portfolio/wedding-films" element={<WeddingFilms />} />
          <Route path="portfolio/:category/:clientName" element={<PortfolioDetail />} />
          <Route path="portfolio/:clientName" element={<PortfolioDetail />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
