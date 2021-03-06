'use strict';




// ;(async () => {
// ////////////////////////////////////////////////////


// const $connectWallet = document.getElementById('connect-wallet')
// const $totalMinted = document.getElementById('total-minted')
// const $ifNotConnected = document.getElementById('if-not-connected')
// const $ifConnected = document.getElementById('if-connected')
// const $ifIOUBalance = document.getElementById('if-iou-balance')
// const $ifNoIOUBalance = document.getElementById('if-no-iou-balance')
// const $ifTxError = document.getElementById('if-tx-error')
// const $ifTxPending = document.getElementById('if-tx-pending')
// const $ifTxSuccess = document.getElementById('if-tx-success')
// const $purchaseSection = document.getElementById('purchase-section')
// const $purchaseWithIOU = document.getElementById('purchase-with-iou')
// const $standardPurchase = document.getElementById('standard-purchase')
// const $iouPurchase = document.getElementById('iou-purchase')
// const $ifContractIsLocked = document.getElementById('if-contract-is-locked')
// const $ifContractNotLocked = document.getElementById('if-contract-not-locked')
// const $ifPremint = document.getElementById('if-premint')
// const $ifPublicMint = document.getElementById('if-public-mint')
// const $countdown = document.getElementById('countdown')
// const $etherscanLink = document.getElementById('etherscan-link')
// const $headerLine2 = document.getElementById('header-line-2')
// const $ifTokenIdIncluded = document.getElementById('if-token-id-included')

// let contractState = ''




// const queryParams = location.search.substring(1)
// if (queryParams) {
//   const { tokenId } = JSON.parse('{"' + decodeURI(queryParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
//   if (tokenId && Number(tokenId) > 0 && Number(tokenId) < 257) {
//     $headerLine2.innerHTML = `CERTIFICATE ${tokenId}/256`
//     $ifTokenIdIncluded.style.display = null
//     $ifTokenIdIncluded.innerHTML = `
//       <a href="https://opensea.io/assets/0xe6da43bcfa2ae0ed8c6ac4b3beea1ec9ae65daba/${tokenId}" target="_blank" rel="nofollow">
//         <img src="./tokens/images/${tokenId}.png" class="displayed-cert">
//       </a>
//     `
//   }
// }


// //// SET DROP TIME
// const fmt = (n) => {
//   const r = Math.floor(n)
//   if (r < 10) return '0' + r
//   else return '' + r
// }
// const dropTime = new Date('2021-10-24T16:00:00.000Z').getTime()
// const setDropTime = () => {
//   const now = Date.now()
//   const diff = Math.max(dropTime - now, 0)


//   const h = (diff / 86400000) * 24
//   const m = (h - Math.floor(h)) * 60
//   const s = (m - Math.floor(m)) * 60

//   const timeLeft = h && m && s
//     ? `${fmt(h)}:${fmt(m)}:${fmt(s)}`
//     : contractState || 'Tx Pending...'

//   $countdown.innerHTML = timeLeft
// }
// setInterval(setDropTime, 1000)
// setDropTime()






// // Web3 Check
// if (!window.ethereum) {
//   alert(`Please revisit this page with a Web3-enabled browser`)
//   return
// }

// // Setup
// const iouABI = [
//   'function balanceOf(address owner) view returns (uint256)',
//   'function ownerOf(uint iouId) view returns (address)',
//   'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
// ]

// const nvcABI = [
//   'function balanceOf(address owner) view returns (uint256)',
//   'function totalSupply() view returns (uint256)',
// ]

// const nvcMinter = [
//   'function isPremint() view returns (bool)',
//   'function isLocked() view returns (bool)',
//   'function mint() public payable',
//   'function mintWithIOU(uint256 iouId) public payable',
//   'function donate() public payable',
//   'function usedIOUs(uint iouID) view returns (bool)',
//   'function priceInWei() view returns (uint)',
// ]

// window.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
// window.signer = provider.getSigner()
// const isConnected = async () => {
//   try {
//     return await signer.getAddress()
//   } catch (e) {
//     return false
//   }
// }

// const { chainId } = await provider.detectNetwork()

// let IOU_ADDRESS, NVC_ADDRESS, NVC_MINTER_ADDRESS
// switch (chainId) {
//   // local network
//   case 31337:
//     console.log(`Running on local network (${chainId})`)
//     IOU_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
//     NVC_ADDRESS = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'
//     NVC_MINTER_ADDRESS = '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9'
//     break

//   // rinkeby
//   case 4:
//     console.log(`Running on rinkeby (${chainId})`)
//     IOU_ADDRESS = '0x292e12026B78245cBb8fa9B54372a474B30BF4d2'
//     NVC_ADDRESS = '0x22Da1a99dC103a9Cc38D13fD06EffA9f739552f8'
//     NVC_MINTER_ADDRESS = '0xa27442511FcF4F1B99CE3A7394581b7988F76404'
//     break

//   // mainnet
//   case 1:
//     console.log(`Running on mainnet (${chainId})`)
//     IOU_ADDRESS = '0x13178ab07a88f065efe6d06089a6e6ab55ae8a15'
//     NVC_ADDRESS = '0xe6da43bcfa2ae0ed8c6ac4b3beea1ec9ae65daba'
//     NVC_MINTER_ADDRESS = '0x4F857a92269DC9B42EDB7fab491679DEcb46e848'
//     break
// }

// const iouContract = new ethers.Contract(IOU_ADDRESS, iouABI, provider)
// const nvcContract = new ethers.Contract(NVC_ADDRESS, nvcABI, provider)
// const nvcMinterContract = new ethers.Contract(NVC_MINTER_ADDRESS, nvcMinter, provider)

// // Connect wallet
// const connectedWallet = await isConnected()
// if (connectedWallet) {
//   console.log(`Wallet connected: ${connectedWallet}`)
//   onWalletConnected(connectedWallet)
// } else {
//   console.log('Wallet not connected')
//   $ifNotConnected.style.display = null
//   $ifConnected.style.display = 'none'

//   $connectWallet.onclick = async () => {
//     $connectWallet.innerHTML = 'Connecting...'
//     try {
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }, []);
//       const address = await isConnected()
//       onWalletConnected(address)


//     } catch (e) {
//       alert(`Error Connecting Wallet: ${e.message}`)
//       debugger
//       console.error(e)
//     }
//   }
// }




// // Exercise IOU ROFR

// async function exerciseIOUROFR() {
//   try {
//     displayError('')
//     setLoading(true)

//     const iouIDValue = document.getElementById('iou-id').value
//     const iouID = Number(iouIDValue)
//     if (iouIDValue === '' || iouID === NaN || iouID < 0 || iouID > 249) {
//       setLoading(false)
//       displayError('IOU ID must be a number between 0 and 250')
//       return
//     }

//     const [
//       mintPrice,
//       iouAlreadyUsed,
//       totalMinted,
//       ownerOfIOU,
//       currentAddress
//     ] = await Promise.all([
//       nvcMinterContract.priceInWei(),
//       nvcMinterContract.usedIOUs(iouID),
//       nvcContract.totalSupply(),
//       iouContract.ownerOf(iouID),
//       isConnected()
//     ])

//     const balancePromise = nvcContract.balanceOf(currentAddress)

//     if (totalMinted.toNumber() === 256) {
//       setLoading(false)
//       displayError(`All 256 NVCs have been issued`)
//       return
//     }

//     if (iouAlreadyUsed) {
//       setLoading(false)
//       displayError(`IOU #${iouID} has already been used to mint a NVC`)
//       return
//     }

//     if (ownerOfIOU !== currentAddress) {
//       setLoading(false)
//       displayError(`This address does not own IOU #${iouID}`)
//       return
//     }


//     const tx = await nvcMinterContract.connect(signer).mintWithIOU(iouID, { value: mintPrice })
//     $etherscanLink.href = `https://etherscan.io/tx/${tx.hash}`

//     const interval = setInterval(async () => {
//       const success = (await nvcContract.balanceOf(currentAddress)).toNumber() > (await balancePromise).toNumber()
//       if (success) {
//         $iouPurchase.style.display = 'none'
//         $ifTxSuccess.style.display = null

//         setLoading(false)
//         clearInterval(interval)
//       }
//     }, 1000)

//   } catch (e) {
//     console.log(e)
//     setLoading(false)
//     displayError(e.message)
//   }

// }

// $purchaseWithIOU.onclick = exerciseIOUROFR


// // standard purchase

// async function standardPurchase() {
//   try {
//     displayError('')
//     setLoading(true)

//     const [
//       mintPrice,
//       totalMinted,
//       currentAddress
//     ] = await Promise.all([
//       nvcMinterContract.priceInWei(),
//       nvcContract.totalSupply(),
//       isConnected()
//     ])

//     const balancePromise = nvcContract.balanceOf(currentAddress)


//     if (totalMinted.toNumber() === 256) {
//       setLoading(false)
//       displayError(`All 256 NVCs have been issued`)
//       return
//     }


//     const tx = await nvcMinterContract.connect(signer).mint({ value: mintPrice })
//     $etherscanLink.href = `https://etherscan.io/tx/${tx.hash}`

//     const interval = setInterval(async () => {
//       const success = (await nvcContract.balanceOf(currentAddress)).toNumber() > (await balancePromise).toNumber()
//       if (success) {
//         $standardPurchase.style.display = 'none'
//         $ifTxSuccess.style.display = null

//         setLoading(false)
//         clearInterval(interval)
//       }
//     }, 1000)

//   } catch (e) {
//     console.log(e)
//     setLoading(false)

//     if (e.message.includes('insufficient funds for intrinsic transaction cost')) {
//       console.log(e.message)
//       displayError(`You must have at least 0.09937734 ETH in this wallet to purchase a Negative Value Certificate`)
//     } else {
//       displayError(e.message)
//     }
//   }
// }

// $standardPurchase.onclick = standardPurchase


// function displayError(e) {
//   if (e) console.log(e)
//   $ifTxError.innerHTML = e
// }

// function setLoading(bool) {
//   if (bool) {
//     $ifTxPending.style.display = null
//   } else {
//     $ifTxPending.style.display = 'none'
//   }
// }



// // TIMERS

// async function retrieveGlobalData() {

//   const [
//     totalNvcsMinted,
//     isLocked,
//     isPremint
//   ] = await Promise.all([
//     nvcContract.totalSupply(),
//     nvcMinterContract.isLocked(),
//     nvcMinterContract.isPremint(),
//   ])

//   $totalMinted.innerHTML = totalNvcsMinted.toString()

//   if (totalNvcsMinted.toNumber() === 256) {
//     contractState = 'COMPLETED'
//     $purchaseSection.style.display = 'none'
//   } else {
//     if (isPremint) {
//       $ifPremint.style.display = null
//       $ifPublicMint.style.display = 'none'
//       $purchaseSection.style.display = null
//     } else {
//       contractState = 'OPEN'
//       $purchaseSection.style.border = 'none'
//       $purchaseSection.style.display = null
//       $ifPremint.style.display = 'none'
//       $ifPublicMint.style.display = null
//     }

//     if (isLocked) {
//       $ifContractIsLocked.style.display = null
//       $ifContractNotLocked.style.display = 'none'
//       contractState = 'Contract LOCKED'
//     } else {
//       $ifContractIsLocked.style.display = 'none'
//       $ifContractNotLocked.style.display = null
//     }
//   }

//   setTimeout(retrieveGlobalData, 2000)
// }
// retrieveGlobalData()


// async function retrieveAddrData(address) {
//   // nvcs minted by this wallet
//   const [
//     nvcBalance
//   ] = await Promise.all([
//     nvcContract.balanceOf(address)
//   ])

//   // do something
//   setTimeout(() => retrieveAddrData(address), 2000)
// }



// async function onWalletConnected(address) {
//   $ifNotConnected.style.display = 'none'
//   $ifConnected.style.display = null


//   retrieveAddrData(address)
//   retrieveIOUData(address)

// }


// async function retrieveIOUData(address) {
//   const hasIOU = await iouContract.balanceOf(address)

//   if (hasIOU.toNumber()) {
//     console.log(`Has IOU: ${hasIOU}`)
//     $ifIOUBalance.style.display = null
//     $ifNoIOUBalance.style.display = 'none'

//     // TODO do something with this
//     const transfersFrom = await iouContract.filters.Transfer(address)
//     const transfersTo = await iouContract.filters.Transfer(null, address)


//     console.log(transfersFrom, transfersTo)


//   } else {
//     console.log(`Does not have IOU`)
//     $ifIOUBalance.style.display = 'none'
//     $ifNoIOUBalance.style.display = null
//   }
// }





// ////////////////////////////////////////////////
// })()