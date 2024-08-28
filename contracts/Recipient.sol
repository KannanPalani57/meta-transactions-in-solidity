// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Recipient is ERC2771Context {
    
    event UserUpdated(address previousHolder, address currentHolder, string username);

    address public currentHolder;
    string public username;

    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {
        currentHolder = address(0); // Initialize to zero address
    }

    function setUsername(string memory _username) external  {
        address previousHolder = currentHolder;
        currentHolder = _msgSender();
        username = _username;
        emit UserUpdated(previousHolder, currentHolder, username);
    }

    function getUsername() external view returns (address, string memory) {
        return (currentHolder, username);
    }
}