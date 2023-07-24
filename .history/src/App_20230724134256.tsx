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
    fetch('https://api.bluelytics.com.ar/v2/latest')
      .then(res => res.json())
      .then(data => {
        console.log('data', data)
        return data
      })
      .then(data => {
        console.log('data', data)
        const compra = Number(data.blue.value_buy)
        const venta = Number(data.blue.value_sell)
        const valor = (compra+venta)/2
        setState( {
          fecha: data.last_update,
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
      <div className="container" style={{display: 'flex', flexDirection: 'column', gap:  '10px', margin: '20px'}}>
      {loading && (
        <h1>Loading...</h1>
      )}
      {!loading && (
        <>
          <h1>{`${format(state.valor)}`} al {`${state.fecha}`}</h1>
          <h2>Compra: {`${format(state.compra)}`}</h2>
          <h2>Venta: {`${format(state.venta)}`}</h2>
        </>
      )}
      <hr/>
      <h2>
        <label>Cantidad:&nbsp;
          <input type="text" autoFocus value={cant} onChange={e => setCant(Number(e.target.value))} />
        </label>
      </h2>
      <pre>Total: {format(cant*state.valor)}</pre>
      </div>
    </>
  )
}

export default App
