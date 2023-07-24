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
  const [cant, setCant] = useState(1)
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
        console.log('data', data)
        const compra = Number(data[1].replace(',', '.'))
        const venta = Number(data[2].replace(',', '.'))
        const valor = (compra+venta)/2
        setState( {
          fecha: data[0],
          compra ,
          venta ,
          valor 
        })
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <h1>{loading ? 'Loading...' : `Promedio: ${format(state.valor)}`}</h1>
      <pre>Total: {format(cant*state.valor)}</pre>
      <h2>
        <label>Cantidad:&nbsp;
          <input type="text" autoFocus value={cant} onChange={e => setCant(Number(e.target.value))} />
        </label>
      </h2>
    </>
  )
}

export default App
