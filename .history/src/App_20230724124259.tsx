import { useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)

  useState(() => {
    fetch('https://mercados.ambito.com//dolar/informal/historico-general/2023-06-24/2023-07-24')
    .then(res => res.json())
    .then(data => {
      console.log('data', data)
    })
  }, [])

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
