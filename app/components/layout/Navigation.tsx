'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRegistrationModal } from '@/app/hooks/useRegistrationModal';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { metaMask, coinbaseWallet } from 'wagmi/connectors';
import { baseSepolia } from 'viem/chains';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { onOpen: openModal } = useRegistrationModal();
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const openRegistrationModal = () => {
    setIsMenuOpen(false);
    openModal();
  };
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleConnect = async (connector: any) => {
    try {
      // Connect first
      await connect({ connector });

      // Then force switch to Base Sepolia
      try {
        await switchChain({
          chainId: baseSepolia.id,
        });
      } catch (error) {
        console.error('Failed to switch chain:', error);
      }

      setIsWalletDropdownOpen(false);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDisconnectModal(false);
  };

  return (
    <div className="pointer-events-none">
      <nav className="absolute top-0 left-0 right-0 z-[9999] px-4 py-4 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-primary">
            <Link href="/">Zenith</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/explore" className="nav-link">
              Explore
            </Link>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="nav-link">
              Search
            </button>
            <button onClick={openRegistrationModal} className="nav-link">
              Join
            </button>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <div className="relative">
              {isConnected ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDisconnectModal(true)}
                    className="bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                    className="bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    Connect Wallet
                  </button>
                  <AnimatePresence>
                    {isWalletDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-black/80 backdrop-blur-md shadow-lg"
                      >
                        <div className="py-1">
                          {connectors.map((connector) => (
                            <button
                              key={connector.id}
                              onClick={() => handleConnect(connector)}
                              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                            >
                              Connect with {connector.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/explore" className="nav-link">
              Explore
            </Link>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="nav-link">
              Search
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-lg border border-white/10 bg-black/80 backdrop-blur-md pointer-events-auto"
            >
              <div className="px-4 py-4 space-y-4">
                <button
                  onClick={openRegistrationModal}
                  className="block nav-link hover:text-primary transition-colors"
                >
                  Join
                </button>
                <Link
                  href="/about"
                  className="block nav-link hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <div className="w-full">
                  {isConnected ? (
                    <button
                      onClick={() => setShowDisconnectModal(true)}
                      className="bg-primary text-white w-full px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </button>
                  ) : (
                    <div>
                      <button
                        onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                        className="bg-primary text-white w-full px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        Connect Wallet
                      </button>
                      <AnimatePresence>
                        {isWalletDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 w-full rounded-lg border border-white/10 bg-black/80 backdrop-blur-md shadow-lg"
                          >
                            <div className="py-1">
                              {connectors.map((connector) => (
                                <button
                                  key={connector.id}
                                  onClick={() => handleConnect(connector)}
                                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                                >
                                  Connect with {connector.name}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Disconnect Modal */}
      <AnimatePresence>
        {showDisconnectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] pointer-events-auto"
            onClick={() => setShowDisconnectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed left-4 right-4 top-[50%] -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-[calc(100%-2rem)] md:max-w-sm p-4 md:p-6 rounded-lg border border-white/10 bg-black/80 backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-3 md:mb-4">Disconnect Wallet</h3>
              <p className="text-white/70 mb-4 md:mb-6 text-sm md:text-base">
                Are you sure you want to disconnect your wallet?
              </p>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <button
                  onClick={() => setShowDisconnectModal(false)}
                  className="w-full px-4 py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[72px] left-0 right-0 z-[9999] px-4 pointer-events-auto"
          >
            <div className="max-w-7xl mx-auto">
              <div className="md:w-96">
                <input
                  type="text"
                  placeholder="Search locations, coordinates, or addresses..."
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
