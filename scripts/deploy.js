

async function main(contractType) {
  const mintPrice = '0.1000695313'

  // dev1, dev2, dev3
  const [devWallet, owner, iouHolder] = await ethers.getSigners();
  console.log(devWallet.address)



  console.log('deploying IOU')
  const IOU = await ethers.getContractFactory('IOU', devWallet)
  IOUContract = await IOU.deploy()
  await IOUContract.connect(devWallet).transferOwnership(owner.address)

  console.log('minting IOUs')
  await IOUContract.connect(owner).batchSafeMint([
    owner.address,
    owner.address,
    owner.address,
    owner.address,
    iouHolder.address,
    iouHolder.address,
    iouHolder.address,
    iouHolder.address,
    '0xacdc434144ce2f9ddf7836c82f4717e5929102f5',//8
    '0xacdc434144ce2f9ddf7836c82f4717e5929102f5',//9
    '0xacdc434144ce2f9ddf7836c82f4717e5929102f5',//10
    '0xacdc434144ce2f9ddf7836c82f4717e5929102f5',//11
    '0xacdc434144ce2f9ddf7836c82f4717e5929102f5',//12
  ], {
    gasLimit: 999999
  })

  // Setup FLC contracts
  console.log('deploying FLC')
  const NegativeValueCert = await ethers.getContractFactory('NegativeValueCertificates', devWallet)
  NegativeValueCertContract = await NegativeValueCert.deploy(owner.address)

  console.log('deploying FLC minter')
  const NegativeValueCertMinter = await ethers.getContractFactory('NegativeValueCertificatesMinter', devWallet)
  NegativeValueCertMinterContract = await NegativeValueCertMinter.deploy(
    NegativeValueCertContract.address,
    IOUContract.address,
    owner.address
  )


  console.log('minting FLC #1')
  await NegativeValueCertContract.connect(owner).safeMint(owner.address)


  console.log('connect FLC minter')
  await NegativeValueCertContract.connect(owner).setMintingAddress(NegativeValueCertMinterContract.address)



  // await NegativeValueCertMinterContract
  //   .connect(owner)
  //   .flipIsLocked()

  // console.log('mint with IOU 1')
  // await NegativeValueCertMinterContract
  //   .connect(iouHolder)
  //   .mintWithIOU(1, { value: ethers.utils.parseEther(mintPrice), gasLimit: 999999 })

  // console.log('mint with IOU 2')
  // await NegativeValueCertMinterContract
  //   .connect(iouHolder)
  //   .mintWithIOU(2, { value: ethers.utils.parseEther(mintPrice), gasLimit: 999999 })


  // await NegativeValueCertMinterContract
  //   .connect(owner)
  //   .flipIsPremint()



  console.log(`IOU Contract Address: ${IOUContract.address}`)
  console.log(`NegativeValueCertificates Contract Address: ${NegativeValueCertContract.address}`)
  console.log(`NegativeValueCertificatesMinter Contract Address: ${NegativeValueCertMinterContract.address}`)

}



main(process.env.CONTRACT)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });