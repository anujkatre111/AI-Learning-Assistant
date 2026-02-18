import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DocumentListPage from '../pages/Documents/DocumentListPage';
import DocumentDetailPage from '../pages/Documents/DocumentDetailPage';
import FlashCardsPage from '../pages/flashcards/FlashCardsPage';
import FlashcardListPage from '../pages/Flashcards/FlashcardListPage';
import QuizTakePage from '../pages/Quizzes/QuizTakePage';
import QuizzResultPage from '../pages/Quizzes/QuizzResultPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const App = () => {
  const {isAuthenticated, loading} = useAuth();

  if(loading){
    return(
      <div className='flex items-center justify-center h-screen'>
        <p>Loading...</p>
      </div>
    )
  }
  return (
    <Router>
      <Routes>
        <Route path='/' element={isAuthenticated? <Navigate to="/dashboard" replace/> : <Navigate to="/login" replace/>} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>

        {/* Ptotected Routes */}
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/documents" element={<DocumentListPage/>}/>
          <Route path="/documents/:id" element={<DocumentDetailPage/>}/>
          <Route path="/flashcards" element={<FlashcardListPage/>}/>
          <Route path="/documents/:id/flashcards" element={<FlashCardsPage/>}/>
          <Route path="quizzes/:quizzId" element={<QuizTakePage/>}/>
          <Route path="quizzes/:quizzId/results" element={<QuizzResultPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
        </Route>

      </Routes>
    </Router>
  )
}

export default App
