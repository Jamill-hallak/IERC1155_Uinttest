// BY JNBEZ
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Busd contract", function () {
  async function deployTokenFixture() {
    const busd = await ethers.getContractFactory("Busd");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Busd= await busd.deploy();
    const busd_address = Busd.address ;
    await Busd.deployed();

    return { busd, Busd, owner, addr1, addr2,busd_address };
  }

  it("Should assign the total supply of Busd to the owner", async function () {
    const { Busd, owner } = await loadFixture(deployTokenFixture);

    const ownerBalance = await Busd.balanceOf(owner.address);
    expect(await Busd.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    const { Busd, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    await expect(
      Busd.transfer(addr1.address, 50)
    ).to.changeTokenBalances(Busd, [owner, addr1], [-50, 50]);

    await expect(
      Busd.connect(addr1).transfer(addr2.address, 50)
    ).to.changeTokenBalances(Busd, [addr1, addr2], [-50, 50]);
  });
});

  describe("Liveverst Nft Deploy",  function () {
    async function deployTokenFixture() {
      const busd = await ethers.getContractFactory("Busd");
      const [bowner, baddr1, baddr2] = await ethers.getSigners();
  
      const Busd= await busd.deploy();
      const busd_address = Busd.address ;
      await Busd.deployed();
  
      return { busd, Busd, bowner, baddr1, baddr2,busd_address };
    }

    async function deployNftFixture() {
      const { Busd } = await loadFixture(deployTokenFixture);
      
      const nft = await ethers.getContractFactory("Livenft");
      const [nowner, addr1, addr2] = await ethers.getSigners();
      // // const busd_address =await loadFixture(deployTokenFixture);
      // let adrr = busd_address.toString()
      const Nft= await nft.deploy(Busd.address);
  
      await Nft.deployed();
      const Nft_address = Nft.address ;
  
      return { nft, Nft, nowner, addr1, addr2,Nft_address };
    }
    it("Should assign the total supply of  very happy nft to the smartcontract", async function () {
      const { Nft, Nft_address } = await loadFixture(deployNftFixture);
  
      const contractnft_Balance = 1000;
      expect(await Nft.balanceOf(Nft_address,0)).to.equal(contractnft_Balance);
    });
    it("Should assign the total supply of happy nft to the smartcontract", async function () {
      const { Nft, Nft_address } = await loadFixture(deployNftFixture);
  
      const contractnft_Balance = 10000;
      expect(await Nft.balanceOf(Nft_address,1)).to.equal(contractnft_Balance);
    });
    it("Should return rigth URL for Veryhappy Nft", async function () {
      const { Nft } = await loadFixture(deployNftFixture);
  
      const url = 'https://ipfs.io/ipfs/QmNtkYkCuv6mtyzHxdZduiCyuT8Hag5XvFLK53Ga9zbYZb/0.json';
      expect(await Nft.uri(0)).to.equal(url);
    });

    it("Should return rigth URL for Sad Nft", async function () {
      const { Nft } = await loadFixture(deployNftFixture);
      const url = 'https://ipfs.io/ipfs/QmNtkYkCuv6mtyzHxdZduiCyuT8Hag5XvFLK53Ga9zbYZb/3.json';
      expect(await Nft.uri(3)).to.equal(url);
    });

    it("Should return rigth price for VerySad Nft", async function () {
      const { Nft} = await loadFixture(deployNftFixture);
      expect(await Nft.price(3)).to.equal(500);
    });
    describe("buy scenario ",  function () {
      async function deployTokenFixture() {
        const busd = await ethers.getContractFactory("Busd");
        const [bowner, baddr1, baddr2] = await ethers.getSigners();
    
        const Busd= await busd.deploy();
        const busd_address = Busd.address ;
        await Busd.deployed();
    
        return { busd, Busd, bowner, baddr1, baddr2,busd_address };
      }
  
      async function deployNftFixture() {
        const { Busd } = await loadFixture(deployTokenFixture);
        
        const nft = await ethers.getContractFactory("Livenft");
        const [nowner, addr1, addr2] = await ethers.getSigners();
        // // const busd_address =await loadFixture(deployTokenFixture);
        // let adrr = busd_address.toString()
        const Nft= await nft.deploy(Busd.address);
    
        await Nft.deployed();
        const Nft_address = Nft.address ;
    
        return { nft, Nft, nowner, addr1, addr2,Nft_address };
      }
    it("Should user buy happy nft by BUSD ", async function () {
      const { Busd,bowner } = await loadFixture(deployTokenFixture);
      const { Nft, Nft_address,nowner } = await loadFixture(deployNftFixture);
      const aprrove = await Busd.approve(Nft.address,1000000,{from:bowner.address})
      const buy = await Nft.buy(1,2,{from:nowner.address})
    });
    it("Should return  'Happy' tier  for this buy ", async function () {
      const { Busd,bowner } = await loadFixture(deployTokenFixture);
      const { Nft, Nft_address,nowner } = await loadFixture(deployNftFixture);
      const aprrove = await Busd.approve(Nft.address,1000000,{from:bowner.address})
      const buy = await Nft.buy(1,2,{from:nowner.address})
      const tier = "Happy"
      expect(await Nft.user_tier(nowner.address)).to.equal(tier)
    });
    it("can't buy twice: Should revert with message :' Error,user already have nfts ' ", async function () {
      const { Busd,bowner } = await loadFixture(deployTokenFixture);
      const { Nft, Nft_address,nowner } = await loadFixture(deployNftFixture);
      const aprrove = await Busd.approve(Nft.address,1000000,{from:bowner.address})
      //buy once 
      const buy = await Nft.buy(1,2,{from:nowner.address})
      //try to buy twice
      await expect( Nft.buy(1,2,{from:nowner.address})).to.be.revertedWith('Error,user already have nfts');
    });
    it("no enough Busd: Should revert with message :' ERC20: insufficient allowance ' ", async function () {
      const { Busd,bowner } = await loadFixture(deployTokenFixture);
      const { Nft, Nft_address,nowner } = await loadFixture(deployNftFixture);
      const aprrove = await Busd.approve(Nft.address,1000,{from:bowner.address})
      //const buy = await Nft.buy(1,2,{from:nowner.address})
      await expect( Nft.buy(1,2,{from:nowner.address})).to.be.revertedWith('ERC20: insufficient allowance');
    });
    
    
  });

});