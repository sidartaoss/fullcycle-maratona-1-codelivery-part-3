import "./App.css";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mapping from "./pages/Mapping";

function App() {
  return (
    <SnackbarProvider>
      <BrowserRouter>
        <Routes>
          <Route path={"/orders/:id/mapping"} element={<Mapping />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
