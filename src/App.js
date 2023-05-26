import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import { ProvideAuth, RequireAuth } from './hooks/use-auth';
import MyMap from "./components/MyMap";
import UtilBar from "./components/UtilBar";
import Home from './pages/Home';
import CreateForm from './components/CreateForm';
import LoginForm from './components/LoginForm';
import Vote from './components/Vote';

function App() {
  return (
    <div className="App">
        <MyMap />
        <ProvideAuth >
          <Routes>
            <Route path='login' element={<LoginForm />} />
            <Route path='' element={<RequireAuth> <Home /> </RequireAuth>} />
            <Route path='new-decision' element={<RequireAuth> <CreateForm /> </RequireAuth>} />
            <Route path='vote/:decisionId' element={<RequireAuth> <Vote /> </RequireAuth>} />
          </Routes>
          <UtilBar />
        </ProvideAuth>
    </div>
  );
}

export default App;
