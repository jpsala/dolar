import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState({
    compra: 0,
    venta: 0,
    fecha: ''
  })
  const format = (val) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val)

  useEffect(() => {
    setLoading(true)
    fetch('https://mercados.ambito.com//dolar/informal/historico-general/2023-06-24/2023-07-24')
    .then(res => res.json())
    .then(data => data[1])
    .then(data => {
      setState({
        compra: data[0],
        venta: data[1],
        fecha: data[2]
      })

    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <>
      <h1>{loading ? 'Loading...' : ''}</h1>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  )
}

export default App
