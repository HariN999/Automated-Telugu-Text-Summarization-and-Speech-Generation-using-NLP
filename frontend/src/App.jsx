import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './pages/Home';
import TextSummarize from './pages/TextSummarize';
import PasteUrl from './pages/PasteUrl';
import Speak from './pages/Speak';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/summarize" element={<TextSummarize />} />
        <Route path="/url" element={<PasteUrl />} />
        <Route path="/speak" element={<Speak />} />
      </Route>
    </Routes>
  );
}

export default App;