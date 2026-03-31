import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ConfigGate from './components/ConfigGate';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigGate>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* 其他路由将在后续添加 */}
              </Routes>
            </Layout>
          </div>
        </Router>
      </ConfigGate>
    </QueryClientProvider>
  );
}

export default App;

