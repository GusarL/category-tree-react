import React from 'react';
import CategoryTree from './CategoryTree';
import './App.css';

const App: React.FC = () => {
  return (
      <div className="App">
        <h1>Category Tree</h1>
        <CategoryTree />
      </div>
  );
};

export default App;