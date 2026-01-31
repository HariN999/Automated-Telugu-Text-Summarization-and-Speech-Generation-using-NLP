import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/home";
import Speak from "./pages/Speak";
import PasteUrl from "./pages/PasteUrl";
import TextSummarize from "./pages/Textsummarize";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/speak" element={<Speak />} />
        <Route path="/paste-url" element={<PasteUrl />} />
        <Route path="/paste-text" element={<TextSummarize />} />
      </Route>
    </Routes>
  );
}

export default App;