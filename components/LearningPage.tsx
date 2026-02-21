'use client';

import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignal, faTimes, faPlus, faSearch, faChevronLeft, faChevronRight, faImage, faFilePdf, faStar, faClock, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  link: string;
  author: string;
  category: string;
  difficulty: number;
  duration: string;
  rating: number;
  students: number;
  imageUrl?: string;
  tags: string[];
}

interface AcademyResource {
  id: string;
  title: string;
  deskripsi: string;
  link: string;
  author: string;
  type: string;
  duration: string;
  level: string;
  lessons: number;
  imageUrl?: string;
  tags: string[];
}

export default function LearningPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Dummy Learning Data
  const [learningData, setLearningData] = useState<LearningResource[]>([]);
  const [academyData, setAcademyData] = useState<AcademyResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate dummy data on mount
  useEffect(() => {
    // 3 Dummy Learning Resources
    const dummyLearning: LearningResource[] = [
      {
        id: '1',
        title: 'Cryptocurrency Fundamentals: From Zero to Hero',
        description: 'Complete beginner\'s guide to understanding Bitcoin, blockchain technology, and how to make your first crypto purchase safely.',
        link: 'https://crypto101.org/beginner-course',
        author: 'James Cooper',
        category: 'beginner',
        difficulty: 1,
        duration: '2.5 hours',
        rating: 4.8,
        students: 15420,
        imageUrl: '/learning/crypto-basics.jpg',
        tags: ['bitcoin', 'blockchain', 'wallets', 'exchanges']
      },
      {
        id: '2',
        title: 'DeFi Mastery: Lending, Borrowing & Yield Farming',
        description: 'Deep dive into decentralized finance protocols, understanding liquidity pools, impermanent loss, and maximizing yields safely.',
        link: 'https://defiacademy.com/mastery',
        author: 'Sarah Chen',
        category: 'intermediate',
        difficulty: 2,
        duration: '4 hours',
        rating: 4.9,
        students: 8760,
        imageUrl: '/learning/defi.jpg',
        tags: ['defi', 'lending', 'yield farming', 'uniswap']
      },
      {
        id: '3',
        title: 'On-Chain Analysis: Reading Blockchain Data Like a Pro',
        description: 'Advanced techniques for analyzing on-chain metrics, whale tracking, and using data to make informed trading decisions.',
        link: 'https://chainanalytics.io/pro-course',
        author: 'Michael Rodriguez',
        category: 'advanced',
        difficulty: 3,
        duration: '6 hours',
        rating: 4.7,
        students: 3450,
        imageUrl: '/learning/onchain.jpg',
        tags: ['onchain', 'analysis', 'whales', 'metrics']
      }
    ];

    // 6 Dummy Academy Resources
    const dummyAcademy: AcademyResource[] = [
      {
        id: 'a1',
        title: 'Blockchain Developer Bootcamp 2024',
        deskripsi: 'Comprehensive program to become a blockchain developer. Learn Solidity, smart contract development, and dApp creation from scratch.',
        link: 'https://academy.blockchaindev.com/bootcamp',
        author: 'Dr. Anita Sharma',
        type: 'course',
        duration: '12 weeks',
        level: 'beginner to advanced',
        lessons: 48,
        imageUrl: '/academy/dev-bootcamp.jpg',
        tags: ['solidity', 'smart contracts', 'dapps', 'ethereum']
      },
      {
        id: 'a2',
        title: 'Cryptocurrency Trading Psychology',
        deskripsi: 'Master the mental game of trading. Learn emotional control, risk management, and how to develop a winning trader mindset.',
        link: 'https://tradingpsychology.academy',
        author: 'Dr. Robert Kiyosaki',
        type: 'course',
        duration: '4 weeks',
        level: 'all levels',
        lessons: 16,
        imageUrl: '/academy/trading-psychology.jpg',
        tags: ['trading', 'psychology', 'mindset', 'risk management']
      },
      {
        id: 'a3',
        title: 'Technical Analysis Masterclass',
        deskripsi: 'Learn to read charts like a professional. Covers candlestick patterns, indicators, support/resistance, and advanced charting techniques.',
        link: 'https://technicalanalysis.academy/masterclass',
        author: 'John Bollinger',
        type: 'course',
        duration: '8 weeks',
        level: 'intermediate',
        lessons: 32,
        imageUrl: '/academy/technical-analysis.jpg',
        tags: ['technical analysis', 'charts', 'indicators', 'trading']
      },
      {
        id: 'a4',
        title: 'NFT Creation and Marketing Guide',
        deskripsi: 'Complete guide to creating, minting, and selling NFTs. Learn about different marketplaces, marketing strategies, and community building.',
        link: 'https://nftacademy.io/guide',
        author: 'Lisa Wang',
        type: 'tutorial',
        duration: '3 weeks',
        level: 'beginner',
        lessons: 12,
        imageUrl: '/academy/nft-guide.jpg',
        tags: ['nft', 'digital art', 'opensea', 'marketing']
      },
      {
        id: 'a5',
        title: 'Smart Contract Security Auditing',
        deskripsi: 'Learn how to identify vulnerabilities in smart contracts. Hands-on exercises with real-world audit case studies and best practices.',
        link: 'https://securityaudit.academy',
        author: 'Trail of Bits Team',
        type: 'advanced course',
        duration: '6 weeks',
        level: 'advanced',
        lessons: 24,
        imageUrl: '/academy/security.jpg',
        tags: ['security', 'auditing', 'smart contracts', 'vulnerabilities']
      },
      {
        id: 'a6',
        title: 'DeFi Protocol Design and Economics',
        deskripsi: 'Deep dive into the design principles behind major DeFi protocols. Understand tokenomics, governance, and sustainable yield mechanisms.',
        link: 'https://defidesign.academy',
        author: 'Andre Cronje',
        type: 'research course',
        duration: '5 weeks',
        level: 'advanced',
        lessons: 20,
        imageUrl: '/academy/defi-design.jpg',
        tags: ['defi', 'tokenomics', 'protocol design', 'economics']
      }
    ];

    setLearningData(dummyLearning);
    setAcademyData(dummyAcademy);
    setLoading(false);
  }, []);

  // Filtered learning data
  const filteredLearningData = useMemo(() => {
    let filtered = learningData;
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  }, [learningData, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredLearningData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLearningData = filteredLearningData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Get category stats
  const getCategoryStats = (category: string) => {
    return learningData.filter(item => item.category === category).length;
  };

  // Render stars for rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="terminal-panel mb-6">
        <h2 className="terminal-header text-2xl">🎓 Learning Center</h2>
        <p className="text-gray-400 text-sm mt-2">
          Educational resources, tutorials, and courses on cryptocurrency, blockchain, and trading
        </p>
      </div>

      {/* Learning Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => handleCategorySelect('beginner')}
          className={`bg-terminal-bg rounded-lg border p-6 text-center hover:border-terminal-accent transition-colors cursor-pointer ${
            selectedCategory === 'beginner' ? 'border-terminal-accent bg-terminal-accent/5' : 'border-terminal-border'
          }`}
        >
          <div className="text-3xl mb-3">🌱</div>
          <h3 className="text-sm font-semibold text-terminal-accent mb-2">Beginner</h3>
          <p className="text-xs text-gray-400 mb-3">Crypto basics, wallet setup, first investments</p>
          <div className="mt-2 text-xs text-green-400 font-medium">
            {getCategoryStats('beginner')} courses available
          </div>
        </button>

        <button
          onClick={() => handleCategorySelect('intermediate')}
          className={`bg-terminal-bg rounded-lg border p-6 text-center hover:border-terminal-accent transition-colors cursor-pointer ${
            selectedCategory === 'intermediate' ? 'border-terminal-accent bg-terminal-accent/5' : 'border-terminal-border'
          }`}
        >
          <div className="text-3xl mb-3">📈</div>
          <h3 className="text-sm font-semibold text-terminal-accent mb-2">Intermediate</h3>
          <p className="text-xs text-gray-400 mb-3">Technical analysis, DeFi, trading strategies</p>
          <div className="mt-2 text-xs text-yellow-400 font-medium">
            {getCategoryStats('intermediate')} courses available
          </div>
        </button>

        <button
          onClick={() => handleCategorySelect('advanced')}
          className={`bg-terminal-bg rounded-lg border p-6 text-center hover:border-terminal-accent transition-colors cursor-pointer ${
            selectedCategory === 'advanced' ? 'border-terminal-accent bg-terminal-accent/5' : 'border-terminal-border'
          }`}
        >
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="text-sm font-semibold text-terminal-accent mb-2">Advanced</h3>
          <p className="text-xs text-gray-400 mb-3">On-chain analysis, quantitative trading, research</p>
          <div className="mt-2 text-xs text-red-400 font-medium">
            {getCategoryStats('advanced')} courses available
          </div>
        </button>
      </div>

      {/* Category Filter Display */}
      {selectedCategory && (
        <div className="mb-4 flex items-center justify-between bg-terminal-bg border border-terminal-border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-terminal-accent">
              Showing: <span className="font-semibold">{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span> courses
            </span>
          </div>
          <button
            onClick={() => handleCategorySelect('')}
            className="px-3 py-1 text-xs bg-terminal-border text-terminal-accent rounded hover:bg-terminal-accent hover:text-black transition-colors"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Course Library with Search and Pagination */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-terminal-accent">📚 Course Library</h3>
          <div className="relative w-full sm:w-64">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-terminal-panel border border-terminal-border rounded text-terminal-accent placeholder-gray-500 focus:outline-none focus:border-terminal-accent text-sm"
            />
          </div>
        </div>

        {/* Pagination Info */}
        {filteredLearningData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 text-sm text-gray-400">
            <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLearningData.length)} of {filteredLearningData.length} courses</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 text-gray-400 hover:text-terminal-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
              </button>
              <span className="text-terminal-accent">Page {currentPage} of {totalPages || 1}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 text-gray-400 hover:text-terminal-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Learning Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && paginatedLearningData.length > 0 ? (
            paginatedLearningData.map((item) => (
              <div key={item.id} className="bg-terminal-bg rounded-lg border border-terminal-border overflow-hidden hover:border-terminal-accent/50 transition-all hover:shadow-lg hover:shadow-terminal-accent/5 group">
                <div className="p-5">
                  {/* Header with category and difficulty */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.category === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      item.category === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                      <span>{item.duration}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-terminal-accent mb-2 line-clamp-2 group-hover:text-terminal-accent/90">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Author and Students */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <span>👤 {item.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faUserGraduate} className="w-3 h-3" />
                      <span>{item.students.toLocaleString()} students</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    {renderRating(item.rating)}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 text-xs bg-terminal-panel border border-terminal-border rounded text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 bg-terminal-accent text-black text-sm font-medium rounded hover:bg-terminal-accent/80 transition-colors inline-block text-center"
                  >
                    ▶️ Start Learning
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-gray-400 text-sm mb-2">
                {searchTerm ? 'No courses found matching your search.' : 'No courses available yet.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="text-terminal-accent hover:underline text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Academy Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-terminal-accent mb-6">🎓 Academy Programs</h3>

        {/* Academy Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && academyData.length > 0 ? (
            academyData.map((item) => (
              <div key={item.id} className="bg-terminal-bg rounded-lg border border-terminal-border overflow-hidden hover:border-terminal-accent/50 transition-all hover:shadow-lg hover:shadow-terminal-accent/5 group">
                <div className="p-5">
                  {/* Header with type and level */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                      {item.type}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      item.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.level}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-terminal-accent mb-2 line-clamp-2 group-hover:text-terminal-accent/90">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {item.deskripsi}
                  </p>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span>📚 {item.lessons} lessons</span>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="text-xs text-gray-500 mb-3">
                    By {item.author}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 text-xs bg-terminal-panel border border-terminal-border rounded text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 bg-terminal-accent text-black text-sm font-medium rounded hover:bg-terminal-accent/80 transition-colors inline-block text-center"
                  >
                    🔗 View Program
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-4xl mb-4">🎓</div>
              <p className="text-gray-400 text-sm">No academy programs available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Resources Section */}
      <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
        <h3 className="text-lg font-semibold text-terminal-accent mb-4">📖 Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-terminal-accent">📚 Recommended Books</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="hover:text-terminal-accent transition-colors">• "The Bitcoin Standard" by Saifedean Ammous</div>
              <div className="hover:text-terminal-accent transition-colors">• "Cryptoassets" by Chris Burniske</div>
              <div className="hover:text-terminal-accent transition-colors">• "Digital Gold" by Nathaniel Popper</div>
              <div className="hover:text-terminal-accent transition-colors">• "Mastering Bitcoin" by Antonopoulos</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-terminal-accent">🔗 Useful Links</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="hover:text-terminal-accent transition-colors">• CoinMarketCap Academy</div>
              <div className="hover:text-terminal-accent transition-colors">• Binance Academy</div>
              <div className="hover:text-terminal-accent transition-colors">• Ethereum.org Documentation</div>
              <div className="hover:text-terminal-accent transition-colors">• DeFi Pulse Guides</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}