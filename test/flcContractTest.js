console.log('blah')
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
  it('should work', async () => {
    const [
      _, __,
      god,
      owner,
      grandPrizeWinner,
      firstRunnerUp,
      secondRunnerUp,
      loser,
      ...signers
    ] = await ethers.getSigners();


    const Prizes = await ethers.getContractFactory('FractionalLossCertificates', god);
    const PrizesContract = await Prizes.deploy();

    await PrizesContract.deployed();
    await PrizesContract.connect(god).transferOwnership(owner.address)
    await PrizesContract.connect(owner).batchSafeMint([
      owner.address,
      grandPrizeWinner.address,
      firstRunnerUp.address,
      secondRunnerUp.address,
      loser.address,
      owner.address,
      owner.address,
      owner.address,
    ])

    console.log(await PrizesContract.connect(owner).ownerOf(0))
    console.log(await PrizesContract.connect(owner).ownerOf(1))
    console.log(await PrizesContract.connect(owner).ownerOf(2))
    console.log(await PrizesContract.connect(owner).ownerOf(3))
    console.log(await PrizesContract.connect(owner).ownerOf(4))
    console.log(await PrizesContract.connect(owner).ownerOf(5))

    const metadata0 = await PrizesContract.connect(owner).tokenURI(1)
    console.log(metadata0)
    await PrizesContract.connect(owner).flipUseURIPointer()

    const metadata1 = await PrizesContract.connect(owner).tokenURI(1)
    console.log(metadata1)

    await PrizesContract.connect(owner).updateBaseUrl('www.bing.com/', '.html')

    const metadata2 = await PrizesContract.connect(owner).tokenURI(1)
    console.log(Buffer.from(metadata2.split(',')[1], 'base64').toString('utf-8'))

    await PrizesContract.connect(owner).updateMetadataParams(
      'prettyPictures/',
      '.jpg',
      'www.google.com/tokenPage/',
    )
    await PrizesContract.connect(owner).updateProjectDescription('new description')


    const metadata3 = await PrizesContract.connect(owner).tokenURI(1)
    console.log(Buffer.from(metadata3.split(',')[1], 'base64').toString('utf-8'))


    await PrizesContract.connect(owner).emitProjectEvent('Hello project')
    await PrizesContract.connect(owner).emitTokenEvent(1, 'Hello token 1')
    await PrizesContract.connect(grandPrizeWinner).emitTokenEvent(1, 'Hello token 1 holder')

    expectFailure(() => PrizesContract.connect(grandPrizeWinner).safeMint(grandPrizeWinner.address), 'Ownable:')
    expectFailure(() => PrizesContract.connect(grandPrizeWinner).batchSafeMint([grandPrizeWinner.address]), 'Ownable:')
    expectFailure(() => PrizesContract.connect(grandPrizeWinner).flipUseURIPointer(), 'Ownable:')
    expectFailure(() => PrizesContract.connect(grandPrizeWinner).updateBaseUrl('www.wrong.com', '.wrong'), 'Ownable:')
    expectFailure(() => PrizesContract.connect(grandPrizeWinner).emitProjectEvent('wrong project event'), 'Ownable:')
    expectFailure(() => PrizesContract.connect(grandPrizeWinner).emitTokenEvent(1, 'wrong token event'), 'Only project or token owner can emit token event')
    expectFailure(() => PrizesContract.connect(grandPrizeWinner).updateProjectDescription('wong description'), 'Ownable:')
    expectFailure(() => PrizesContract.connect(grandPrizeWinner).updateMetadataParams(
      'wrongPictures/',
      '.wrong',
      'www.wrong.com/wrongPage/',
    ), 'Ownable:')

  })

  it('should integrate with the minter', async () => {
    // mint #1
    // assign minter.
    // assign IOU holders
    // try to mint directly with the non minter

    // non-IOU holder try to mint
    // IOU holder mints
    // IOU holder mints twice
    // premint -> open
    // non-IOU holder mints
    //
  })
})

