import { useEffect, useMemo, useState } from 'react'
import './App.css'
import dayjs from 'dayjs'

function App() {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'USD' | 'ARS'>('USD')
  const [usd, setUsd] = useState(0)
  const [ars, setArs] = useState(0)
  const [state, setState] = useState({ compra: 0, venta: 0, fecha: '', valor: 0 })
  const format = (val: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val)

  const total = useMemo<number>(()=>{
    if(type === 'USD'){
      return state.valor * usd
    } else {
      return ars / state.valor
    }
  }, [type, usd, ars, state.valor])

  useEffect(() => {
    setLoading(true)
    fetch('https://api.bluelytics.com.ar/v2/latest') .then(res => res.json())
      .then(data => {
        const [compra, venta] = [Number(data.blue.value_buy), Number(data.blue.value_sell)]
        const valor = (compra+venta)/2
  
        setState( { fecha: dayjs(data.last_update).format('DD/MMM/YYYY'), compra,  venta, valor })
      }).finally(() => {
        setLoading(false)
      })
      console.log('document.getElementById(ÚSD)', document.getElementById('USD'))
      setTimeout(() => {
        document.getElementById('USD')?.focus()
      }, 500)

  }, [])

  return (
    <>
      <div className="mt-20 border-gray-300 border p-8 rounded-md flex flex-col gap-2 mx-auto" style={{width: '480px'}}>
        {loading && (
          <h1>Loading...</h1>
        )}
        {!loading && (
          <>
            <div>
              <span style={{minWidth: '130px', display: 'inline-block'}}>ValorPromedio:</span>
              {`${format(state.valor)}`} al {`${state.fecha}`}
            </div>
            <div>
              <span style={{minWidth: '130px', display: 'inline-block'}}>Compra:</span>
              {`${format(state.compra)}`}
            </div>
            <div>
              <span style={{minWidth: '130px', display: 'inline-block'}}>Venta:</span>
              {`${format(state.venta)}`}
            </div>
          </>
        )}
        {!loading && (
          <>
            <hr className='mt-2 mb-2'/>
            <div>
              <label htmlFor="USD"  style={{minWidth: '115px', display: 'inline-block'}}>Dolares:</label>
              <input autoFocus id="USD" type="text"  className='ml-3 border border-gray-300 rounded-md p-1'
                autoComplete='off' value={usd === 0 ? '' : usd}
                onChange={e => {
                  setType('USD')
                  setArs(0)
                  setUsd(Number(e.target.value)
              )}}/>
            </div>
            <div>
              <label htmlFor='ARS' style={{minWidth: '115px', display: 'inline-block'}}>Pesos:</label>
              <input id='ARS' type="text" className='ml-3 border border-gray-300 rounded-md p-1'
                autoComplete='off' value={ars === 0 ? '' : ars}
                onChange={e => {
                  setType('ARS')
                  setUsd(0)
                  setArs(Number(e.target.value)
              )}}/>
            </div>
            <hr className='mt-8 mb-2'/>
            <div>
              <span style={{minWidth: '132px', display: 'inline-block'}}>Total:</span>
              <span className='text-lg font-bold'>{format(total)}</span>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
