import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import 'react-toastify/dist/ReactToastify.css';
import SetAvatar from './pages/SetAvatar';
import GithubAuth from './components/GithubAuth';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/setAvatar' element={<SetAvatar />} />
        <Route path='/' element={<Chat />} />
        <Route path='/auth/github' element={<GithubAuth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App