// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./Ownable.sol";
import "./DigitalArt.sol";

/**
* @author Mohamed Felfel
* @dev An ownable contract, to act as the Record Lable that manages digital art
*/
contract RecordLabel is Ownable {
    enum DigitalArtStatus {Applied, Published, Cancelled}

    struct S_DigitalArt{
      DigitalArt digitalArt; 
      bool exists; 
    }

    mapping(bytes32 => S_DigitalArt) public digitalArts;

    event FundsWithdrawn(address, uint256);

    receive() external payable {}

    /**
    * @return Address of the new Digital Art contract
    */
    function createDigitalArt(bytes32 _daHash) payable external returns(address) {
      require(msg.value >= 1 ether, "Need to pay a full ether to register the digital art");
      require(address(0) != msg.sender, "Owner must be a valid address");	
      require(owner() != msg.sender, "Owner cannot create a digital art");	
      require(digitalArts[_daHash].exists == false, "Cannot add a digital art that already exists");

      DigitalArt _digitalArt = new DigitalArt(address(owner()), _daHash);
      _digitalArt.transferOwnership(msg.sender);
      digitalArts[_daHash].digitalArt = _digitalArt;
      digitalArts[_daHash].exists = true;    

      return address(digitalArts[_daHash].digitalArt);
    }

    /**
    * @return The address of a digital art given its hash
    */
    function searchDigitalArt(bytes32 _daHash) public view returns(DigitalArt)  {    
  		require(digitalArts[_daHash].exists, "Digital art does not exists");
      return digitalArts[_daHash].digitalArt;
     }

    /**
    * @dev will switch the status of a digital art to Published
    */
    function publishDigitalArt(bytes32 _daHash) public onlyOwner {
  		require(digitalArts[_daHash].exists, "Digital art does not exists, to publish");
	  	digitalArts[_daHash].digitalArt.updateStatus(DigitalArtStatus.Published);
    }

    /**
    * @dev will switch the status of a digital art to Canceled
    */
    function cancelDigitalArt(bytes32 _daHash) public onlyOwner {
   		require(digitalArts[_daHash].exists, "Digital art does not exists, to cancel");
  		digitalArts[_daHash].digitalArt.updateStatus(DigitalArtStatus.Cancelled);
    }

    /**
    * @return status of the digital art
    */
    function getStatusOfDigitalArt(bytes32 _daHash) public view returns(uint) {
  		require(digitalArts[_daHash].exists, "Digital art does not exists, no status");
      return uint(digitalArts[_daHash].digitalArt.getStatus());
    }

    /**
    * @dev Will withdraw funds from the contract to the contract owner's address
    */
    function withdrawAllFunds() public onlyOwner {
  		emit FundsWithdrawn(owner(), address(this).balance);
      (bool sent, bytes memory data) = payable(owner()).call{value: address(this).balance}("");
      data;
      require(sent, "Failed to send withdraw ETH to owner's account");
    }

    /**
    * @return the balance of the current contract
    */
   function getBalance() public view returns (uint256) {
      return address(this).balance;
    }
}