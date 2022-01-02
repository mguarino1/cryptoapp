import React, { useState, useEffect, useMemo } from 'react'
import _ from "lodash"
import './App.css'
import { TokenCard } from './components/TokenCard';

export interface TokenProps {
  symbol: string,
  price: number,
  flag: number,
}

function App() {
  
  const [tokenData, setTokenData] = useState<TokenProps[]>([{symbol:'BTC',price:0,flag:0},
                                                            {symbol:'ETH',price:0,flag:0},
                                                            {symbol:'SOL',price:0,flag:0},
                                                            {symbol:'LUNA',price:0,flag:0},
                                                            {symbol:'BNB',price:0,flag:0},
                                                            {symbol:'USDT',price:0,flag:0},
                                                            {symbol:'DOT',price:0,flag:0},
                                                            {symbol:'XRP',price:0,flag:0},
                                                            {symbol:'MATIC',price:0,flag:0},
                                                            {symbol:'ADA',price:0,flag:0},
                                                            {symbol:'SHIB',price:0,flag:0},
                                                            {symbol:'BUSD',price:0,flag:0},
                                                            {symbol:'SAND',price:0,flag:0},
                                                            {symbol:'FTM',price:0,flag:0},
                                                            {symbol:'AVAX',price:0,flag:0},
                                                            {symbol:'SUSHI',price:0,flag:0},
                                                            {symbol:'LINK',price:0,flag:0},
                                                            {symbol:'TRX',price:0,flag:0},
                                                            {symbol:'FIL',price:0,flag:0},
                                                            {symbol:'LTC',price:0,flag:0},
                                                            {symbol:'DOGE',price:0,flag:0},
                                                            {symbol:'AAVE',price:0,flag:0},
                                                            {symbol:'NEAR',price:0,flag:0},
                                                            {symbol:'ANT',price:0,flag:0},
                                                            {symbol:'BCH',price:0,flag:0},
                                                            {symbol:'DASH',price:0,flag:0},
                                                            {symbol:'NEO',price:0,flag:0},
                                                            {symbol:'REQ',price:0,flag:0},]);
  const [chunkSize, setChunkSize] = useState(5)
  const [currentChunk, currentIndex, setCurrentIndex] = usePaginatedData(tokenData, chunkSize);
  const [filter, setFilter] = useState("");
  let bufferData = [...tokenData];
  
  useEffect(() => {
    //API Key goes here
    const ccStreamer = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + apiKey);
    ccStreamer.onopen = function onStreamOpen() {
      const subRequest = {
        "action": "SubAdd",
        "subs": ["5~CCCAGG~BTC~USD", 
                 "5~CCCAGG~ETH~USD", 
                 "5~CCCAGG~SOL~USD", 
                 "5~CCCAGG~LUNA~USD", 
                 "5~CCCAGG~BNB~USD", 
                 "5~CCCAGG~USDT~USD", 
                 "5~CCCAGG~DOT~USD", 
                 "5~CCCAGG~XRP~USD", 
                 "5~CCCAGG~MATIC~USD", 
                 "5~CCCAGG~ADA~USD", 
                 "5~CCCAGG~SHIB~USD", 
                 "5~CCCAGG~BUSD~USD", 
                 "5~CCCAGG~SAND~USD", 
                 "5~CCCAGG~FTM~USD", 
                 "5~CCCAGG~AVAX~USD", 
                 "5~CCCAGG~SUSHI~USD", 
                 "5~CCCAGG~LINK~USD", 
                 "5~CCCAGG~TRX~USD", 
                 "5~CCCAGG~FIL~USD", 
                 "5~CCCAGG~LTC~USD", 
                 "5~CCCAGG~DOGE~USD", 
                 "5~CCCAGG~AAVE~USD", 
                 "5~CCCAGG~NEAR~USD", 
                 "5~CCCAGG~ANT~USD", 
                 "5~CCCAGG~BCH~USD", 
                 "5~CCCAGG~DASH~USD", 
                 "5~CCCAGG~NEO~USD", 
                 "5~CCCAGG~REQ~USD"]
      };
      ccStreamer.send(JSON.stringify(subRequest));
    };

    ccStreamer.onmessage = function onStreamMessage(message) {
      const data = JSON.parse(message.data);
      if(data.TYPE === '5') {
        const token: TokenProps = {
          symbol: data.FROMSYMBOL,
          price: data.PRICE,
          flag: data.FLAGS,
        }
        if(token.price !== undefined) {   
          bufferData = bufferData.map(t => t.symbol === token.symbol ? {...t, price: token.price, flag: token.flag} : t);
        }
      };
    };

    const timerId = setInterval(function() {
      setTokenData(bufferData);
    }, 2000)

    return function cleanup() {
      ccStreamer.close();
      clearInterval(timerId);
    };
  }, []);

  const tokenCount = tokenData.length;
  let buttonCount = _.range(0, (tokenCount / chunkSize));

  function usePaginatedData<T>(data: T[], chunkSize: number) {
    const chunkedData = useMemo(() => _.chunk(data, chunkSize), [data, chunkSize]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentChunk = chunkedData[currentIndex];
    return [currentChunk, currentIndex, setCurrentIndex] as const;
  }

  const handlePage = (e: number) => {
    setCurrentIndex(e);
  }

  const handleChunkSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value);
    setCurrentIndex(0);
    setChunkSize(value);
  }

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = event.target.value.toUpperCase();
    setFilter(newFilter);
  }

  const filterResults = tokenData.filter(
    t =>
      t.symbol.includes(filter)
  );

  return (
    <div className="App">
      <div className="Table">
        <div className="NavBar">
          <div className="buttons">
            <p>Page: {(currentIndex + 1)}</p>
            {buttonCount.map(b => <button key={b} onClick={() => handlePage(b)}>{b+1}</button>)}
          </div>    
          <input type="text" placeholder="Search for token..." onChange={handleFilter}/>
          <label>Items per page: 
            <select value={chunkSize.toString()} onChange={handleChunkSize}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
        {filter === "" ? currentChunk.map(t => <TokenCard {...t} key={t.symbol} />) : filterResults.map(t => <TokenCard {...t} key={t.symbol} />)}
      </div>
    </div>
  )
}

export default App
