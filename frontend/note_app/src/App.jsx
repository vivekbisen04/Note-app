import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

const routes=(
  <Router>
    <Routes>
        <Route path='/dashboard' excat element={<Home/>}/>
        <Route path='/' excat element={<Login/>}/>
        <Route path='/signup' excat element={<Signup/>}/>
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div className=''>
      {routes}
    </div>
  )
}

export default App