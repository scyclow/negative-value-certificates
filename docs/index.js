'use strict';
;(async () => {
////////////////////////////////////////////////////


const $connectWallet = document.getElementById('connect-wallet')
const $ifNotConnected = document.getElementById('if-not-connected')
const $ifConnected = document.getElementById('if-connected')
const $ifIOUBalance = document.getElementById('if-iou-balance')
const $ifNoIOUBalance = document.getElementById('if-no-iou-balance')
const $ifTxError = document.getElementById('if-tx-error')
const $ifTxPending = document.getElementById('if-tx-pending')
const $purchaseWithIOU = document.getElementById('purchase-with-iou')
const $iouPurchase = document.getElementById('iou-purchase')






// Web3 Check
if (!window.ethereum) {
  alert(`Please revisit this page with a Web3-enabled browser`)
  return
}

// Setup
const iouABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint iouId) view returns (address)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
]

const nvcABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
]

const nvcMinter = [
  'function isPremint() view returns (string)',
  'function mint() public payable',
  'function mintWithIOU(uint256 iouId) public payable',
  'function donate() public payable',
  'function usedIOUs(uint iouID) view returns (bool)',
  'function priceInWei() view returns (uint)',
]

window.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
window.signer = provider.getSigner()
const isConnected = async () => {
  try {
    return await signer.getAddress()
  } catch (e) {
    return false
  }
}

const { chainId } = await provider.detectNetwork()

let IOU_ADDRESS, NVC_ADDRESS, NVC_MINTER_ADDRESS
switch (chainId) {
  // local network
  case 31337:
    console.log(`Running on local network (${chainId})`)
    IOU_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    NVC_ADDRESS = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'
    NVC_MINTER_ADDRESS = '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9'
    break

  // rinkeby
  case 4:
    console.log(`Running on rinkeby (${chainId})`)
    IOU_ADDRESS = ''
    NVC_ADDRESS = ''
    NVC_MINTER_ADDRESS = ''
    break

  // mainnet
  case 1:
    console.log(`Running on mainnet (${chainId})`)
    IOU_ADDRESS = ''
    NVC_ADDRESS = ''
    NVC_MINTER_ADDRESS = ''
    break
}

const iouContract = new ethers.Contract(IOU_ADDRESS, iouABI, provider)
const nvcContract = new ethers.Contract(NVC_ADDRESS, nvcABI, provider)
const nvcMinterContract = new ethers.Contract(NVC_MINTER_ADDRESS, nvcMinter, provider)

// Connect wallet
const connectedWallet = await isConnected()
if (connectedWallet) {
  console.log(`Wallet connected: ${connectedWallet}`)
  onWalletConnected(connectedWallet)
} else {
  console.log('Wallet not connected')
  $ifNotConnected.style.display = null
  $ifConnected.style.display = 'none'

  $connectWallet.onclick = async () => {
    $connectWallet.innerHTML = 'Connecting...'
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }, []);
      const address = await isConnected()
      onWalletConnected(address)


    } catch (e) {
      alert(`Error Connecting Wallat: ${e.message}`)
      debugger
      console.error(e)
    }
  }
}




// Exercise IOU ROFR

async function exerciseIOUROFR() {
  try {
    const iouIDValue = document.getElementById('iou-id').value
    const iouID = Number(iouIDValue)
    if (iouIDValue === '' || iouID === NaN || iouID < 0 || iouID > 249) {
      displayError('IOU ID must be a number between 0 and 250')
      return
    }

    const [
      mintPrice,
      iouAlreadyUsed,
      ownerOfIOU,
      currentAddress
    ] = await Promise.all([
      nvcMinterContract.priceInWei(),
      nvcMinterContract.usedIOUs(iouID),
      iouContract.ownerOf(iouID),
      isConnected()
    ])

    const balancePromise = nvcContract.balanceOf(currentAddress)

    if (iouAlreadyUsed) {
      displayError(`IOU #${iouID} has already been used to mint a NVC`)
      return
    }

    if (ownerOfIOU !== currentAddress) {
      displayError(`This address does not own IOU #${iouID}`)
      return
    }

    displayError('')
    setLoading(true)

    await nvcMinterContract.connect(signer).mintWithIOU(iouID, { value: mintPrice })

    const interval = setInterval(async () => {
      const success = (await nvcContract.balanceOf(currentAddress)).toNumber() > (await balancePromise).toNumber()
      if (success) {
        // hide $iouPurchase
        // display success message
        setLoading(false)
        clearIntercal(interval)
      }
    }, 1000)

  } catch (e) {
    console.log(e)
    displayError(e.message)
  }

}

$purchaseWithIOU.onclick = exerciseIOUROFR





// TODO
function displayError(e) {
  if (e) console.log(e)
  $ifTxError.innerHTML = e
}

function setLoading(bool) {
  if (bool) {
    $ifTxPending.innerHTML = 'Transaction Pending...'
  } else {
    $ifTxPending.innerHTML = ''
  }
}





// TIMERS



async function retrieveData() {
  // nvcs minted by this wallet
  const address = await isConnected()
  const [
    totalNvcsMinted,
    nvcBalance
  ] = await Promise.all([
    nvcContract.totalSupply(),
    nvcContract.balanceOf(address)
  ])

  document.getElementById('total-minted').innerHTML = totalNvcsMinted.toString()
  setTimeout(retrieveData, 2000)
}



async function onWalletConnected(address) {
  retrieveData()
  $ifNotConnected.style.display = 'none'
  $ifConnected.style.display = null


  retrieveIOUData(address)

}


async function retrieveIOUData(address) {
  const hasIOU = await iouContract.balanceOf(address)

  if (hasIOU.toNumber()) {
    console.log(`Has IOU: ${hasIOU}`)
    $ifIOUBalance.style.display = null
    $ifNoIOUBalance.style.display = 'none'

    // TODO do something with this
    const transfersFrom = await iouContract.filters.Transfer(address)
    const transfersTo = await iouContract.filters.Transfer(null, address)


    console.log(transfersFrom, transfersTo)


  } else {
    console.log(`Does not have IOU`)
    $ifIOUBalance.style.display = 'none'
    $ifNoIOUBalance.style.display = null
  }
}





////////////////////////////////////////////////
})()