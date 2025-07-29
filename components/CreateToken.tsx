'use client';

import React, { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { uploadToPinata, uploadMetaData } from '../pages/api/pinata';
import { createAndMint, mplTokenMetadata, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { percentAmount, createSignerFromKeypair } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import pRetry from 'p-retry';
import { toast, ToastContainer } from 'react-toastify';
import { createSetAuthorityInstruction, AuthorityType } from '@solana/spl-token';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

const CreateToken: FC = () => {
  const { connected, publicKey, wallet, signTransaction, sendTransaction } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [decimals, setDecimals] = useState<number | null>(null);
  const [initialSupply, setInitialSupply] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [newprefix, setprefix] = useState('');
  const [vanityAddress, setVanityAddress] = useState<string | null>(null);
  const [mintingInProgress, setMintingInProgress] = useState(false);
  const [transactionInfo, setTransactionInfo] = useState<{ tx: string, tokenAddress: string } | null>(null);
  const [enableMintAuthority, setEnableMintAuthority] = useState(true);
  const [enableFreezeAuthority, setEnableFreezeAuthority] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleIconFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setIconFile(selectedFile);
      console.log("Selected File:", selectedFile);
    }
  };

  const handleCreateToken = async () => {
    console.log({ iconFile, tokenName, tokenSymbol, decimals, initialSupply });

    if (
      !iconFile ||
      !tokenName.trim() ||
      !tokenSymbol.trim() ||
      isNaN(Number(initialSupply)) ||
      Number(initialSupply) <= 0 ||
      decimals === null ||
      decimals === undefined
    ) {
      toast.error("Validation failed: Ensure all fields are properly filled.");
      return;
    }

    setIsUploading(true);
    setMintingInProgress(true);

    try {
      const iconUrl = await uploadToPinata(iconFile);
      console.log("Icon URL:", iconUrl);
      const metadataUrl = await uploadMetaData(tokenName, tokenSymbol, iconFile);
      console.log("Metadata URL:", metadataUrl);

      if (!publicKey || !signTransaction || !wallet || !sendTransaction) {
        throw new Error('Wallet not connected or transaction signing not available.');
      }

      const umi = createUmi('https://api.devnet.solana.com')
        .use(walletAdapterIdentity(wallet.adapter))
        .use(mplTokenMetadata());

      const prefix = newprefix;
      const response = await fetch(`../api/mint?prefix=${prefix}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
      }
      const mintData = await response.json();

      // Reconstruct the mint signer from the API response
      const mintKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(mintData.secretKey));
      const mintSigner = createSignerFromKeypair(umi, mintKeypair);

      const metadata = {
        name: tokenName,
        symbol: tokenSymbol,
        uri: metadataUrl,
      };

      toast.success(`Vanity Mint Address: ${mintData.publicKey.toString()}`);
      setVanityAddress(mintData.publicKey.toString());

      const adjustedAmount = Number(initialSupply) * Math.pow(10, decimals);

      // Create and mint the token
      const txResponse = await pRetry(
        async () => {
          const response = await createAndMint(umi, {
            mint: mintSigner,
            authority: umi.identity,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            sellerFeeBasisPoints: percentAmount(0),
            decimals: decimals,
            amount: adjustedAmount,
            tokenOwner: umi.identity.publicKey,
            tokenStandard: TokenStandard.Fungible,
          }).sendAndConfirm(umi, {
            confirm: { commitment: 'confirmed' },
            send: { skipPreflight: false },
          });
          return response;
        },
        { retries: 1, minTimeout: 500 }
      );

      const transactionSignature = Buffer.from(txResponse.signature).toString('base64');
      const devnetTxUrl = `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`;
      const devnetTokenUrl = `https://explorer.solana.com/address/${mintData.publicKey.toString()}?cluster=devnet`;

      // Initialize Solana connection for authority updates
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

      // Update Mint Authority if disabled
      if (!enableMintAuthority) {
        const mint = new PublicKey(mintData.publicKey);
        const currentAuthority = new PublicKey(umi.identity.publicKey);
        const instruction = createSetAuthorityInstruction(
          mint,
          currentAuthority,
          AuthorityType.MintTokens, // Updated to use MintTokens
          null // Revoke mint authority
        );

        const transaction = new Transaction().add(instruction);
        const signature = await sendTransaction(transaction, connection, {
          signers: [],
          skipPreflight: false,
        });
        await connection.confirmTransaction(signature, 'confirmed');
        console.log("Mint authority revoke tx:", signature);
        toast.success("Mint authority revoked.");
      }

      // Update Freeze Authority if disabled
      if (!enableFreezeAuthority) {
        const mint = new PublicKey(mintData.publicKey);
        const currentAuthority = new PublicKey(umi.identity.publicKey);
        const instruction = createSetAuthorityInstruction(
          mint,
          currentAuthority,
          AuthorityType.FreezeAccount, // Updated to use FreezeAccount
          null // Revoke freeze authority
        );

        const transaction = new Transaction().add(instruction);
        const signature = await sendTransaction(transaction, connection, {
          signers: [],
          skipPreflight: false,
        });
        await connection.confirmTransaction(signature, 'confirmed');
        console.log("Freeze authority revoke tx:", signature);
        toast.success("Freeze authority revoked.");
      }

      toast.success(`Successfully minted ${metadata.name} tokens!`);
      setTransactionInfo({
        tx: devnetTxUrl,
        tokenAddress: devnetTokenUrl,
      });

    } catch (error) {
      console.error('Error creating token:', error);
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
      setMintingInProgress(false);
    }
  };

  return isClient ? (
    <>
     <ToastContainer toastClassName={() =>
    'bg-gradient-to-r from-black via-purple-900 to-black text-white rounded-md shadow-md px-4 py-2 border border-purple-800 text-lg'
  } />
      {/* Animated Note Banner */}
      <div className="max-w-4xl mx-auto mt-8 px-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105">
          <div className="flex items-center gap-3">
            <span className="bg-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full">PRO TIP</span>
            <p className="text-sm">
              For fast mint address generation, use <span className="font-semibold text-purple-400">less than 4 digits</span> and ensure it’s <span className="font-semibold text-green-400">alphanumeric</span>, e.g. <span className="inline-block bg-gray-700 text-purple-300 mx-1 px-2 py-0.5 rounded">5S</span> or <span className="inline-block bg-gray-700 text-purple-300 mx-1 px-2 py-0.5 rounded">D26</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Creation Hub Container */}
      <div
        className="max-w-4xl mx-auto my-12 p-8 bg-gray-900 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 text-white relative overflow-hidden"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
        }}
      >
        {/* Animated Zig Zag Pattern Background */}
        <div className="absolute inset-0 z-0">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="zigzag" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M0 40 L20 20 L40 40 L60 20 L80 40" fill="none" stroke="rgba(147, 51, 234, 0.3)" strokeWidth="2" />
                <path d="M0 40 L20 60 L40 40 L60 60 L80 40" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" />
                <path d="M0 40 L20 20 L40 40 L60 20 L80 40" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="2" transform="translate(40, 40)" />
              </pattern>
              <radialGradient id="fog" cx="0" cy="0" r="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </radialGradient>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#zigzag)"
              className="animate-zigzag"
            />
            <rect
              width="100%"
              height="100%"
              fill="url(#fog)"
              className="pointer-events-none"
              style={{
                transform: 'translate(var(--mouse-x), var(--mouse-y))',
                transformOrigin: 'center',
              }}
            />
          </svg>
        </div>
        <style>
          {`
            @keyframes zigzag {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-80px);
              }
            }
            .animate-zigzag {
              animation: zigzag 6s linear infinite;
            }
            .max-w-4xl {
              --mouse-x: 0px;
              --mouse-y: 0px;
            }
          `}
        </style>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-center text-purple-400 mb-8">Create Your Token</h1>
          <div className="h-px bg-gray-600 mb-8" />

          {!connected ? (
            <div className="flex justify-center mb-8">
              {isClient && (
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300">
                  <WalletMultiButton />
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300">
                  <WalletMultiButton />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Desired Prefix */}
                <div>
                  <h2 className="text-xl font-semibold text-purple-300 mb-4">Prefix Configuration</h2>
                  <div className="mb-6">
                    <label htmlFor="prefix" className="text-gray-300 font-medium">Desired Prefix</label>
                    <input
                      id="prefix"
                      type="text"
                      value={newprefix}
                      onChange={(e) => setprefix(e.target.value)}
                      placeholder="Enter prefix (e.g., 5S)"
                      className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      required
                      aria-label="Desired prefix"
                    />
                  </div>

                  {/* Vanity Address Feedback */}
                  {vanityAddress && (
                    <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                      <span className="font-semibold text-purple-300">Vanity Address Generated:</span>{' '}
                      <span className="inline-block bg-gray-600 text-purple-200 font-mono px-2 py-0.5 rounded">{vanityAddress}</span>
                    </div>
                  )}
                </div>

                {/* Right Column: Token Details */}
                <div>
                  <h2 className="text-xl font-semibold text-purple-300 mb-4">Token Details</h2>
                  <div className="mb-6">
                    <label htmlFor="tokenName" className="text-gray-300 font-medium">Token Name</label>
                    <input
                      id="tokenName"
                      type="text"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      placeholder="Name your token"
                      className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      required
                      aria-label="Token name"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="tokenSymbol" className="text-gray-300 font-medium">Token Symbol</label>
                    <input
                      id="tokenSymbol"
                      type="text"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value)}
                      placeholder="Choose a symbol"
                      className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      required
                      aria-label="Token symbol"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="decimals" className="text-gray-300 font-medium">Decimals</label>
                    <input
                      id="decimals"
                      type="number"
                      value={decimals ?? ''}
                      onChange={(e) => setDecimals(Number(e.target.value))}
                      placeholder="Set decimals (e.g., 9)"
                      min="0"
                      className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      required
                      aria-label="Token decimals"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="icon" className="text-gray-300 font-medium">Upload Icon</label>
                    <input
                      id="icon"
                      type="file"
                      onChange={handleIconFileChange}
                      className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-semibold hover:file:bg-purple-700 transition-colors"
                      required
                      aria-label="Upload token icon"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="initialSupply" className="text-gray-300 font-medium">Initial Supply</label>
                    <input
                      id="initialSupply"
                      type="number"
                      value={initialSupply}
                      onChange={(e) => setInitialSupply(e.target.value)}
                      placeholder="Set initial supply"
                      min="0"
                      className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      required
                      aria-label="Initial supply"
                    />
                  </div>
                </div>
              </div>

              {/* Authorities Table */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-purple-300 mb-4">Authority Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="mb-6">
                    <label className="text-gray-300 font-medium">Mint Authority</label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={enableMintAuthority}
                          onChange={() => setEnableMintAuthority(!enableMintAuthority)}
                          aria-label="Toggle mint authority"
                        />
                        <div className={`w-12 h-6 rounded-full ${enableMintAuthority ? 'bg-purple-600' : 'bg-gray-600'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${enableMintAuthority ? 'translate-x-6' : ''}`}></div>
                        </div>
                      </label>
                      <span className={`text-sm font-semibold ${enableMintAuthority ? 'text-purple-400' : 'text-gray-400'}`}>
                        {enableMintAuthority ? '🌿 Unlocked' : '🔒 Locked'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Lock the mint to stop future token creation.</p>
                  </div>
                  <div className="mb-6">
                    <label className="text-gray-300 font-medium">Freeze Authority</label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={enableFreezeAuthority}
                          onChange={() => setEnableFreezeAuthority(!enableFreezeAuthority)}
                          aria-label="Toggle freeze authority"
                        />
                        <div className={`w-12 h-6 rounded-full ${enableFreezeAuthority ? 'bg-purple-600' : 'bg-gray-600'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${enableFreezeAuthority ? 'translate-x-6' : ''}`}></div>
                        </div>
                      </label>
                      <span className={`text-sm font-semibold ${enableFreezeAuthority ? 'text-purple-400' : 'text-gray-400'}`}>
                        {enableFreezeAuthority ? '❄️ Freezable' : '🔥 Unfreezable'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Disable freezing to ensure tokens are transferable.</p>
                  </div>
                </div>
              </div>

              {/* Transaction Success Feedback */}
              {transactionInfo && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <span className="font-semibold text-purple-300">Token Created Successfully!</span>
                  <br />
                  <span>
                    Token Address:{' '}
                    <a
                      href={transactionInfo.tokenAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 underline hover:text-purple-500 transition-colors duration-200"
                    >
                      View on Solana Explorer
                    </a>
                  </span>
                </div>
              )}

              {/* Create Token Button */}
              <button
                onClick={handleCreateToken}
                disabled={isUploading || !connected || mintingInProgress}
                className="w-full mt-8 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isUploading || mintingInProgress ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    {isUploading ? 'Uploading...' : 'Creating...'}
                  </span>
                ) : (
                  '🌟 Create Token'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  ) : null;
};

export default CreateToken;