import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Insights } from './pages/Insights';
import { Library } from './pages/Library';
import { DeepAnalysis } from './pages/DeepAnalysis';
import { DSASimulator } from './pages/DSASimulator';
import { CustomSimulator } from './pages/CustomSimulator';
import { VocabBuilder } from './pages/VocabBuilder';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="insights" element={<Insights />} />
            <Route path="library" element={<Library />} />
            <Route path="analysis" element={<DeepAnalysis />} />
            <Route path="dsa-simulator" element={<DSASimulator />} />
            <Route path="custom-simulator" element={<CustomSimulator />} />
            <Route path="vocab-builder" element={<VocabBuilder />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
