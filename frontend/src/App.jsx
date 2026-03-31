import React from 'react'
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserTodo from './components/UserTodo'

const App = () => {
  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/todolist/:userId" element={<UserTodo/>}/>
          </Routes>
        </BrowserRouter>
  )
}

export default App