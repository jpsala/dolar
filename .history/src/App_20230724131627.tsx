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
  const format = (val: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val)

  useEffect(() => {
    setLoading(true)
    fetch('https://mercados.ambito.com//dolar/informal/historico-general/2023-06-24/2023-07-24')
    .then(res => res.json())
    .then(data => data[1])
    .then(data => {
      console.log('data', data[0], data[1].replace(',', '.'), data[2].replace(',', '.'))
      setState({...state, ...{
        fecha: data[0],
        compra: data[1].replace(',', '.'),
        venta: data[2].replace(',', '.'),
        valor: (state.compra+state.venta)/2
      }})
      // setState({...state,...{valor: (state.compra+state.venta)/2}})

    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <>
      <h1>{loading ? 'Loading...' : ''}</h1>
      <h2>{format(state.valor)}</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  )
}

export default App
