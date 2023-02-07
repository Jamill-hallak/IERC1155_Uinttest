// SPDX-License-Identifier: MIT
// BY JNBEZ
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract Livenft is ERC1155, Ownable {
    uint256 public constant VeryHappy = 0;
    uint256 public constant Happy = 1;
    uint256 public constant Moody = 2;
    uint256 public constant Sad = 3;
    uint256 public constant VerySad = 4;
    IERC20 public BUSD_contact ;
    mapping (uint =>uint256) public  price ;
    uint256 public Busd_balance ;
    bool internal locked;

    mapping (address =>string) public user_tier ;
    mapping (address =>uint256) public user_Token;


constructor(IERC20 _BUSD_contract_address)  ERC1155("https://ipfs.io/ipfs/QmNtkYkCuv6mtyzHxdZduiCyuT8Hag5XvFLK53Ga9zbYZb/{id}.json") {
    _mint(address(this), VeryHappy, 1000, "");
    _mint(address(this), Happy, 10000, "");
    _mint(address(this), Moody, 100000, "");
    _mint(address(this), Sad, 500000, "");
    _mint(address(this), VerySad, 1000000, "");
    BUSD_contact = _BUSD_contract_address;
    price[0]=  50000;
    price[1]=  10000;
    price[2]=  1000;
    price[3]=  500;
    price[4]=  100;


}

modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }



event Log_withdraw_Busd(uint256 amount) ;
event  buy_nfts(uint256 indexed  _tokenId,address indexed _user,uint256 _tokenAmount);
//********orveride functions************* :

//override for opensea ;
function uri(uint256 _tokenId) override public pure returns (string memory) {
    return string(
        abi.encodePacked(
        "https://ipfs.io/ipfs/QmNtkYkCuv6mtyzHxdZduiCyuT8Hag5XvFLK53Ga9zbYZb/",Strings.toString(_tokenId),".json" )
  );
}

//override  to make users can’t  buy NFTs from other users who have nfts ;

function safeTransferFrom(address from,address to,uint256 id,uint256 amount, bytes memory data) public virtual override
      {
         require(not_own(to),"user already have nfs");
            user_tier[to]=get_user_Tier(id);
            user_tier[from]="null";

           //call the original function that you wanted.
          super.safeTransferFrom(from,to,id,amount,data);
        }

// ************functions *********:

//check if user own any nft 
function not_own(address _user_address) internal view returns(bool) {
        require ( own_VeryHappy  (_user_address) <=0, "Error,user already have nfts");
        require(  own_Happy  (_user_address) <=0,  "Error,user already have nfts");
        require(  own_Moody  (_user_address) <=0,  "Error,user already have nfts");
        require(  own_sad  (_user_address) <=0,  "Error,user already have nfts");
        require(  own_Verysad ( _user_address) <=0, "Error,user already have nfts");
    return true ;

    }



    function get_user_Tier(uint256 _tokenId) internal pure returns(string memory) {
         if(_tokenId==0){
        return "VeryHappy";
    }
    else if (_tokenId==1){
        return "Happy";
    }
    else if (_tokenId==2){
        return "Moody";
    }
    else if (_tokenId==3){
        return "Sad";
    }
    else if (_tokenId==4){
        return "VerySad";
    }
    else{
        revert("failed,select right nfts id");
    }
    }


    //**view functions :
function own_VeryHappy (address _user_address) public view  returns (uint256){
    return balanceOf(_user_address, 0);
         }

    function own_Happy (address _user_address) public view  returns (uint256){
    return balanceOf(_user_address, 1);
         }

    function own_Moody (address _user_address) public view  returns (uint256){
    return balanceOf(_user_address, 2);
         }
 
    function own_sad (address _user_address) public view  returns (uint256){
    return balanceOf(_user_address, 3);
         }   

    function own_Verysad (address _user_address) public view  returns (uint256){
    return balanceOf(_user_address, 4); 
         }


function buy (uint256 _tokenId,uint256 _tokenAmount) external  {
   
    require(not_own(msg.sender),"user already have nfts");
    require(balanceOf(address(this), _tokenId)>=_tokenAmount,"falid,no enough nfts to sell ");
    // require(_tokenId<=4,"failed,select right nfts id ");
    uint256 _Busd_amount =_tokenAmount * price[_tokenId] ;
    require(BUSD_contact.balanceOf(msg.sender) >= _Busd_amount,"no enough BUSD");
    bytes memory data = '0';

    require(BUSD_contact.transferFrom(msg.sender,address(this), _Busd_amount),"failed ,can not transfer BUSD from buyer") ;

    this.safeTransferFrom(address(this), msg.sender, _tokenId, _tokenAmount, data);
    Busd_balance+=_Busd_amount ;
    user_tier[msg.sender]=get_user_Tier(_tokenId);

   emit buy_nfts(_tokenId, msg.sender, _tokenAmount);
}


 function withdraw_usdt() external onlyOwner noReentrant {
     require(BUSD_contact.balanceOf(msg.sender) >= Busd_balance,"no enough BUSD");
    BUSD_contact.transfer(msg.sender, Busd_balance);
    Busd_balance =0 ;
    emit Log_withdraw_Busd( BUSD_contact.balanceOf(address(this))) ;
    }
    
}
