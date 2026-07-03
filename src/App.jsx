import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StockfishProvider } from './context/StockfishContext';
import { Layout } from './components/Layout';
import { OpeningsLayout } from './components/OpeningsLayout';
import { EndgamesLayout } from './components/EndgamesLayout';
import { Home } from './pages/Home';
import { Openings } from './pages/Openings';
import { OpeningsLine } from './pages/OpeningsLine';
import { Endgames } from './pages/Endgames';
import { EndgameDetail } from './pages/EndgameDetail';
import { Coaching } from './pages/Coaching';
import { SignIn } from './pages/SignIn';
import { MemoryLayout } from './components/MemoryLayout';
import { Memory } from './pages/Memory';
import { CoordinateClick } from './pages/memory/CoordinateClick';
import { ColorQuiz } from './pages/memory/ColorQuiz';
import { OpeningQuiz } from './pages/memory/OpeningQuiz';
import { OpeningBoardPractice } from './pages/memory/OpeningBoardPractice';
import { OpeningNotationPractice } from './pages/memory/OpeningNotationPractice';

function App() {
  return (
    <AuthProvider>
    <StockfishProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="openings" element={<OpeningsLayout />}>
          <Route index element={<Openings />} />
          <Route path=":category" element={<Openings />} />
          <Route path=":category/:openingSlug" element={<OpeningsLine />} />
        </Route>
        <Route path="endgames" element={<EndgamesLayout />}>
          <Route index element={<Endgames />} />
          <Route path=":slug" element={<EndgameDetail />} />
        </Route>
        <Route path="memory" element={<MemoryLayout />}>
          <Route index element={<Memory />} />
          <Route path="coordinates" element={<CoordinateClick />} />
          <Route path="color" element={<ColorQuiz />} />
          <Route path="openings" element={<OpeningQuiz />} />
          <Route path="openings-board" element={<OpeningBoardPractice />} />
          <Route path="openings-notation" element={<OpeningNotationPractice />} />
        </Route>
        <Route path="coaching" element={<Coaching />} />
        <Route path="sign-in" element={<SignIn />} />
      </Route>
    </Routes>
    </StockfishProvider>
    </AuthProvider>
  );
}

export default App;
