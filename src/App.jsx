import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Editor from './pages/EditorDungeon.jsx'
import HomePage from './pages/HomePage.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'

function App() {
  function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (err) {
    console.error("Render error:", err);
    return <pre className="text-red-400">{err.message}</pre>;
  }
}

  
  return (
    <>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/editor">Editor</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
  path="/editor"
  element={
    <ErrorBoundary>
      <Editor />
    </ErrorBoundary>
  }
/>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
