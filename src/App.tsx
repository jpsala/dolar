import { useEffect, useMemo, useState } from 'react'
import './App.css'
import dayjs from 'dayjs'

function App() {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'USD' | 'ARS'>('USD')
  const [usd, setUsd] = useState('')
  const [ars, setArs] = useState('')
  const [state, setState] = useState({ compra: 0, venta: 0, fecha: '', valor: 0 })
  const format = (val: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val)
  const total = useMemo<string>(()=>{
    if(type === 'USD'){
      return String(Number(usd.toString().slice(-1) === '.' ? usd + '0' : usd) * state.valor)
    } else {
      return String(Number(ars.toString().slice(-1) === '.' ? ars + '0' : ars) / state.valor)
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
              <input autoFocus={true} autoComplete='off' id="USD" type="text"  className='ml-3 border border-gray-300 rounded-md p-1'
                value={usd}
                onChange={e => {
                  setType('USD')
                  setArs('')
                  setUsd(e.target.value)
              }}/>
            </div>
            <div>
              <label htmlFor='ARS' style={{minWidth: '115px', display: 'inline-block'}}>Pesos:</label>
              <input id='ARS' type="text" className='ml-3 border border-gray-300 rounded-md p-1'
                autoComplete='off' value={ars}
                onChange={e => {
                  setType('ARS')
                  setUsd('')
                  setArs(e.target.value)
              }}/>
            </div>
            <hr className='mt-8 mb-2'/>
            <div>
              <span style={{minWidth: '132px', display: 'inline-block'}}>Total:</span>
              <span className='text-lg font-bold'>{format(Number(total))}</span>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
