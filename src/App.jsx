import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Consensus from './components/Consensus';
import Solidity from './components/Solidity';
import Deployment from './components/Deployment';
import Security from './components/Security';

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consensus" element={<Consensus />} />
          <Route path="/solidity" element={<Solidity />} />
          <Route path="/deployment" element={<Deployment />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
