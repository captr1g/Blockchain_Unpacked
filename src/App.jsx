import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Consensus from './components/Consensus';
import Solidity from './components/Solidity';
import Deployment from './components/Deployment';
import Security from './components/Security';
import Share from './components/Share';
import TokenStandards from './components/TokenStandards';
import DeFi from './components/DeFi';
import Layer2 from './components/Layer2';
import Glossary from './components/Glossary';

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
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
      </Layout>
    </Router>
  );
}

export default App;
