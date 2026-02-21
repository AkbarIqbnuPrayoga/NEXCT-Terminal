'use client';

import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, 
  faNewspaper, 
  faCubes, 
  faBook,
  faGraduationCap,
  faSignal,
  faBars,
  faTimes,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import packageJson from '../package.json';
import { usePathname, useRouter } from 'next/navigation';
import { useHotkeys } from '@/hooks/useHotkeys';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TopBarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export default function TopBar({ activeModule, setActiveModule }: TopBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Set isClient to true when component mounts (to avoid hydration issues)
  useEffect(() => {
    setIsClient(true);
  }, []);

  function goToModule(moduleId: string) {
    if (pathname === '/' || pathname === '' || pathname == null) {
      setActiveModule(moduleId);
      return;
    }
    router.push(`/?module=${encodeURIComponent(moduleId)}`);
  }

  useHotkeys([
    { key: 'Alt+1', action: () => goToModule('market') },
    { key: 'Alt+2', action: () => goToModule('news') },
    { key: 'Alt+3', action: () => goToModule('onchain') },
    { key: 'Alt+4', action: () => goToModule('submissions') },
    { key: 'Alt+5', action: () => goToModule('research') },
    { key: 'Alt+6', action: () => goToModule('learning') },
  ]);

  // Fetch real news data
  const { data: newsData } = useSWR('/api/news', fetcher, { refreshInterval: 300000 }); // 5 minutes

  // Fetch Gate.io currency data
  const { data: coinData } = useSWR('/api/coin-prices', fetcher, { refreshInterval: 60000 }); // 1 minute

  const modules = [
    { id: 'market', label: 'Market Data', icon: faChartLine, hotkey: 'ALT+1' },
    { id: 'news', label: 'News', icon: faNewspaper, hotkey: 'ALT+2' },
    { id: 'onchain', label: 'On-Chain', icon: faCubes, hotkey: 'ALT+3' },
    { id: 'submissions', label: 'Crypto Market', icon: faList, hotkey: 'ALT+4' },
    { id: 'research', label: 'Research', icon: faBook, hotkey: 'ALT+5' },
    { id: 'learning', label: 'Learning', icon: faGraduationCap, hotkey: 'ALT+6' },
  ];

  return (
    <header className="bg-terminal-panel border-b border-terminal-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-xl md:text-2xl font-bold">
              <span className="text-terminal-accent glow-accent">NEXCT</span>
              <span className="text-terminal-text ml-1">TERMINAL</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 hidden sm:block">v{packageJson.version}</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => goToModule(module.id)}
                className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeModule === module.id
                    ? 'bg-terminal-accent text-terminal-bg'
                    : 'text-gray-400 hover:text-terminal-text hover:bg-terminal-bg'
                }`}
                title={module.hotkey}
              >
                <FontAwesomeIcon icon={module.icon} className="w-4 h-4" />
                <span className="hidden lg:inline">{module.label}</span>
                <span className="text-xs opacity-60 hidden xl:inline">{module.hotkey}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-terminal-accent transition-colors"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-terminal-border pt-4">
            <nav className="flex flex-col space-y-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => {
                    goToModule(module.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                    activeModule === module.id
                      ? 'bg-terminal-accent text-terminal-bg'
                      : 'text-gray-400 hover:text-terminal-text hover:bg-terminal-bg'
                  }`}
                >
                  <FontAwesomeIcon icon={module.icon} className="w-4 h-4" />
                  <span>{module.label}</span>
                  <span className="text-xs opacity-60 ml-auto">{module.hotkey}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Breaking News Ticker - FIXED FOR MOBILE */}
      <div className="bg-terminal-bg border-t border-terminal-border overflow-hidden w-full">
        <div className="flex items-center px-4 py-2">
          <span className="text-terminal-danger font-bold text-xs uppercase flex-shrink-0 mr-4">Breaking</span>
          <div className="overflow-hidden flex-1 relative" style={{ height: '24px' }}>
            {isClient && (
              <div className="absolute whitespace-nowrap ticker-animation" style={{ animation: 'ticker 40s linear infinite' }}>
                {newsData?.results?.slice(0, 8).map((article: any, index: number) => (
                  <span key={index} className="inline-block text-sm text-gray-400 mr-8">
                    {article.title}
                  </span>
                ))}
                {newsData?.results?.slice(0, 8).map((article: any, index: number) => (
                  <span key={`repeat-${index}`} className="inline-block text-sm text-gray-400 mr-8">
                    {article.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coin Prices Ticker - FIXED FOR MOBILE */}
      <div className="bg-terminal-bg border-t border-terminal-border overflow-hidden w-full">
        <div className="flex items-center px-4 py-2">
          <FontAwesomeIcon icon={faSignal} className="w-4 h-4 text-terminal-accent flex-shrink-0 mr-4" />
          <div className="overflow-hidden flex-1 relative" style={{ height: '28px' }}>
            {isClient && coinData?.success ? (
              <div className="absolute whitespace-nowrap ticker-animation" style={{ animation: 'ticker 35s linear infinite' }}>
                {coinData.data.map((coin: any, index: number) => (
                  <div key={index} className="inline-flex items-center space-x-2 mr-6">
                    <img
                      src={coin.image}
                      alt={coin.symbol}
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span className="text-sm whitespace-nowrap">
                      <span className="text-gray-300">{coin.symbol.toUpperCase()}:</span>
                      <span className="text-terminal-accent ml-1">
                        ${(coin.current_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`ml-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({coin.price_change_percentage_24h >= 0 ? '+' : ''}{(coin.price_change_percentage_24h || 0).toFixed(2)}%)
                      </span>
                    </span>
                  </div>
                ))}
                {coinData.data.map((coin: any, index: number) => (
                  <div key={`repeat-${index}`} className="inline-flex items-center space-x-2 mr-6">
                    <img
                      src={coin.image}
                      alt={coin.symbol}
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span className="text-sm whitespace-nowrap">
                      <span className="text-gray-300">{coin.symbol.toUpperCase()}:</span>
                      <span className="text-terminal-accent ml-1">
                        ${(coin.current_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`ml-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({coin.price_change_percentage_24h >= 0 ? '+' : ''}{(coin.price_change_percentage_24h || 0).toFixed(2)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-400">Loading coin prices...</div>
            )}
          </div>
        </div>
      </div>

      {/* Add keyframe animations in a style tag */}
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .ticker-animation {
          display: inline-flex;
          animation: ticker 40s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        
        .ticker-animation:hover {
          animation-play-state: paused;
        }
        
        /* Mobile optimization */
        @media (max-width: 768px) {
          .ticker-animation {
            animation-duration: 35s;
          }
        }
      `}</style>
    </header>
  );
}