

// BY JNBEZ
pragma solidity ^0.8.4;
import"@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Busd is ERC20 {
    constructor() ERC20("BUSD", "BUSD") {
        _mint(msg.sender,10000000000000);
    }

}



