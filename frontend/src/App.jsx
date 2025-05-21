import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Catalog from "./pages/Catalog.jsx";
import BookPage from "./pages/BookPage.jsx";
import ExchangePage from "./pages/ExchangePage.jsx";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Field} from "formik";
import Preferences from "./pages/Preferences.jsx";
import Setup from "./pages/Setup.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();



  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
            <Route path="/" element={<HomePage /> } />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/catalog" element={<Catalog/>} />
            <Route path='/exchange' element={authUser ? <ExchangePage /> : <Navigate to="/login" />} />
            <Route path="/catalog/:id" element={<BookPage/>} />
            <Route path="/preferences" element={authUser ? <Preferences /> : <Navigate to="/login" />}/>
            <Route path='/setup' element={<Setup/>}/>
        </Routes>
        </LocalizationProvider>


      <Toaster />
    </div>
  );
};
export default App;
