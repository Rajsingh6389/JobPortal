import './App.css'
import Homepage from './Pages/Homepage'
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@mantine/core/styles.css';
// ‼️ import carousel styles after core package styles
import '@mantine/carousel/styles.css';
import Findjobs from './Pages/Findjobs';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import FindTalent from './Pages/FindTalent';
import Applyjob from './Pages/Applyjob';
import SignupPage from './Pages/SignupPage';
import LoginPage from './Pages/LoginPage';
import ProfilePage from './Pages/ProfilePage';
import Unauthorized from './Pages/Unauthorized';
import AdminUploadJob from './Pages/AdminUploadJob';
import ProtectedAdminRoute from './LandingPage/ProtectedAdminRoute';
import AdminApplications from './Pages/AdminApplications';
import AdminUserProfile from './Pages/AdminUserProfile';
import VoiceAgent from './Pages/VoiceAgent';
import ResumeGenerator from './Pages/ResumeGenerator';
import AboutUs from './Pages/AboutUs';

function App() {
  const theme = createTheme({
    colors: {
      "mine-shaft": [
        "#f6f6f6", // 0 → 50
        "#e7e7e7", // 1 → 100
        "#d1d1d1", // 2 → 200
        "#b0b0b0", // 3 → 300
        "#888888", // 4 → 400
        "#6d6d6d", // 5 → 500
        "#5d5d5d", // 6 → 600
        "#4f4f4f", // 7 → 700
        "#454545", // 8 → 800
        "#3d3d3d", // 9 → 900
      ],

      "bright-sun": [
        "#fffbeb", // 0 → 50
        "#fff3c6", // 1 → 100
        "#ffe588", // 2 → 200
        "#ffd149", // 3 → 300
        "#ffbd20", // 4 → 400
        "#f99b07", // 5 → 500
        "#dd7302", // 6 → 600
        "#b75006", // 7 → 700
        "#943c0c", // 8 → 800
        "#7a330d", // 9 → 900
      ],
    },
    fontFamily: "poppins,sens-serif"

  });


  return (
    <MantineProvider defaultColorScheme='dark' theme={theme}>
      <BrowserRouter>
        <Header />
        <VoiceAgent />
        <Routes>
          <Route path="/find-jobs" element={<Findjobs />} />
          <Route path="/find-jobs/:id" element={<Applyjob />} />
          <Route path='/find-talent' element={<FindTalent />} />
          <Route path='/find-talent/user/:id' element={<AdminUserProfile />} />
          <Route path='/resume-generator' element={<ResumeGenerator />}/>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/upload-job"
            element={
              <ProtectedAdminRoute>
                <AdminUploadJob />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedAdminRoute>
                <AdminApplications />
              </ProtectedAdminRoute>
            }/>
        

          <Route path='about' element={<AboutUs />}/>
          <Route path="*" element={<Homepage />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </MantineProvider>
  )
}

export default App;
