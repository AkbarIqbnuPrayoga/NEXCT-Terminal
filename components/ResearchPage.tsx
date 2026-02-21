'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignal, faFilePdf, faExternalLinkAlt, faCalendar, faUser, faTag } from '@fortawesome/free-solid-svg-icons';

interface ResearchItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pdfUrl?: string;
  author: string;
  category: string;
  date: string;
  tags: string[];
  readTime: string;
  citations?: number;
  institution?: string;
}

export default function ResearchPage() {
  const [researchData, setResearchData] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Generate 20 dummy research items
  useEffect(() => {
    const dummyResearch: ResearchItem[] = [
      {
        id: '1',
        title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
        description: 'The original Bitcoin whitepaper by Satoshi Nakamoto introducing the concept of decentralized digital currency.',
        link: 'https://bitcoin.org/bitcoin.pdf',
        pdfUrl: 'https://bitcoin.org/bitcoin.pdf',
        author: 'Satoshi Nakamoto',
        category: 'Blockchain Fundamentals',
        date: '2008-10-31',
        tags: ['bitcoin', 'whitepaper', 'cryptocurrency'],
        readTime: '15 min',
        citations: 12453,
        institution: 'Bitcoin Foundation'
      },
      {
        id: '2',
        title: 'Ethereum: A Next-Generation Smart Contract Platform',
        description: 'Ethereum whitepaper introducing smart contracts and decentralized applications.',
        link: 'https://ethereum.org/en/whitepaper/',
        author: 'Vitalik Buterin',
        category: 'Smart Contracts',
        date: '2013-11-27',
        tags: ['ethereum', 'smart contracts', 'dapps'],
        readTime: '20 min',
        citations: 8976,
        institution: 'Ethereum Foundation'
      },
      {
        id: '3',
        title: 'DeFi and the Future of Finance',
        description: 'Comprehensive analysis of decentralized finance protocols and their impact on traditional banking.',
        link: 'https://research.defi.org/future-of-finance',
        pdfUrl: 'https://research.defi.org/future-of-finance.pdf',
        author: 'Hayden Adams',
        category: 'DeFi',
        date: '2024-01-15',
        tags: ['defi', 'lending', 'yield farming'],
        readTime: '25 min',
        citations: 234,
        institution: 'Uniswap Labs'
      },
      {
        id: '4',
        title: 'Layer 2 Scaling Solutions: A Comparative Analysis',
        description: 'Technical deep dive into various Layer 2 scaling solutions including Rollups, State Channels, and Plasma.',
        link: 'https://l2research.org/scaling-solutions',
        author: 'Stani Kulechov',
        category: 'Scaling',
        date: '2024-02-20',
        tags: ['layer2', 'scaling', 'rollups'],
        readTime: '18 min',
        citations: 156,
        institution: 'Aave'
      },
      {
        id: '5',
        title: 'Zero-Knowledge Proofs in Blockchain',
        description: 'Implementation of ZK-proofs for privacy and scaling in blockchain networks.',
        link: 'https://zkresearch.org/zk-proofs',
        pdfUrl: 'https://zkresearch.org/zk-proofs.pdf',
        author: 'Barry Whitehat',
        category: 'Privacy',
        date: '2024-03-05',
        tags: ['zkp', 'privacy', 'cryptography'],
        readTime: '30 min',
        citations: 89,
        institution: 'ZK Sync'
      },
      {
        id: '6',
        title: 'Cross-Chain Interoperability Protocols',
        description: 'Analysis of different cross-chain communication protocols and bridge architectures.',
        link: 'https://interop.xyz/cross-chain',
        author: 'Emin Gün Sirer',
        category: 'Interoperability',
        date: '2024-01-28',
        tags: ['interoperability', 'bridges', 'cross-chain'],
        readTime: '22 min',
        citations: 167,
        institution: 'Avalanche'
      },
      {
        id: '7',
        title: 'MEV: Extraction and Mitigation Strategies',
        description: 'Study of Maximal Extractable Value in blockchain networks and proposed solutions.',
        link: 'https://mevresearch.org/extraction',
        author: 'Flashbots Team',
        category: 'MEV',
        date: '2024-02-10',
        tags: ['mev', 'ethereum', 'arbitrage'],
        readTime: '20 min',
        citations: 345,
        institution: 'Flashbots'
      },
      {
        id: '8',
        title: 'Staking Economics in Proof-of-Stake Networks',
        description: 'Economic analysis of staking mechanisms and validator incentives.',
        link: 'https://stakingresearch.org/economics',
        author: 'Lido Research',
        category: 'Staking',
        date: '2024-03-12',
        tags: ['staking', 'pos', 'economics'],
        readTime: '15 min',
        citations: 78,
        institution: 'Lido DAO'
      },
      {
        id: '9',
        title: 'DAO Governance Models',
        description: 'Comparative study of different DAO governance structures and voting mechanisms.',
        link: 'https://daoresearch.org/governance',
        author: 'Coopahtroopa',
        category: 'DAO',
        date: '2024-01-05',
        tags: ['dao', 'governance', 'voting'],
        readTime: '20 min',
        citations: 234,
        institution: 'Bankless DAO'
      },
      {
        id: '10',
        title: 'NFT Market Dynamics and Valuation',
        description: 'Research on NFT pricing models and market efficiency.',
        link: 'https://nftresearch.org/dynamics',
        pdfUrl: 'https://nftresearch.org/dynamics.pdf',
        author: 'Danny Liu',
        category: 'NFTs',
        date: '2024-02-18',
        tags: ['nft', 'market analysis', 'valuation'],
        readTime: '18 min',
        citations: 123,
        institution: 'OpenSea'
      },
      {
        id: '11',
        title: 'Quantum Resistance in Blockchain',
        description: 'Analysis of quantum computing threats and post-quantum cryptographic solutions for blockchain.',
        link: 'https://quantumresistance.io/blockchain',
        author: 'Dr. Michelle Chen',
        category: 'Security',
        date: '2024-03-01',
        tags: ['quantum', 'cryptography', 'security'],
        readTime: '25 min',
        citations: 56,
        institution: 'MIT Digital Currency Initiative'
      },
      {
        id: '12',
        title: 'Stablecoin Design and Risk Assessment',
        description: 'Comprehensive analysis of various stablecoin mechanisms and their associated risks.',
        link: 'https://stablecoinresearch.org/design',
        author: 'MakerDAO Research',
        category: 'Stablecoins',
        date: '2024-01-22',
        tags: ['stablecoins', 'risk', 'economics'],
        readTime: '20 min',
        citations: 289,
        institution: 'MakerDAO'
      },
      {
        id: '13',
        title: 'Regulatory Landscape for Cryptocurrencies',
        description: 'Global regulatory framework analysis for digital assets and DeFi protocols.',
        link: 'https://cryptoregulation.org/global',
        pdfUrl: 'https://cryptoregulation.org/global.pdf',
        author: 'CoinCenter Legal',
        category: 'Regulation',
        date: '2024-02-25',
        tags: ['regulation', 'compliance', 'legal'],
        readTime: '30 min',
        citations: 167,
        institution: 'CoinCenter'
      },
      {
        id: '14',
        title: 'Blockchain Scalability Trilemma',
        description: 'Exploring solutions to the scalability trilemma: decentralization, security, and scalability.',
        link: 'https://scalabilityresearch.org/trilemma',
        author: 'Vitalik Buterin',
        category: 'Scaling',
        date: '2024-03-08',
        tags: ['scalability', 'trilemma', 'blockchain'],
        readTime: '22 min',
        citations: 432,
        institution: 'Ethereum Foundation'
      },
      {
        id: '15',
        title: 'Privacy Coins: Technology and Adoption',
        description: 'Technical analysis of privacy-focused cryptocurrencies and their real-world adoption.',
        link: 'https://privacycoins.org/analysis',
        author: 'Monero Research Lab',
        category: 'Privacy',
        date: '2024-01-30',
        tags: ['privacy', 'monero', 'zcash'],
        readTime: '20 min',
        citations: 98,
        institution: 'Monero'
      },
      {
        id: '16',
        title: 'GameFi Economics and Token Models',
        description: 'Study of play-to-earn game economies and sustainable tokenomics models.',
        link: 'https://gamefiresearch.org/economics',
        author: 'Axie Infinity Research',
        category: 'GameFi',
        date: '2024-02-12',
        tags: ['gamefi', 'p2e', 'tokenomics'],
        readTime: '18 min',
        citations: 145,
        institution: 'Sky Mavis'
      },
      {
        id: '17',
        title: 'Decentralized Identity Solutions',
        description: 'Analysis of self-sovereign identity protocols and verifiable credentials.',
        link: 'https://didresearch.org/solutions',
        author: 'Civic Team',
        category: 'Identity',
        date: '2024-03-03',
        tags: ['did', 'identity', 'verifiable credentials'],
        readTime: '20 min',
        citations: 67,
        institution: 'Civic'
      },
      {
        id: '18',
        title: 'Oracle Networks and Data Feeds',
        description: 'Technical research on decentralized oracle networks and data reliability.',
        link: 'https://oracleresearch.org/networks',
        pdfUrl: 'https://oracleresearch.org/networks.pdf',
        author: 'Chainlink Labs',
        category: 'Oracles',
        date: '2024-02-05',
        tags: ['oracles', 'data feeds', 'chainlink'],
        readTime: '25 min',
        citations: 278,
        institution: 'Chainlink'
      },
      {
        id: '19',
        title: 'Environmental Impact of Cryptocurrency Mining',
        description: 'Comprehensive study on energy consumption and sustainability of PoW vs PoS.',
        link: 'https://miningimpact.org/sustainability',
        author: 'Cambridge CCAF',
        category: 'Sustainability',
        date: '2024-01-18',
        tags: ['mining', 'energy', 'sustainability'],
        readTime: '20 min',
        citations: 345,
        institution: 'Cambridge University'
      },
      {
        id: '20',
        title: 'Liquid Staking Derivatives',
        description: 'Analysis of liquid staking protocols and their impact on DeFi composability.',
        link: 'https://stakingresearch.org/liquid',
        author: 'Lido Research',
        category: 'Staking',
        date: '2024-03-15',
        tags: ['liquid staking', 'LSD', 'defi'],
        readTime: '18 min',
        citations: 89,
        institution: 'Lido DAO'
      },
      {
      id: '21',
      title: 'The Merge: Ethereum\'s Transition to Proof-of-Stake',
      description: 'Comprehensive analysis of Ethereum\'s historic transition from Proof-of-Work to Proof-of-Stake, examining technical implementation, economic implications, and network security post-merge.',
      link: 'https://ethereumresearch.org/merge-analysis',
      pdfUrl: 'https://ethereumresearch.org/merge-analysis.pdf',
      author: 'Tim Beiko & Ethereum Foundation Research',
      category: 'Ethereum',
      date: '2024-03-20',
      tags: ['ethereum', 'the merge', 'proof-of-stake', 'consensus', 'upgrade'],
      readTime: '35 min',
      citations: 567,
      institution: 'Ethereum Foundation'
    }
    ];

    setResearchData(dummyResearch);
    setLoading(false);
  }, []);

  // Get unique categories for filter
  const categories = ['all', ...new Set(researchData.map(item => item.category))];

  // Filter research items
  const filteredResearch = researchData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="terminal-panel mb-6">
        <h2 className="terminal-header text-2xl">📚 Research Papers</h2>
        <p className="text-gray-400 text-sm mt-2">
          Academic papers, DeFi research, blockchain analysis, and market studies
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-terminal-bg rounded-lg border border-terminal-border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-terminal-accent mb-2">Search Research</label>
            <input
              type="text"
              placeholder="Search by title, author, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-terminal-panel border border-terminal-border rounded text-terminal-accent placeholder-gray-500 focus:outline-none focus:border-terminal-accent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-terminal-accent mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-terminal-panel border border-terminal-border rounded text-terminal-accent focus:outline-none focus:border-terminal-accent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 text-xs text-gray-500">
          Showing {filteredResearch.length} of {researchData.length} research papers
        </div>
      </div>

      {/* Research Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-terminal-accent">Loading research papers...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResearch.map((item) => (
            <div 
              key={item.id} 
              className="bg-terminal-bg rounded-lg border border-terminal-border overflow-hidden hover:border-terminal-accent/50 transition-all hover:shadow-lg hover:shadow-terminal-accent/5 group"
            >
              <div className="p-5">
                {/* Header with category */}
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 text-xs rounded bg-terminal-accent/20 text-terminal-accent">
                    {item.category}
                  </span>
                  {item.citations && (
                    <span className="text-xs text-gray-500" title="Citations">
                      📚 {item.citations}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-terminal-accent mb-2 line-clamp-2 group-hover:text-terminal-accent/90">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                  {item.description}
                </p>

                {/* Author and Date */}
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                    <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {/* Institution and Read Time */}
                {item.institution && (
                  <div className="text-xs text-gray-500 mb-3">
                    <span className="bg-terminal-panel px-2 py-1 rounded">
                      {item.institution} • {item.readTime} read
                    </span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs bg-terminal-panel border border-terminal-border rounded text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center justify-between pt-3 border-t border-terminal-border">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-xs text-terminal-accent hover:text-terminal-accent/80 transition-colors"
                  >
                    <span>View Research</span>
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
                  </a>
                  
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs text-gray-400 hover:text-terminal-accent transition-colors"
                      title="Download PDF"
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4" />
                      <span>PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredResearch.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-400 mb-2">No research papers found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}