import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import './App.css';

type Rate = {
  value_buy: number;
  value_sell: number;
  value_avg: number;
};

type BlueApiResponse = {
  oficial: Rate;
  blue: Rate;
  oficial_euro: Rate;
  blue_euro: Rate;
  last_update: string;
};

type DolarApiResponse = {
  compra: number;
  venta: number;
  fechaActualizacion: string;
};

type AmbitoApiResponse = {
  compra: string;
  venta: string;
  fecha: string;
  variacion: string;
  classVariacion: string;
  valor_cierre_ant: string;
};

type DolarsiCasa = {
  compra: string;
  venta: string;
  nombre: string;
  // include other fields if necessary
};

type DolarsiApiResponse = Array<{ casa: DolarsiCasa }>;

type ApiResponseType = BlueApiResponse | DolarApiResponse | AmbitoApiResponse | DolarsiApiResponse

type ExchangeRate = {
  compra: number;
  venta: number;
  fecha: string;
  valor: number;
};

type EndpointConfig = {
  label: string;
  url: string;
  parseData: (data: ApiResponseType) => ExchangeRate;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState<number>(0);
  const [type, setType] = useState<'USD' | 'ARS'>('USD');
  const [amountUSD, setAmountUSD] = useState<string>('');
  const [amountARS, setAmountARS] = useState<string>('');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const endpoints: EndpointConfig[] = [
    {
      label: 'Ambito Financiero',
      url: 'https://mercados.ambito.com//dolar/informal/variacion',
      parseData: (data: ApiResponseType): ExchangeRate => {
        if ('compra' in data && 'venta' in data && typeof data.compra === 'string' && typeof data.venta === 'string' && 'fecha' in data) {
          return {
            compra: parseFloat(data.compra.replace(',', '.')),
            venta: parseFloat(data.venta.replace(',', '.')),
            fecha: data.fecha,
            valor: (parseFloat(data.compra.replace(',', '.')) + parseFloat(data.venta.replace(',', '.'))) / 2
          };
        }
        throw new Error("Data does not match AmbitoApiResponse structure");
      }
    },
    {
      label: 'BlueLytics',
      url: 'https://api.bluelytics.com.ar/v2/latest',
      parseData: (data: ApiResponseType): ExchangeRate => {
        if ('blue' ! in data) {
          return {
            compra: data.blue.value_buy,
            venta: data.blue.value_sell,
            fecha: dayjs(data.last_update).format('DD/MMM/YYYY'),
            valor: data.blue.value_avg
          };
        }
        throw new Error("Data does not match BlueApiResponse structure");
      }
    },
    {
      label: 'DolarAPI',
      url: 'https://dolarapi.com/v1/dolares/blue',
      parseData: (data: ApiResponseType): ExchangeRate => {
        if ('compra' in data && 'venta' in data && 'fechaActualizacion' in data) {
          return {
            compra: data.compra,
            venta: data.venta,
            fecha: dayjs(data.fechaActualizacion).format('DD/MMM/YYYY'),
            valor: (data.compra + data.venta) / 2
          };
        }
        throw new Error("Data does not match DolarApiResponse structure");
      }
    },
    // {
    //   label: 'DolarSi',
    //   url: 'https://www.dolarsi.com/api/api.php?type=valoresprincipales',
    //   parseData: (data: ApiResponseType): ExchangeRate => {
    //     const dolarBlueData = Array.isArray(data) ? data.find(item => item.casa.nombre === "Dolar Blue")?.casa : null
  
    //     if (dolarBlueData) {
    //       return {
    //         compra: parseFloat(dolarBlueData.compra.replace('.', '').replace(',', '.')),
    //         venta: parseFloat(dolarBlueData.venta.replace('.', '').replace(',', '.')),
    //         fecha: '', // The API response doesn't include a date field for Dolar Blue
    //         valor: (parseFloat(dolarBlueData.compra.replace('.', '').replace(',', '.')) + parseFloat(dolarBlueData.venta.replace(',', '.'))) / 2
    //       };
    //     }
  
    //     throw new Error("Dolar Blue data not found in DolarsiApiResponse structure");
    //   }
    // },
    
  ];
  
  useEffect(() => {
    let isMounted = true;
    setLoading(endpoints.length);
    const newExchangeRates: ExchangeRate[] = [];

    endpoints.forEach((endpoint, index) => {
      fetch(endpoint.url)
        .then(res => res.json())
        .then((data: ApiResponseType) => {
          if (isMounted) {
            newExchangeRates[index] = endpoint.parseData(data);
            if (index === endpoints.length - 1) {
              setExchangeRates(newExchangeRates);
            }
          }
        })
        .catch(e => {
          console.error(`Error fetching data from ${endpoint.url}:`, e);
        })
        .finally(() => {
          if (isMounted) {
            setLoading((prev: number) => prev - 1);
          }
        });
    });

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  const calculateTotal = (valor: number) => {
    const amount = type === 'USD' ? amountUSD : amountARS;
    const numericAmount = parseFloat(amount) || 0;
    const total = type === 'USD' ? (numericAmount * valor) : (numericAmount / valor);
    return total;
  };

  useEffect(() => {
    console.log('amountUSD:', amountUSD, 'type:', type);
  }, [amountUSD, type]);

  return (
    <>
      <div className="mt-10 border-gray-300 border p-8 rounded-md flex flex-col gap-2 mx-auto" style={{width: '480px'}}>
        {loading ? (
          <h1>Loading....</h1>
        ) : (
          <>
            <h1 className='font-bold text-2xl'>Dolares JP</h1>
            <hr className='mt-2 mb-2'/>
            <div>
              <label htmlFor="USD" style={{minWidth: '115px', display: 'inline-block'}}>Dólares:</label>
              <input autoFocus={true} autoComplete='off' id="USD" type="text" className='ml-3 border border-gray-300 rounded-md p-1'
                value={amountUSD}
                onChange={e => {
                  setType('USD');
                  setAmountUSD(e.target.value);
                  setAmountARS('');
                }}/>
            </div>
            <div>
              <label htmlFor="USD" style={{minWidth: '115px', display: 'inline-block'}}>Pesos:</label>
              <input autoFocus={true} autoComplete='off' id="USD" type="text" className='ml-3 border border-gray-300 rounded-md p-1'
                value={amountARS}
                onChange={e => {
                  setType('ARS');
                  setAmountARS(e.target.value);
                  setAmountUSD('');
                }}/>
            </div>
            <hr className='mt-2 mb-2'/>

            {exchangeRates.map((rate, index) => (
              <div key={index}>
                <span className='text-md font-bold mb-3'>
                  {endpoints[index].label} al {rate.fecha}
                </span>
                <div className='flex flex-col'>
                  <div className='flex w-full'>
                    <span className='text-sm font-bold w-[120px] text-right'>Compra</span>
                    <span className='text-sm font-bold w-[120px] text-right'>Venta</span>
                    <span className='text-sm font-bold w-[120px] text-right'>Promedio</span>
                    <span className='text-sm font-bold w-[120px] text-right'>Total</span>
                  </div>
                  <div className='flex w-full'>
                    <span className='text-sm w-[120px] text-right'>{formatCurrency(rate.compra)}</span>
                    <span className='text-sm w-[120px] text-right'>{formatCurrency(rate.venta)}</span>
                    <span className='text-sm w-[120px] text-right'>{formatCurrency(rate.valor)}</span>
                    <span className='text-sm w-[120px] text-right'>{formatCurrency(calculateTotal(rate.valor))}</span>
                  </div>
                </div>
                <hr className='mt-2 mb-2'/>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default App;
