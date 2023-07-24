import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('https://mercados.ambito.com//dolar/informal/historico-general/2023-06-24/2023-07-24')
    .then(res => res.json())
    .then(data => {
      console.log('data', data)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <>
      <h1>{loading ? 'Loading...' : ''}</h1>
    </>
  )
}

export default App
