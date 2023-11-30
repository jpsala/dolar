import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import './App.css'

function App() {
  const [loading, setLoading] = useState(0)
  const [type, setType] = useState<'USD' | 'ARS'>('USD')
  const [usd1, setUsd1] = useState('')
  const [ars1, setArs1] = useState('')
  const [usd2, setUsd2] = useState('')
  const [ars2, setArs2] = useState('')
  const [usd3, setUsd3] = useState('')
  const [ars3, setArs3] = useState('')
  const [state, setState] = useState({ compra: 0, venta: 0, fecha: '', valor: 0 })
  const [state2, setState2] = useState({ compra: 0, venta: 0, fecha: '', valor: 0 })
  const [state3, setState3] = useState({ compra: 0, venta: 0, fecha: '', valor: 0 })
  const format = (val: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val)
  const total1 = useMemo<string>(()=>{
    if(type === 'USD'){
      return String(Number(usd1.toString().slice(-1) === '.' ? usd1 + '0' : usd1) * state.valor)
    } else {
      return String(Number(ars1.toString().slice(-1) === '.' ? ars1 + '0' : ars1) / state.valor)
    }
  }, [type, usd1, ars1, state.valor])

  const total2 = useMemo<string>(()=>{
    if(type === 'USD'){
      return String(Number(usd2.toString().slice(-1) === '.' ? usd2 + '0' : usd2) * state2.valor)
    } else {
      return String(Number(ars2.toString().slice(-1) === '.' ? ars2 + '0' : ars2) / state2.valor)
    }
  }, [type, usd2, ars2, state2.valor])

  const total3 = useMemo<string>(()=>{
    if(type === 'USD'){
      return String(Number(usd3.toString().slice(-1) === '.' ? usd3 + '0' : usd3) * state3.valor)
    } else {
      return String(Number(ars3.toString().slice(-1) === '.' ? ars3 + '0' : ars3) / state3.valor)
    }
  }, [type, usd3, ars3, state3.valor])

  useEffect(() => {

    setLoading(val => val+ 1)
    fetch('https://api.bluelytics.com.ar/v2/latest') .then(res => res.json())
    .then(data => {
      const [compra, venta] = [Number(data.blue.value_buy), Number(data.blue.value_sell)]
      const valor = (compra+venta)/2
      setState( { fecha: dayjs(data.last_update).format('DD/MMM/YYYY'), compra,  venta, valor })
    }).catch((e) => {
      console.log('error https://api.bluelytics.com.ar/v2/latest', e.toString())
    }).finally(() => {
      setLoading(val => val - 1)
    })
    
    setLoading(val => val+ 1)
    fetch('https://dolarapi.com/v1/dolares/blue') .then(res => res.json())
    .then(data => {
      const [compra, venta] = [Number(data.compra), Number(data.venta)]
      const valor = (compra+venta)/2
      setState2( { fecha: dayjs(data.fechaActualizacion).format('DD/MMM/YYYY'), compra,  venta, valor })
    }).catch((e) => {
      console.log('error https://dolarapi.com/v1/dolares/blue', e.toString())
    }).finally(() => {
      setLoading(val => val - 1)
    })

    setLoading(val => val+ 1)
    fetch('https://api.bluelytics.com.ar/v2/latest') .then(res => res.json())
    .then(data => {
      console.log('data', data)
      const [compra, venta] = [Number(data.blue.value_buy), Number(data.blue.value_sell)]
      setState3( { fecha: dayjs(data.last_update).format('DD/MMM/YYYY'),
        compra,  
        venta,
        valor: data.blue.value_avg 
      })
    }).catch((e) => {
       console.log(e.toString());
      console.log('error https://api.bluelytics.com.ar/v2/latest', e.toString())
    }).finally(() => {
      setLoading(val => val - 1)
    })
  }, [])

  return (
    <>
      <div className="mt-10 border-gray-300 border p-8 rounded-md flex flex-col gap-2 mx-auto" style={{width: '480px'}}>
        {loading && (
          <h1>Loading....</h1>
          )}
        {!(loading) && (
          <>
            <h1 className='font-bold text-2xl'>Dolares JP</h1>
            <hr className='mt-2 mb-2'/>
            <div>
              <label htmlFor="USD"  style={{minWidth: '115px', display: 'inline-block'}}>Dolares:</label>
              <input autoFocus={true} autoComplete='off' id="USD" type="text"  className='ml-3 border border-gray-300 rounded-md p-1'
                value={usd1}
                onChange={e => {
                  setType('USD')
                  setArs1('')
                  setArs2('')
                  setArs3('')
                  setUsd1(e.target.value)
                  setUsd2(e.target.value)
                  setUsd3(e.target.value)
              }}/>
            </div>
            <div>
              <label htmlFor='ARS' style={{minWidth: '115px', display: 'inline-block'}}>Pesos:</label>
              <input id='ARS' type="text" className='ml-3 border border-gray-300 rounded-md p-1'
                autoComplete='off' value={ars1}
                onChange={e => {
                  setType('ARS')
                  setUsd1('')
                  setUsd2('')
                  setUsd3('')
                  setArs1(e.target.value)
                  setArs2(e.target.value)
                  setArs3(e.target.value)
              }}/>
            </div>
            <hr className='mt-2 mb-2'/>
            <span className='text-md font-bold mb-3'>
              api.bluelytics.com.ar al {`${state.fecha}`}
            </span>
            <div className='flex flex-col'>
              <div className='flex w-full'>
                <span className='text-sm font-bold w-[120px] text-right'>Compra</span>
                <span className='text-sm font-bold w-[120px] text-right'>Venta</span>
                <span className='text-sm font-bold w-[120px] text-right'>Promedio</span>
                <span className='text-sm font-bold w-[120px] text-right'>Total</span>
              </div>
              <div className='flex w-full'>
                <span className='text-sm w-[120px] text-right'>{format(state.compra)}</span>
                <span className='text-sm w-[120px] text-right'>{format(state.venta)}</span>
                <span className='text-sm w-[120px] text-right'>{format(state.valor)}</span>
                <span className='text-sm w-[120px] text-right'>{format(Number(total1))}</span>
              </div>
            </div>
            <div className='ml-auto'>
                <span style={{minWidth: '132px', display: 'inline-block'}}>Total:</span>
                <span className='text-lg font-bold'>{format(Number(total1))}</span>
              </div>

            <hr className='mt-2 mb-2'/>
              
            <span className='text-md font-bold mb-3'>
              Dolarapi.com al {state2.fecha}
            </span>
            <div className='flex flex-col'>
              <div className='flex w-full'>
                <span className='text-sm font-bold w-[120px] text-right'>Compra</span>
                <span className='text-sm font-bold w-[120px] text-right'>Venta</span>
                <span className='text-sm font-bold w-[120px] text-right'>Promedio</span>
                <span className='text-sm font-bold w-[120px] text-right'>Total</span>
              </div>
              <div className='flex w-full'>
                <span className='text-sm w-[120px] text-right'>{format(state2.compra)}</span>
                <span className='text-sm w-[120px] text-right'>{format(state2.venta)}</span>
                <span className='text-sm w-[120px] text-right'>{format(state2.valor)}</span>
                <span className='text-sm w-[120px] text-right'>{format(Number(total2))}</span>
              </div>
            </div>
            <div className='ml-auto'>
              <span style={{minWidth: '132px', display: 'inline-block'}}>Total:</span>
              <span className='text-lg font-bold'>{format(Number(total2))}</span>
            </div>

            <hr className='mt-2 mb-2'/>
              
            <span className='text-md font-bold mb-3'>
            api.bluelytics.com.ar {state2.fecha}
            </span>
            <div className='flex flex-col'>
              <div className='flex w-full'>
                <span className='text-sm font-bold w-[120px] text-right'>Compra</span>
                <span className='text-sm font-bold w-[120px] text-right'>Venta</span>
                <span className='text-sm font-bold w-[120px] text-right'>Promedio</span>
                <span className='text-sm font-bold w-[120px] text-right'>Total</span>
              </div>
              <div className='flex w-full'>
                <span className='text-sm w-[120px] text-right'>{format(state3.compra)}</span>
                <span className='text-sm w-[120px] text-right'>{format(state3.venta)}</span>
                <span className='text-sm w-[120px] text-right'>{format(state3.valor)}</span>
                <span className='text-sm w-[120px] text-right'>{format(Number(total3))}</span>
              </div>
            </div>
            <div className='ml-auto'>
              <span style={{minWidth: '132px', display: 'inline-block'}}>Total:</span>
              <span className='text-lg font-bold'>{format(Number(total3))}</span>
            </div>
          </>
        )}
      </div>
    </>
    )
}

export default App
