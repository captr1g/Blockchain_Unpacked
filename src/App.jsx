import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./components/Home'));
const Consensus = lazy(() => import('./components/Consensus'));
const Solidity = lazy(() => import('./components/Solidity'));
const Deployment = lazy(() => import('./components/Deployment'));
const Security = lazy(() => import('./components/Security'));
const Share = lazy(() => import('./components/Share'));
const TokenStandards = lazy(() => import('./components/TokenStandards'));
const DeFi = lazy(() => import('./components/DeFi'));
const Layer2 = lazy(() => import('./components/Layer2'));
const Glossary = lazy(() => import('./components/Glossary'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/consensus" element={<Consensus />} />
            <Route path="/solidity" element={<Solidity />} />
            <Route path="/tokens" element={<TokenStandards />} />
            <Route path="/defi" element={<DeFi />} />
            <Route path="/deployment" element={<Deployment />} />
            <Route path="/security" element={<Security />} />
            <Route path="/layer2" element={<Layer2 />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/share" element={<Share />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
