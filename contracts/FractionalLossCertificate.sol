// SPDX-License-Identifier: MIT

import "./Dependencies.sol";

pragma solidity ^0.8.2;


contract FractionalLossCertificates is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
  using Strings for uint256;

  uint private _tokenIdCounter;

  bool useURIPointer;

  string baseUrl;
  string baseUrlExtension;
  string baseExternalUrl;
  string baseImgUrl;
  string imgExtension;
  string projectDescription;
  string metadataExtension;
  string baseNamePrefix;
  string baseNameSuffix;
  address mintingAddress;

  address constant public compromisedAddress = 0x7C23C1b7e544e3e805bA675c811E287fc9d71949;


  event ProjectEvent(address indexed poster, string content);
  event TokenEvent(address indexed poster, uint256 indexed tokenId, string content);

  constructor(address eventualOwner) ERC721('FractionalLossCertificates', 'FLC', compromisedAddress) {
    useURIPointer = false;
    baseNamePrefix = '#';
    baseNameSuffix = ' of 256';
    baseUrlExtension = '.json';
    baseUrl = 'https://steviep.xyz/fractional-loss-certificates/tokens/metadata/';
    baseImgUrl = 'https://steviep.xyz/fractional-loss-certificates/tokens/images/';
    baseExternalUrl = 'https://steviep.xyz/fractional-loss-certificates';
    imgExtension = '.png';
    projectDescription = 'This certificate represents a one two hundred fifty-sixth fraction of the 25.6178 ETH loss sustained by Ethereum address: 0x7c23c1b7e544e3e805ba675c811e287fc9d71949 following the public exposure of its private key on October 15, 2021 at 02:44:49 AM (UTC). The -0.1000695313 ETH par value of this certificate represents a proportionate share of the loss, which is payable by the minter upon issuance. This certificate is non-revokable and non-redeemable.';
    _tokenIdCounter = 1;
    mintingAddress = eventualOwner;
    transferOwnership(eventualOwner);
  }

  function safeMint(address to) public {
    require(mintingAddress == _msgSender(), 'Caller is not the minting address');
    require(_tokenIdCounter <= 256, 'Can only mint up to 256 tokens.');
    _safeMint(to, _tokenIdCounter);
    _tokenIdCounter++;
  }

  function setMintingAddress(address minter) public onlyOwner {
    mintingAddress = minter;
  }


  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');

    string memory tokenString = tokenId.toString();

    if (useURIPointer) {
      return string(abi.encodePacked(baseUrl, tokenString, baseUrlExtension));
    }

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "', baseNamePrefix, tokenId.toString(), baseNameSuffix,
            '", "description": "', projectDescription,
            '", "image": "', baseImgUrl, tokenString, imgExtension,
            '", "external_url": "', baseExternalUrl, tokenString,
            '"}'
          )
        )
      )
    );
    return string(abi.encodePacked('data:application/json;base64,', json));

  }


  function flipUseURIPointer() public onlyOwner {
    useURIPointer = !useURIPointer;
  }


  function updateBaseUrl(string memory _baseUrl, string memory _baseUrlExtension) public onlyOwner {
    baseUrl = _baseUrl;
    baseUrlExtension = _baseUrlExtension;
  }

  function updateProjectDescription(
    string memory _projectDescription
  ) public onlyOwner {
    projectDescription = _projectDescription;
  }

  function updateMetadataParams(
    string memory _baseNamePrefix,
    string memory _baseNameSuffix,
    string memory _baseImgUrl,
    string memory _imgExtension,
    string memory _baseExternalUrl
  ) public onlyOwner {
    baseNamePrefix = _baseNamePrefix;
    baseNameSuffix = _baseNameSuffix;
    baseImgUrl = _baseImgUrl;
    imgExtension = _imgExtension;
    baseExternalUrl = _baseExternalUrl;
  }

  function emitProjectEvent(string memory _content) public onlyOwner {
    emit ProjectEvent(_msgSender(), _content);
  }

  function emitTokenEvent(uint256 tokenId, string memory _content) public {
    require(
      owner() == _msgSender() || ERC721.ownerOf(tokenId) == _msgSender(),
      'Only project or token owner can emit token event'
    );
    emit TokenEvent(_msgSender(), tokenId, _content);
  }




  // The following functions are overrides required by Solidity.



  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable) returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }
}



