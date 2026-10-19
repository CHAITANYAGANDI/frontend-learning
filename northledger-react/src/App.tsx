import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";

function App(){

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage/>
          </ProtectedRoute>
        }/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element = {<NotFoundPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;