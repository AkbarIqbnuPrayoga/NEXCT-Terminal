'use client';

import { useEffect, useState } from 'react';
import TopBar from '@/components/TopBar';
import MarketOverview from '@/components/MarketOverview';
import NewsFeed from '@/components/NewsFeed';
import FearGreedIndex from '@/components/FearGreedIndex';
import TopGainersLosers from '@/components/TopGainersLosers';
import OnChainAnalytics from '@/components/OnChainAnalytics';
import OnChainTransactions from '@/components/OnChainTransactions';
import NotificationModal from '@/components/NotificationModal';
import ResearchPage from '@/components/ResearchPage';
import LearningPage from '@/components/LearningPage';
import SubmissionsPage from '@/app/submissions/page';
import { useHotkeys } from '@/hooks/useHotkeys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faMinus, faSignal, faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function proxiedImageSrc(url: string) {
  const raw = String(url || '');
  if (!raw) return '';
  // Only proxy ImgBB images; leave other sources untouched.
  if (/^https:\/\/(?:i\.ibb\.co|ibb\.co|image\.ibb\.co)\//i.test(raw)) {
    return `/api/image-proxy?url=${encodeURIComponent(raw)}`;
  }
  return raw;
}

// Dummy data for trading signals
const dummyTradingSignals = [
  {
    _id: 'data1',
    asset: 'BTC/USDT',
    signal: 'LONG',
    author: 'MalamProfit',
    conviction: 8,
    signalStatus: 'Running',
    entry: '$67,000 - $68,000',
    stopLoss: '$65,000',
    takeProfit1: '$70,000',
    takeProfit2: '$75,000',
    takeProfit3: '$80,000',
    imageUrl: 'https://cdn.odzre.my.id/niz.png',
    reasoning: 'Strong support level with bullish divergence on RSI',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'data2',
    asset: 'ETH/USDT',
    signal: 'LONG',
    author: 'TraderMuda',
    conviction: 6,
    signalStatus: 'Running',
    entry: '$1,950 - $1,980',
    stopLoss: '$1,900',
    takeProfit1: '$2,050',
    takeProfit2: '$2,150',
    takeProfit3: '$2,200',
    imageUrl: 'https://cdn.odzre.my.id/rdt.png',
    reasoning: 'Strong support level with bullish divergence on RSI',
    createdAt: new Date().toISOString()
  }
];

// Dummy data for market updates
const dummyMarketUpdates = [
  {
    _id: 'data1',
    title: 'Bitcoin ETF Inflows Surge to $1.2B Weekly',
    content: 'Institutional interest continues to grow as Bitcoin ETFs see record inflows this week. BlackRock and Fidelity lead the pack with combined inflows exceeding $800M.',
    author: 'MasriFX',
    imageUrl: 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    type: 'analysis'
  },
  {
    _id: 'data2',
    title: 'Ethereum Layer 2 TVL Hits All-Time High',
    content: 'Total Value Locked in Ethereum Layer 2 solutions reaches new ATH of $45B, driven by Arbitrum and Optimism growth. Base chain also shows strong momentum.',
    author: 'Defi Insider',
    imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    type: 'analysis'
  }
];

// Dummy data for research updates
const dummyResearchData = {
  research: [
    {
      _id: 'data1',
      title: 'Order flow and cryptocurrency returns',
      description: 'This study examines the information content of order flow on cryptocurrency returns.',
      author: 'Kucing Malam',
      tags: ['Order-Flow', 'Market Cycles', 'Halving', 'Machine Learning'],
      link: 'https://www.sciencedirect.com/science/article/pii/S1386418126000029',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'data2',
      title: 'Analyzing the Economic Impact of Decentralization on Users',
      description: 'This study models the final price paid by users of decentralized ledgers as a result of a two-stage game between miners and users.',
      author: 'GOLD$1',
      tags: ['Blockchain', 'Cryptocurrency', 'Decentralization', 'Equilibrium' 'Analysis', 'Tullock'],
      link: 'https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ITCS.2026.93',
      createdAt: new Date().toISOString()
    }
  ]
};

export default function Home() {
  const [activeModule, setActiveModule] = useState<string>('market');
  
  // Notification modal state
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info' | 'loading',
    title: '',
    message: ''
  });

  // Fetch market data for trading signals
  const { data: marketData } = useSWR('/api/global-market', fetcher, { refreshInterval: 60000 });

  // Fetch current user (for submissions author)
  const { data: meData } = useSWR('/api/auth/me', fetcher);

  // Allow deep-linking to a specific module, e.g. /?module=news
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const mod = sp.get('module');
    if (!mod) return;
    const allowed = new Set(['market', 'news', 'onchain', 'research', 'learning', 'submissions']);
    if (allowed.has(mod) && mod !== activeModule) {
      setActiveModule(mod);
    }
    // Only run on initial load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch trading signals from database or use dummy data
  const { data: tradingSignalsData } = useSWR('/api/trading-signals', fetcher, { refreshInterval: 60000 });
  
  // Fetch market updates from database or use dummy data
  const { data: marketUpdatesData } = useSWR('/api/market-update', fetcher, { refreshInterval: 60000 });

  // Fetch research papers from database or use dummy data
  const { data: researchData } = useSWR('/api/research', fetcher, { refreshInterval: 300000 });

  // Transform trading signals data for UI - combine API data with dummy data
  const apiSignals = (tradingSignalsData?.data || []).map((signal: any) => ({
    ...signal,
    icon: signal.signal === 'LONG' ? faArrowUp : faArrowDown,
    color: signal.signal === 'LONG' ? 'text-terminal-success' : 'text-terminal-danger',
    direction: signal.signal,
    strength: `Author: ${signal.author}`,
    reason: `Conviction: ${signal.conviction}/10`,
    status: signal.signalStatus || 'Running',
    entry: signal.entry,
    sl: signal.stopLoss,
    tp1: signal.takeProfit1,
    tp2: signal.takeProfit2,
    tp3: signal.takeProfit3
  }));

  // Combine API signals with dummy signals
  const tradingSignals = [...apiSignals, ...dummyTradingSignals.map(signal => ({
    ...signal,
    icon: signal.signal === 'LONG' ? faArrowUp : faArrowDown,
    color: signal.signal === 'LONG' ? 'text-terminal-success' : 'text-terminal-danger',
    direction: signal.signal,
    strength: `Author: ${signal.author}`,
    reason: `Conviction: ${signal.conviction}/10`,
    status: signal.signalStatus,
    entry: signal.entry,
    sl: signal.stopLoss,
    tp1: signal.takeProfit1,
    tp2: signal.takeProfit2,
    tp3: signal.takeProfit3
  }))];

  // Combine API market updates with dummy data
  const apiMarketUpdates = marketUpdatesData?.data || [];
  const marketUpdates = {
    data: [...apiMarketUpdates, ...dummyMarketUpdates]
  };

  // Combine API research with dummy data
  const apiResearch = researchData?.research || [];
  const combinedResearchData = {
    research: [...apiResearch, ...dummyResearchData.research]
  };

  // Notification helper function
  const showNotification = (type: 'success' | 'error' | 'warning' | 'info' | 'loading', title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'market':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Market Overview */}
            <div className="lg:col-span-2 space-y-4">
              <MarketOverview />
              <TopGainersLosers />
              
              {/* Trading Signals */}
              <div className="bg-terminal-bg rounded-lg p-4 border border-terminal-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-terminal-accent flex items-center">
                    <FontAwesomeIcon icon={faSignal} className="w-4 h-4 mr-2" />
                    Trading Signals
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Selalu ingat bahwa trading futures memiliki risiko yang sangat tinggi. Seluruh chart, analisis, atau pandangan yang saya bagikan bukan merupakan ajakan atau saran investasi. Semua hanyalah hasil dari analisis pribadi yang bisa saja salah.<br/><br/>
                  Profit maupun kerugian menjadi tanggung jawab masing-masing trader.<br/>
                  Pastikan selalu menggunakan Risk Management yang baik dan tidak pernah menggunakan dana yang kamu tidak siap kehilangannya.
                </p>
                {tradingSignals.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {tradingSignals.map((signal: any, index: number) => (
                      <div key={index} className="bg-terminal-panel rounded-lg p-3 border border-terminal-border flex-shrink-0 w-64">
                        <div className="text-sm font-medium text-terminal-accent mb-1">{signal.asset}</div>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`flex items-center space-x-1 text-xs ${signal.color}`}>
                            <FontAwesomeIcon icon={signal.icon} className="w-3 h-3" />
                            <span className="font-semibold">{signal.signal}</span>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            signal.status === 'Running' ? 'bg-green-500/20 text-green-400' :
                            signal.status === 'Wait' ? 'bg-yellow-500/20 text-yellow-400' :
                            signal.status === 'SL' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {signal.status}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mb-1">{signal.strength}</div>
                        <div className="text-xs text-gray-500 mb-3">{signal.reason}</div>
                        
                        {/* Analysis Image */}
                        {signal.imageUrl && (
                          <div className="mb-3">
                            <img 
                              src={signal.imageUrl} 
                              alt="Signal Analysis"
                              className="w-full h-24 object-cover rounded border border-terminal-border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Trading Details */}
                        <div className="border-t border-terminal-border pt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Entry:</span>
                            <span className="text-terminal-accent font-medium">{signal.entry}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">SL:</span>
                            <span className="text-terminal-danger font-medium">{signal.sl}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">TP 1:</span>
                            <span className="text-terminal-success font-medium">{signal.tp1}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">TP 2:</span>
                            <span className="text-terminal-success font-medium">{signal.tp2}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">TP 3:</span>
                            <span className="text-terminal-success font-medium">{signal.tp3}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-8">
                    No trading signals available.
                  </div>
                )}
              </div>
              
              {/* Market Update */}
              <div className="bg-terminal-bg rounded-lg p-4 border border-terminal-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-terminal-accent flex items-center">
                    <FontAwesomeIcon icon={faSignal} className="w-4 h-4 mr-2" />
                    Market Update
                  </h3>
                </div>
                
                {Array.isArray(marketUpdates?.data) && marketUpdates.data.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {marketUpdates.data.map((update: any, index: number) => {
                      const updateId = update?._id ?? update?.id;
                      const Wrapper: any = updateId ? Link : 'div';
                      const wrapperProps = updateId
                        ? {
                            href: `/market-update/${encodeURIComponent(String(updateId))}`,
                          }
                        : {};

                      return (
                      <Wrapper
                        key={updateId || index}
                        {...wrapperProps}
                        className="bg-terminal-panel rounded-lg border border-terminal-border flex-shrink-0 w-80 overflow-hidden hover:border-terminal-accent transition-colors"
                      >
                        {/* Header */}
                        <div className="p-3 border-b border-terminal-border">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-terminal-accent rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-black">
                                {update.author?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-terminal-accent">
                                {update.author || 'Anonymous'}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(update.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Image */}
                        {update.imageUrl ? (
                          <div className="aspect-[16/9] bg-terminal-bg overflow-hidden">
                            <img 
                              src={proxiedImageSrc(update.imageUrl)} 
                              alt={update.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[16/9] bg-terminal-bg flex items-center justify-center">
                            <div className="text-center">
                              <FontAwesomeIcon icon={faSignal} className="w-8 h-8 text-terminal-accent mb-1" />
                              <div className="text-xs text-gray-400">Market Analysis</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="p-3">
                          <div className="mb-3">
                            <div className="text-sm font-semibold text-terminal-accent mb-2">
                              {update.title}
                            </div>
                            <div className="text-xs text-gray-300 leading-relaxed">
                              {update.content.length > 150 
                                ? `${update.content.substring(0, 150)}...` 
                                : update.content
                              }
                            </div>
                          </div>
                          
                          {/* Engagement */}
                          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-terminal-border pt-2">
                            <div className="flex space-x-3">
                              <span>Market Update</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(update.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      </Wrapper>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-8">
                    No market updates available.
                  </div>
                )}
              </div>
              
              {/* Research Update */}
              <div className="bg-terminal-bg rounded-lg p-4 border border-terminal-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-terminal-accent flex items-center">
                    <FontAwesomeIcon icon={faSignal} className="w-4 h-4 mr-2" />
                    Research Update
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">
                      {combinedResearchData ? `${combinedResearchData?.research?.length || 0} papers` : 'Loading...'}
                    </div>
                  </div>
                </div>
                {!combinedResearchData ? (
                  <div className="text-center text-gray-400 text-sm py-4">
                    <div className="animate-pulse">Loading research papers...</div>
                  </div>
                ) : combinedResearchData?.research?.length > 0 ? (
                  <div className="space-y-3">
                    {combinedResearchData.research.slice(0, 3).map((research: any, index: number) => (
                      <div key={research._id || index} className="bg-terminal-panel rounded-lg p-3 border border-terminal-border">
                        <div className="text-sm font-medium text-terminal-accent mb-2">
                          📊 {research.title}
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          By {research.author} • {new Date(research.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {research.description 
                            ? (research.description.length > 120 
                                ? `${research.description.substring(0, 120)}...` 
                                : research.description)
                            : 'No description available'
                          }
                        </div>
                        {research.tags && research.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {research.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                              <span key={tagIndex} className="text-xs bg-terminal-accent/10 text-terminal-accent px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-terminal-border">
                          <div className="text-xs text-gray-400">
                            Research Paper
                          </div>
                          <a 
                            href={research.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-terminal-accent hover:text-terminal-accent/80 transition-colors"
                          >
                            Read more →
                          </a>
                        </div>
                      </div>
                    ))}
                    {combinedResearchData.research.length > 3 && (
                      <div className="text-center pt-2">
                        <a 
                          href="#research"
                          onClick={() => setActiveModule('research')}
                          className="text-xs text-terminal-accent hover:text-terminal-accent/80 cursor-pointer"
                        >
                          View all {combinedResearchData.research.length} research papers →
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-8">
                    <div className="mb-2">📚</div>
                    <div className="font-medium mb-1">No research papers yet</div>
                    <div className="text-xs">
                      Research papers will appear here when available.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Fear & Greed Index and News */}
            <div className="space-y-4">
              <FearGreedIndex />
              
              {/* Season Index */}
              <div className="terminal-panel">
                <h2 className="terminal-header">🌊 Season Index</h2>
                
                {/* Calculate season index based on BTC dominance */}
                {marketData?.data && (() => {
                  const btcDom = marketData.data.market_cap_percentage.btc;
                  const isAltSeason = btcDom < 45;
                  const isBtcSeason = btcDom > 55;
                  
                  return (
                    <div className="space-y-3">
                      {/* Season Indicator */}
                      <div className="text-center">
                        <div className={`text-lg font-bold ${isAltSeason ? 'text-green-400' : isBtcSeason ? 'text-orange-400' : 'text-yellow-400'}`}>
                          {isAltSeason ? '🌊 Altcoin Season' : isBtcSeason ? '₿ Bitcoin Season' : '⚖️ Neutral'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          BTC Dominance: {btcDom.toFixed(2)}%
                        </div>
                      </div>

                      {/* Season Meter */}
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>Alt Season</span>
                          <span>Neutral</span>
                          <span>BTC Season</span>
                        </div>
                        <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 relative">
                          <div 
                            className="absolute top-0 h-2 w-1 bg-white rounded-full transform -translate-x-1/2 shadow-lg"
                            style={{ left: `${btcDom}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                          <span>0%</span>
                          <span>45%</span>
                          <span>55%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Season Analysis */}
                      <div className="bg-terminal-bg rounded-lg p-3 border border-terminal-border">
                        <div className="text-xs text-gray-400 mb-2">Analysis:</div>
                        <div className="text-xs text-gray-500">
                          {isAltSeason 
                            ? "Altcoins showing relative strength. Consider allocating to high-conviction alt projects."
                            : isBtcSeason
                            ? "Bitcoin dominance increasing. Focus on BTC accumulation and reduced alt exposure."
                            : "Market in balance. Maintain diversified portfolio across BTC and major alts."
                          }
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <NewsFeed />
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <NewsFeed />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <FearGreedIndex />
              <MarketOverview />
            </div>
          </div>
        );

      case 'onchain':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <OnChainAnalytics />
            <OnChainTransactions />
          </div>
        );

      case 'research':
        return <ResearchPage />;

      case 'learning':
        return <LearningPage />;

      case 'submissions':
        return <SubmissionsPage />;

      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <MarketOverview />
              <TopGainersLosers />
            </div>
            <div className="space-y-4">
              <FearGreedIndex />
              <NewsFeed />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar activeModule={activeModule} setActiveModule={setActiveModule} />

      <main className="flex-1 p-4 space-y-4">
        {renderActiveModule()}
      </main>

      <SiteFooter/>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
}