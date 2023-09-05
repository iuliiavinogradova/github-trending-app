import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RepositoriesList from './Components/RepositoriesList';
import RepositoryDetails from './Components/RepositoryDetails';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Github Trending App</Link></li>
        </ul>
      </nav>
      <div className='container'>
        <Routes>
          <Route exact path="/" element={< RepositoriesList />} />
          <Route path="/repository/:id" element={<RepositoryDetails />} />
          <Route path="/repositories" element={<RepositoriesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
