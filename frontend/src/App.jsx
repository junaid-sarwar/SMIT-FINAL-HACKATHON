import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { ThemeProvider } from "./components/theme-provider"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import Insights from "./pages/Insights"
import Vitals from "./pages/Vitals"
import Home from "./pages/Home"

export default function App() {
  return (
    // <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/vitals" element={<Vitals />} />
        </Routes>
      </Router>
    // </ThemeProvider>
  )
}
