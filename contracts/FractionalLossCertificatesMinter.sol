// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;


interface IIOU {
  function ownerOf(uint256 tokenId) external returns (address owner);
}

interface IFractionalLossCertificate {
  function safeMint(address to) external;
}

contract FractionalLossCertificatesMinter {
  address public owner;
  uint256 public priceInWei;
  bool public isPremint;

  IFractionalLossCertificate public flcContract;
  IIOU public iouContract;
  mapping (uint256 => bool) public usedIOUs;

  constructor(address _flcContract, address _iouContract, address _owner) {
    owner = _owner;
    flcContract = IFractionalLossCertificate(_flcContract);
    iouContract = IIOU(_iouContract);
    priceInWei = 100069531300000000;
    isPremint = true;
  }

  modifier onlyOwner(string memory _msg) {
     require(msg.sender == owner, _msg);
     _;
  }

  function transferOwnership(address newOwner) external onlyOwner("Only owner can transfer ownership") {
     owner = newOwner;
  }

  function updatePrice(uint256 _newPrice) external onlyOwner("Only owner can update the price") {
     priceInWei = _newPrice;
  }

  function flipIsPremint() external onlyOwner("Only owner can flip the premint") {
     isPremint = !isPremint;
  }

  function mint() public payable {
    _mint(0);
  }

  function mintWithIOU(uint256 iouId) public payable {
    _mint(iouId);
  }

  function _mint(uint256 iouId) internal {
    if (isPremint) {
      require(iouContract.ownerOf(iouId) == msg.sender, "You are not the owner of this IOU");
      require(!usedIOUs[iouId], "This IOU has already been used");
      usedIOUs[iouId] = true;
    }

    require(msg.value >= priceInWei, "Insufficient payment");
    payable(owner).transfer(msg.value);
    flcContract.safeMint(msg.sender);

  }

  function donate() external payable {
    payable(owner).transfer(msg.value);
  }
}