// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./RecordLabel.sol";
import "./Ownable.sol";

/**
* @author Mohamed Felfel
* @dev A contract to manage Digital Arts by their hash code
*/
contract DigitalArt is Ownable {

	bytes32 public daHash ;
    address private parentContract;
	RecordLabel.DigitalArtStatus private status;

    event DigitalArtStatusUpdate(bytes32, RecordLabel.DigitalArtStatus);
    event BeenTipped(address, uint);    
    event DigitalArtCreated(address, bytes32);

    receive() external payable {}

    /**
    * @dev Create a digital art record
    */
    constructor(address _parentContract, bytes32 _daHash) {
        require(_parentContract != address(0), " Parent contract cannot be null");

        parentContract = _parentContract;
		daHash = _daHash;
		status = RecordLabel.DigitalArtStatus.Applied;

        emit DigitalArtCreated(_parentContract, _daHash);
    }


    /**
    * @dev Updates the status of the digital art. Only allowed by the parent contract.
    */
	function updateStatus(RecordLabel.DigitalArtStatus _status) public {
        // TODO: this is'nt secure. How to get around it. 
        require((address(parentContract) == address(tx.origin)&&
               ((_status == RecordLabel.DigitalArtStatus.Published)||(_status == RecordLabel.DigitalArtStatus.Cancelled))),
               (" Not allowed to update status only this guy can ")
               );

		emit DigitalArtStatusUpdate(daHash, _status);
		status = _status;
	}
	
    /**
    * @dev Allows the user of the digital art to withdraw their funds
    */
    function withdrawFunds() public onlyOwner {
        uint amount = address(this).balance;
        (bool success,) = owner().call{value: amount}("");
        require(success, "Failed to withdraw Ether");
    }

    /**
    * @dev Allows the user of the digital art to withdraw their funds
    * @return The status of the digital art
    */
    function getStatus() public view returns(RecordLabel.DigitalArtStatus) {
        return status;
    }

    /**
    * @dev Accepts a gratuity from audience of the digital art
    */
    function gratuity() payable external {
        require(msg.value >= 1 ether, "1 eth is min tip");
        require(daHash != bytes23(0), "Cannot tip original contract");
        emit BeenTipped(msg.sender, msg.value);
    }

    /**
    * @return The balance in the contract
    */
    function getBalance() public view returns (uint256) {
      return address(this).balance;
    }
}