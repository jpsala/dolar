import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState({
    compra: 0,
    venta: 0,
    fecha: '',
    valor: 0
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
      setState({...state, ...{
        compra: data[0],
        venta: data[1],
        fecha: data[2],
      }})
      setState({...state,...{valor: (state.compra+state.venta)/2}})

    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <>
      <h1>{loading ? 'Loading...' : ''}</h1>
      <h2></h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  )
}

export default App
