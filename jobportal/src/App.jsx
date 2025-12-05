import './App.css';
import Homepage from './Pages/Homepage';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@mantine/carousel/styles.css';
import AiResumeBuilder from "./Pages/AiResumeBuilder";
import PremiumTemplates from "./Pages/PremiumTemplates";
import PdfExport from "./Pages/PdfExport";
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
import PremiumPage from './Pages/PremiumPage';
import AtsAnalyzer from './Pages/AtsAnalyzer'

// ✅ Correct import
import ProtectedPremium from './Pages/ProtectedPremium';

// ✅ Import ResumeTools
import ResumeTools from "./Pages/ResumeTools";
import ResumeCreator from './Pages/ResumeCreator';

function App() {
  const theme = createTheme({
    colors: {
      "mine-shaft": [
        "#f6f6f6",
        "#e7e7e7",
        "#d1d1d1",
        "#b0b0b0",
        "#888888",
        "#6d6d6d",
        "#5d5d5d",
        "#4f4f4f",
        "#454545",
        "#3d3d3d",
      ],
      "bright-sun": [
        "#fffbeb",
        "#fff3c6",
        "#ffe588",
        "#ffd149",
        "#ffbd20",
        "#f99b07",
        "#dd7302",
        "#b75006",
        "#943c0c",
        "#7a330d",
      ],
    },
    fontFamily: "poppins, sans-serif",
  });

  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <BrowserRouter>
        <Header />
        <VoiceAgent />

        <Routes>
          <Route path="/find-jobs" element={<Findjobs />} />
          <Route path="/find-jobs/:id" element={<Applyjob />} />
          <Route path="/find-talent" element={<FindTalent />} />
          <Route path="/find-talent/user/:id" element={<AdminUserProfile />} />
          <Route path="/ai-resume-builder" element={<ResumeCreator />} />
          <Route path="/premium-templates" element={<PremiumTemplates />} />
          <Route path="/ats-score" element={<AtsAnalyzer />} />
          <Route path="/pdf-export" element={<PdfExport />} />
          <Route path="/resume-generator" element={<ResumeGenerator />} />
          <Route path="/resume-tools" element={ 
            <ProtectedPremium>
              <ResumeTools />
            </ProtectedPremium>
          } />


          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/premium" element={<PremiumPage />} />
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
            }
          />

          <Route path="/about" element={<AboutUs />} />

          {/* Default Route → Homepage */}
          <Route path="*" element={<Homepage />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
