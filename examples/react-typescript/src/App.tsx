/**
 * Main App Component following moreFRONTend Protocol
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserProfile } from './components/UserProfile';
import { SearchBar } from './components/SearchBar';
import { useAuth } from './hooks/useAuth';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app">
          <header className="header">
            <h1>AI Protocols Demo</h1>
            <nav aria-label="Main navigation">
              <a href="/">Home</a>
              <a href="/profile">Profile</a>
            </nav>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>Built with AI Development Protocols</p>
          </footer>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function HomePage() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  return (
    <div className="page">
      <h2>Search Demo</h2>
      <SearchBar onSearch={handleSearch} placeholder="Search users..." />
    </div>
  );
}

function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div role="status" aria-live="polite">Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="page">
      <h2>User Profile</h2>
      <UserProfile user={user} />
    </div>
  );
}

export default App;
