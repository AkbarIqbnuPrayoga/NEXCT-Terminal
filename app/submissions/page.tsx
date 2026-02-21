'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBitcoin,
  faEthereum,
  faDollarSign,
  faRefresh,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faStar,
  faFire,
  faSearch,
  faFilter,
  faCoins,
  faCircle,
  faSquare
} from '@fortawesome/free-solid-svg-icons';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  signal: 'long' | 'short' | 'neutral';
  signalStrength: number; // 0-100
  isFavorite: boolean;
  trending: boolean;
}

export default function CoinMarketPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSignal, setFilterSignal] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Generate 100+ dummy coins
  const generateCoins = (): Coin[] => {
    const coinNames = [
      { name: 'Bitcoin', symbol: 'BTC' },
      { name: 'Ethereum', symbol: 'ETH' },
      { name: 'Gold', symbol: 'XAUUSD' },
      { name: 'Binance Coin', symbol: 'BNB' },
      { name: 'Solana', symbol: 'SOL' },
      { name: 'Cardano', symbol: 'ADA' },
      { name: 'XRP', symbol: 'XRP' },
      { name: 'Polkadot', symbol: 'DOT' },
      { name: 'Dogecoin', symbol: 'DOGE' },
      { name: 'Shiba Inu', symbol: 'SHIB' },
      { name: 'Avalanche', symbol: 'AVAX' },
      { name: 'Chainlink', symbol: 'LINK' },
      { name: 'Polygon', symbol: 'MATIC' },
      { name: 'Litecoin', symbol: 'LTC' },
      { name: 'Bitcoin Cash', symbol: 'BCH' },
      { name: 'Stellar', symbol: 'XLM' },
      { name: 'Uniswap', symbol: 'UNI' },
      { name: 'ApeCoin', symbol: 'APE' },
      { name: 'Near Protocol', symbol: 'NEAR' },
      { name: 'Algorand', symbol: 'ALGO' },
      { name: 'Filecoin', symbol: 'FIL' },
      { name: 'Tezos', symbol: 'XTZ' },
      { name: 'EOS', symbol: 'EOS' },
      { name: 'Monero', symbol: 'XMR' },
      { name: 'Aave', symbol: 'AAVE' },
      { name: 'Cosmos', symbol: 'ATOM' },
      { name: 'Fantom', symbol: 'FTM' },
      { name: 'Hedera', symbol: 'HBAR' },
      { name: 'VeChain', symbol: 'VET' },
      { name: 'Theta', symbol: 'THETA' },
      { name: 'Tron', symbol: 'TRX' },
      { name: 'Dai', symbol: 'DAI' },
      { name: 'Elrond', symbol: 'EGLD' },
      { name: 'Axie Infinity', symbol: 'AXS' },
      { name: 'The Sandbox', symbol: 'SAND' },
      { name: 'Decentraland', symbol: 'MANA' },
      { name: 'Gala', symbol: 'GALA' },
      { name: 'Flow', symbol: 'FLOW' },
      { name: 'Chiliz', symbol: 'CHZ' },
      { name: 'Enjin Coin', symbol: 'ENJ' },
      { name: 'Basic Attention', symbol: 'BAT' },
      { name: 'Zcash', symbol: 'ZEC' },
      { name: 'Dash', symbol: 'DASH' },
      { name: 'Compound', symbol: 'COMP' },
      { name: 'SushiSwap', symbol: 'SUSHI' },
      { name: 'Curve DAO', symbol: 'CRV' },
      { name: '1inch', symbol: '1INCH' },
      { name: 'Yearn Finance', symbol: 'YFI' },
      { name: 'Maker', symbol: 'MKR' },
      { name: 'Synthetix', symbol: 'SNX' },
      { name: 'Olympus', symbol: 'OHM' },
      { name: 'Klaytn', symbol: 'KLAY' },
      { name: 'Celo', symbol: 'CELO' },
      { name: 'Harmony', symbol: 'ONE' },
      { name: 'IOST', symbol: 'IOST' },
      { name: 'Waves', symbol: 'WAVES' },
      { name: 'NEM', symbol: 'XEM' },
      { name: 'IOTA', symbol: 'MIOTA' },
      { name: 'Ontology', symbol: 'ONT' },
      { name: 'Qtum', symbol: 'QTUM' },
      { name: 'Zilliqa', symbol: 'ZIL' },
      { name: 'Ravencoin', symbol: 'RVN' },
      { name: 'Horizen', symbol: 'ZEN' },
      { name: 'Decred', symbol: 'DCR' },
      { name: 'Siacoin', symbol: 'SC' },
      { name: 'Storj', symbol: 'STORJ' },
      { name: 'Arweave', symbol: 'AR' },
      { name: 'Ankr', symbol: 'ANKR' },
      { name: 'Fetch.ai', symbol: 'FET' },
      { name: 'Ocean Protocol', symbol: 'OCEAN' },
      { name: 'Cortex', symbol: 'CTXC' },
      { name: 'Nano', symbol: 'NANO' },
      { name: 'DigiByte', symbol: 'DGB' },
      { name: 'Verge', symbol: 'XVG' },
      { name: 'Steem', symbol: 'STEEM' },
      { name: 'Hive', symbol: 'HIVE' },
      { name: 'Lisk', symbol: 'LSK' },
      { name: 'Ark', symbol: 'ARK' },
      { name: 'Stratis', symbol: 'STRAX' },
      { name: 'Syscoin', symbol: 'SYS' },
      { name: 'Reddcoin', symbol: 'RDD' },
      { name: 'Peercoin', symbol: 'PPC' },
      { name: 'Namecoin', symbol: 'NMC' },
      { name: 'Novacoin', symbol: 'NVC' },
      { name: 'Feathercoin', symbol: 'FTC' },
      { name: 'Terra Classic', symbol: 'LUNC' },
      { name: 'TerraUSD', symbol: 'USTC' },
      { name: 'Kava', symbol: 'KAVA' },
      { name: 'Band Protocol', symbol: 'BAND' },
      { name: 'Cartesi', symbol: 'CTSI' },
      { name: 'API3', symbol: 'API3' },
      { name: 'Orchid', symbol: 'OXT' },
      { name: 'Keep Network', symbol: 'KEEP' },
      { name: 'NuCypher', symbol: 'NU' },
      { name: 'Mask Network', symbol: 'MASK' },
      { name: 'Rally', symbol: 'RLY' },
      { name: 'XYO', symbol: 'XYO' },
      { name: 'Chromia', symbol: 'CHR' },
      { name: 'COTI', symbol: 'COTI' },
      { name: 'Dent', symbol: 'DENT' },
      { name: 'Civic', symbol: 'CVC' }
    ];

    return coinNames.map((coin, index) => {
      // Generate random price based on coin type
      let basePrice = Math.random() * 1000;
      if (coin.symbol === 'BTC') basePrice = 68000 + (Math.random() * 5000 - 2500);
      else if (coin.symbol === 'ETH') basePrice = 1960 + (Math.random() * 400 - 200);
      else if (coin.symbol === 'XAUUSD') basePrice = 5100 + (Math.random() * 50 - 25);
      else if (coin.symbol === 'BNB') basePrice = 85 + (Math.random() * 40 - 20);
      else if (coin.symbol === 'SOL') basePrice = 50 + (Math.random() * 20 - 10);
      
      const change = (Math.random() * 20) - 10; // -10% to +10%
      const signal = change > 2 ? 'long' : change < -2 ? 'short' : 'neutral';
      const signalStrength = Math.floor(Math.random() * 100);
      
      return {
        id: `${coin.symbol}-${index}`,
        name: coin.name,
        symbol: coin.symbol,
        price: Number(basePrice.toFixed(coin.symbol === 'BTC' ? 2 : 4)),
        change24h: Number(change.toFixed(2)),
        volume24h: Math.floor(Math.random() * 1000000000) + 1000000,
        marketCap: Math.floor(Math.random() * 100000000000) + 100000000,
        signal,
        signalStrength,
        isFavorite: Math.random() > 0.8,
        trending: Math.random() > 0.85
      };
    });
  };

  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCoins(generateCoins());
      setLastUpdated(new Date());
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter coins
  const filteredCoins = coins.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSignal = filterSignal ? coin.signal === filterSignal : true;
    const matchesFavorite = showFavoritesOnly ? coin.isFavorite : true;
    return matchesSearch && matchesSignal && matchesFavorite;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstItem, indexOfLastItem);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'long': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'short': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'long': return faArrowUp;
      case 'short': return faArrowDown;
      default: return faChartLine;
    }
  };

  // Ganti dengan icon dari solid icons
  const getCoinIcon = (symbol: string) => {
    switch (symbol) {
      case 'BTC': return faBitcoin;
      case 'ETH': return faEthereum;
      case 'XAUUSD': return faCoins;
      default: return faDollarSign;
    }
  };

  // Warna background untuk icon
  const getCoinIconColor = (symbol: string) => {
    switch (symbol) {
      case 'BTC': return 'bg-orange-500/20 text-orange-400';
      case 'ETH': return 'bg-blue-500/20 text-blue-400';
      case 'XAUUSD': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'BTC' || symbol === 'ETH' || symbol === 'XAUUSD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="terminal-panel mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="terminal-header text-xl sm:text-2xl">📊 Crypto Market</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Live prices and trading signals for 100+ cryptocurrencies
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-terminal-accent text-black font-medium rounded hover:bg-terminal-accent/80 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              <FontAwesomeIcon icon={faRefresh} className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-terminal-bg rounded-lg border border-terminal-border p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-medium text-terminal-accent mb-1 sm:mb-2">Search</label>
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              <input
                type="text"
                placeholder="Search by name or symbol..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 sm:pl-10 pr-3 py-1.5 sm:py-2 text-sm bg-terminal-panel border border-terminal-border rounded text-terminal-accent placeholder-gray-500 focus:outline-none focus:border-terminal-accent"
              />
            </div>
          </div>

          {/* Signal Filter */}
          <div>
            <label className="block text-xs font-medium text-terminal-accent mb-1 sm:mb-2">Signal</label>
            <select
              value={filterSignal}
              onChange={(e) => {
                setFilterSignal(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 sm:py-2 text-sm bg-terminal-panel border border-terminal-border rounded text-terminal-accent focus:outline-none focus:border-terminal-accent"
            >
              <option value="">All Signals</option>
              <option value="long">Long Only</option>
              <option value="short">Short Only</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          {/* Favorites Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                setCurrentPage(1);
              }}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded font-medium transition-colors text-sm flex items-center justify-center space-x-2 ${
                showFavoritesOnly 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-terminal-panel border border-terminal-border text-terminal-accent hover:border-terminal-accent'
              }`}
            >
              <FontAwesomeIcon icon={faStar} className={`w-3 h-3 sm:w-4 sm:h-4 ${showFavoritesOnly ? 'text-black' : ''}`} />
              <span>Favorites</span>
            </button>
          </div>
        </div>
      </div>

      {/* Coins Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {loading ? (
          <div className="terminal-panel p-8 text-center">
            <div className="text-terminal-accent">Loading market data...</div>
          </div>
        ) : currentCoins.length === 0 ? (
          <div className="terminal-panel p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400 mb-4">No coins match your filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSignal('');
                setShowFavoritesOnly(false);
              }}
              className="text-terminal-accent hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          currentCoins.map((coin) => (
            <div
              key={coin.id}
              className="bg-terminal-bg border border-terminal-border rounded-lg p-3 sm:p-4 hover:border-terminal-accent/50 transition-all hover:shadow-lg hover:shadow-terminal-accent/5"
            >
              {/* Mobile Layout (default) */}
              <div className="block sm:hidden">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCoinIconColor(coin.symbol)}`}>
                      <FontAwesomeIcon icon={getCoinIcon(coin.symbol)} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-terminal-accent">{coin.symbol}</span>
                        {coin.trending && (
                          <FontAwesomeIcon icon={faFire} className="text-orange-400 w-3 h-3" />
                        )}
                        {coin.isFavorite && (
                          <FontAwesomeIcon icon={faStar} className="text-yellow-400 w-3 h-3" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{coin.name}</div>
                    </div>
                  </div>
                  
                  {/* Signal Badge - Mobile */}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getSignalColor(coin.signal)}`}>
                    <FontAwesomeIcon icon={getSignalIcon(coin.signal)} className="w-2 h-2" />
                    <span className="uppercase">{coin.signal}</span>
                    <span className="text-[10px] opacity-75">({coin.signalStrength}%)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <div className="text-xs text-gray-500">Price</div>
                    <div className="font-mono text-sm text-terminal-accent">
                      {formatPrice(coin.price, coin.symbol)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">24h Change</div>
                    <div className={`font-mono text-sm ${
                      coin.change24h > 0 ? 'text-green-400' : 
                      coin.change24h < 0 ? 'text-red-400' : 
                      'text-gray-400'
                    }`}>
                      {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Volume: </span>
                    <span className="text-terminal-accent">{formatLargeNumber(coin.volume24h)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Market Cap: </span>
                    <span className="text-terminal-accent">{formatLargeNumber(coin.marketCap)}</span>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                {/* Coin Info */}
                <div className="col-span-3 flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCoinIconColor(coin.symbol)}`}>
                    <FontAwesomeIcon icon={getCoinIcon(coin.symbol)} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-terminal-accent">{coin.symbol}</span>
                      {coin.trending && (
                        <FontAwesomeIcon icon={faFire} className="text-orange-400 w-3 h-3" />
                      )}
                      {coin.isFavorite && (
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 w-3 h-3" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{coin.name}</div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">Price</div>
                  <div className="font-mono text-terminal-accent">
                    {formatPrice(coin.price, coin.symbol)}
                  </div>
                </div>

                {/* 24h Change */}
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">24h Change</div>
                  <div className={`font-mono ${
                    coin.change24h > 0 ? 'text-green-400' : 
                    coin.change24h < 0 ? 'text-red-400' : 
                    'text-gray-400'
                  }`}>
                    {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                  </div>
                </div>

                {/* Volume / Market Cap */}
                <div className="col-span-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Vol: </span>
                      <span className="text-terminal-accent">{formatLargeNumber(coin.volume24h)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">MCap: </span>
                      <span className="text-terminal-accent">{formatLargeNumber(coin.marketCap)}</span>
                    </div>
                  </div>
                </div>

                {/* Signal */}
                <div className="col-span-2">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium border inline-flex items-center space-x-2 ${getSignalColor(coin.signal)}`}>
                    <FontAwesomeIcon icon={getSignalIcon(coin.signal)} className="w-3 h-3" />
                    <span className="uppercase">{coin.signal}</span>
                    <span className="text-[10px] opacity-75">({coin.signalStrength}%)</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-4 sm:mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-terminal-panel border border-terminal-border rounded disabled:opacity-50 hover:border-terminal-accent transition-colors text-sm"
            >
              Previous
            </button>
            <span className="text-xs sm:text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-terminal-panel border border-terminal-border rounded disabled:opacity-50 hover:border-terminal-accent transition-colors text-sm"
            >
              Next
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="text-xs text-center text-gray-500 mt-4">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCoins.length)} of {filteredCoins.length} coins
        </div>
      </div>
    </div>
  );
}