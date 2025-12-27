import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssignmentListPage from './pages/AssignmentListPage';
import AssignmentAttemptPage from './pages/AssignmentAttemptPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './styles/global.scss';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AssignmentListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assignment/:id" 
          element={
            <ProtectedRoute>
              <AssignmentAttemptPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
