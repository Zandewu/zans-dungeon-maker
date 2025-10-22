import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Editor from './pages/EditorDungeon.jsx'

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
          <Route path="/" element={<Abcd />}></Route>
          <Route path="/maaf" element={<Maaf />}></Route>
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
