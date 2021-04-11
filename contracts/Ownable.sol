// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

/**
* @author Mohamed Felfel
* @dev Ownable contract, slightly modified
*/
contract Ownable  {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner, 
        address indexed newOwner);

    /**
    * @dev Returns the owner of the contract
    * @return address of the account
    * @dev Returns the address of the current owner
    */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
    * @dev Sets the owner to the sender
    */
    constructor () {
        _owner = msg.sender;
    }

    /**
    * @dev Modifier for reistricting access to only the owner
    */
    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    /**
    * @return true means that the sender is the owner, false otherwise
    * @dev Returns true if the caller is the current owner
    */
    function isOwner() public view returns (bool) {
        return (msg.sender == _owner);
    }

    /**
    * @dev Transfers ownership of the contract to a new account (`newOwner`) . Can only be called by the current owner.
    */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}