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

  
  function Abcd() {
    return <h1>Halooo</h1>
  }
 function Maaf() {
   return <p className="bg-red-300">Maaf bu, saya tadi ingin coba push project saya ke github pakek termux tetapi ternyata harus pakai termux dari github. saya sudah coba backup folder home dari termux tetapi ada beberapa pesan warning yang tidak saya terlalu pedulikan yang mana ternyata project saya gk ikut ke backup, jadi saya harus nunggu sampai hari senin untuk ngambil project saya di lab 🙏🙏</p>
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
