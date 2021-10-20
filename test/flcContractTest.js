
const { expect } = require("chai")

const expectFailure = async (fn, err) => {
  let failure
  try {
    await fn()
  } catch (e) {
    failure = e
  }
  expect(failure.message).to.include(err)
}

const num = n => Number(ethers.utils.formatEther(n))

describe('FractionalLossCertificates', () => {
  xit('should work', async () => {
    const [
      _, __,
      devWallet,
      owner,
      certHolder1,
      certHolder2,
      certHolder3,
      ...signers
    ] = await ethers.getSigners()


    const FractionalLossCert = await ethers.getContractFactory('FractionalLossCertificates', devWallet)
    const FractionalLossCertContract = await FractionalLossCert.deploy(owner.address)

    await FractionalLossCertContract.deployed()

    await FractionalLossCertContract.connect(owner).safeMint(owner.address)
    await FractionalLossCertContract.connect(owner).safeMint(certHolder1.address)
    await FractionalLossCertContract.connect(owner).safeMint(certHolder2.address)
    await FractionalLossCertContract.connect(owner).safeMint(certHolder3.address)

    console.log(await FractionalLossCertContract.connect(owner).ownerOf(1))
    console.log(await FractionalLossCertContract.connect(owner).ownerOf(2))
    console.log(await FractionalLossCertContract.connect(owner).ownerOf(3))
    console.log(await FractionalLossCertContract.connect(owner).ownerOf(4))


    const metadata0 = await FractionalLossCertContract.connect(owner).tokenURI(1)
    console.log(Buffer.from(metadata0.split(',')[1], 'base64').toString('utf-8'))

    await FractionalLossCertContract.connect(owner).flipUseURIPointer()

    await FractionalLossCertContract.connect(owner).updateBaseUrl('www.bing.com/', '.html')
    const metadata1 = await FractionalLossCertContract.connect(owner).tokenURI(1)
    console.log(metadata1)

    await FractionalLossCertContract.connect(owner).flipUseURIPointer()

    const metadata2 = await FractionalLossCertContract.connect(owner).tokenURI(1)
    console.log(Buffer.from(metadata2.split(',')[1], 'base64').toString('utf-8'))

    await FractionalLossCertContract.connect(owner).updateMetadataParams(
      'Edition',
      ' out of 256',
      'prettyPictures/',
      '.jpg',
      'www.google.com/tokenPage/',
    )
    await FractionalLossCertContract.connect(owner).updateProjectDescription('new description')


    const metadata3 = await FractionalLossCertContract.connect(owner).tokenURI(1)
    console.log(Buffer.from(metadata3.split(',')[1], 'base64').toString('utf-8'))


    await FractionalLossCertContract.connect(owner).emitProjectEvent('Hello project')
    await FractionalLossCertContract.connect(owner).emitTokenEvent(1, 'Hello token 1')
    await FractionalLossCertContract.connect(certHolder1).emitTokenEvent(2, 'Hello token 2 holder')

    await expectFailure(() => FractionalLossCertContract.connect(certHolder2).safeMint(certHolder2.address), 'Caller is not the minting address')
    await expectFailure(() => FractionalLossCertContract.connect(certHolder2).flipUseURIPointer(), 'Ownable:')
    await expectFailure(() => FractionalLossCertContract.connect(certHolder2).updateBaseUrl('www.wrong.com', '.wrong'), 'Ownable:')
    await expectFailure(() => FractionalLossCertContract.connect(certHolder2).emitProjectEvent('wrong project event'), 'Ownable:')
    await expectFailure(() => FractionalLossCertContract.connect(certHolder2).emitTokenEvent(1, 'wrong token event'), 'Only project or token owner can emit token event')
    await expectFailure(() => FractionalLossCertContract.connect(certHolder2).updateProjectDescription('wong description'), 'Ownable:')
    await expectFailure(() => FractionalLossCertContract.connect(certHolder2).updateMetadataParams(
      '@',
      ' of 257',
      'wrongPictures/',
      '.wrong',
      'www.wrong.com/wrongPage/',
    ), 'Ownable:')

  })

  describe('minter integration', () => {
    const mintPrice = '0.1000695313'
    const mintPriceTooLow = '0.1000695312'

    let devWallet, owner, iouHolder, notIouHolder
    let IOUContract, FractionalLossCertContract, FractionalLossCertMinterContract

    before(async () => {
      [
        _, __,
        devWallet,
        owner,
        iouHolder,
        notIouHolder,
        ...signers
      ] = await ethers.getSigners()

      const IOU = await ethers.getContractFactory('IOU', devWallet)
      IOUContract = await IOU.deploy()
      await IOUContract.connect(devWallet).transferOwnership(owner.address)
      await IOUContract.connect(owner).batchSafeMint([
        owner.address,
        iouHolder.address,
        iouHolder.address,
      ])

      // Setup FLC contracts
      const FractionalLossCert = await ethers.getContractFactory('FractionalLossCertificates', devWallet)
      FractionalLossCertContract = await FractionalLossCert.deploy(owner.address)

      const FractionalLossCertMinter = await ethers.getContractFactory('FractionalLossCertificatesMinter', devWallet)
      FractionalLossCertMinterContract = await FractionalLossCertMinter.deploy(
        FractionalLossCertContract.address,
        IOUContract.address,
        owner.address
      )

      await FractionalLossCertContract.deployed()
    })

    it('should succeed with mint #1', async () => {
      console.log(owner.address)
      await FractionalLossCertContract.connect(owner).safeMint(owner.address)
    })

    it('should not let minting through the mint contract work yet', async () => {
      await expectFailure(() =>
        FractionalLossCertMinterContract
          .connect(iouHolder)
          .mintWithIOU(1, { value: ethers.utils.parseEther(mintPrice) })
      , 'Caller is not the minting address')
    })

    it('should assign the minter', async () => {
      await FractionalLossCertContract.connect(owner).setMintingAddress(FractionalLossCertMinterContract.address)
    })

    it('should fail if payment is too low', async () => {
      await expectFailure(() =>
        FractionalLossCertMinterContract
          .connect(iouHolder)
          .mintWithIOU(1, { value: ethers.utils.parseEther(mintPriceTooLow) })
      , 'Insufficient payment')
    })

    it('should let an IOU holder mint succeed', async () => {
      await FractionalLossCertMinterContract
        .connect(iouHolder)
        .mintWithIOU(1, { value: ethers.utils.parseEther(mintPrice) })
    })

    it('should not let IOU mint twice', async () => {
      await expectFailure(() =>
        FractionalLossCertMinterContract
          .connect(iouHolder)
          .mintWithIOU(1, { value: ethers.utils.parseEther(mintPrice) })
      , 'This IOU has already been used')
    })

    it('should not let non-IOU holders mint', async () => {
      await expectFailure(() =>
        FractionalLossCertMinterContract
          .connect(notIouHolder)
          .mintWithIOU(2, { value: ethers.utils.parseEther(mintPrice) })
      , 'You are not the owner of this IOU')

      await expectFailure(() =>
        FractionalLossCertMinterContract
          .connect(notIouHolder)
          .mint({ value: ethers.utils.parseEther(mintPrice) })
      , 'You are not the owner of this IOU')
    })

    it('should allow a second flc to be minted', async () => {
      await FractionalLossCertMinterContract
          .connect(iouHolder)
          .mintWithIOU(2, { value: ethers.utils.parseEther(mintPrice) })
    })

    it('should not allow minting from the FLC contract directly', async () => {
      await expectFailure(() =>
        FractionalLossCertContract
          .connect(iouHolder)
          .safeMint(iouHolder.address)
      , 'Caller is not the minting address')
    })

    it('should turn off the pre minter', async () => {
      await FractionalLossCertMinterContract.connect(owner).flipIsPremint()
    })

    it('should fail when payment is too low', async () => {
      await expectFailure(() =>
        FractionalLossCertMinterContract
          .connect(notIouHolder)
          .mint({ value: ethers.utils.parseEther(mintPriceTooLow) })
      , 'Insufficient payment')
    })

    it('should allow a standard mint', async () => {
      await FractionalLossCertMinterContract
        .connect(notIouHolder)
        .mint({ value: ethers.utils.parseEther(mintPrice) })
    })

    it('should allow 256 mints', async () => {
      for (let m = 5; m <= 256; m++) {
        await FractionalLossCertMinterContract
          .connect(notIouHolder)
          .mint({ value: ethers.utils.parseEther(mintPrice) })
      }
    })

    it('should not allow a 257th mint', async () => {
      await expectFailure(() =>
        FractionalLossCertMinterContract
          .connect(notIouHolder)
          .mint({ value: ethers.utils.parseEther(mintPrice) })
      , 'Can only mint up to 256 tokens.')
    })

    it('should all be correct', async () => {
      const ownerBalance = await FractionalLossCertContract.connect(owner).balanceOf(owner.address)
      const iouHolderBalance = await FractionalLossCertContract.connect(owner).balanceOf(iouHolder.address)
      const notIouHolderBalance = await FractionalLossCertContract.connect(owner).balanceOf(notIouHolder.address)

      expect(ownerBalance).to.equal(1)
      expect(iouHolderBalance).to.equal(2)
      expect(notIouHolderBalance).to.equal(253)

      expect(await FractionalLossCertContract.connect(notIouHolder).ownerOf(10)).to.equal(notIouHolder.address)

      await FractionalLossCertContract.connect(notIouHolder).transferFrom(notIouHolder.address, iouHolder.address, 10)
      expect(await FractionalLossCertContract.connect(notIouHolder).ownerOf(10)).to.equal(iouHolder.address)
    })

  })
})

