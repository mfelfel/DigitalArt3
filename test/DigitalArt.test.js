const RecordLabel = artifacts.require("./../contracts/RecordLabel.sol");
const DigitalArt = artifacts.require("./../contracts/DigitalArt.sol");

const statusEnum = Object.freeze({"Applied":0, "Published":1, "Cancelled":2});
              
const ether = 10000000000000000000;
const lessEther = 25000000000000000;

contract("DigitalArt", accounts => {
  it("... digital art gets initialized to Applied status, with the correct hash", async () => {
    const _mock_hash = "0x0000000000000000000000000000000000000000023400000000000000000000";
    const recordLabel = await RecordLabel.deployed();
    const returnedDigitalArtAddress = (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[2]}));
    assert.equal(JSON.stringify(returnedDigitalArtAddress.receipt.to).substring(1,3) ,'0x', "Could not create an address");
  });

  it("... anyone is able to tip the artist of the digital art with atleast one ether", async () => {
    // I must supply these params here, but the actual value is getting read from 2_deploy_contracts.js
    // Not sure why i should do this. 
    const _mock_hash = "0x0400000000670000007890000070000001122000000005500023400003000083";
    const digitalArt = await DigitalArt.deployed(accounts[0], _mock_hash);

    (await digitalArt.transferOwnership(accounts[0]));

    const _tipper_balance_before = Number(web3.utils.fromWei((await web3.eth.getBalance(accounts[3])), 'ether')); 
    const _digital_art_balance_before = Number(web3.utils.fromWei((await digitalArt.getBalance()), 'ether'))

    const tmp = (await digitalArt.gratuity({"value": ether, "from": accounts[3]}));

    const _tipper_balance_after = Number(web3.utils.fromWei(await web3.eth.getBalance(accounts[3]), 'ether')); 
    const _digital_art_balance_after = Number(web3.utils.fromWei((await digitalArt.getBalance()), 'ether'))

    assert.isAbove(
      _tipper_balance_before, _tipper_balance_after,
      " tipper balance before has to be bigger after they are tipped");
      
    assert.isAbove(
      _digital_art_balance_after, _digital_art_balance_before,
      " digital art contract balance before has to be less than after the gratuity");
   
  });

  it("... cannot tip an artist with less than .5 eth.", async () => {
    const _mock_hash = "0x0400000000670005670000000070000001122000000005500043200003000083";
    const digitalArt = await DigitalArt.deployed(accounts[1], _mock_hash);

    var hasFailed = false;

    try {
      (await digitalArt.gratuity({"value": lessEther, "from": accounts[2]}));
    } catch {
      hasFailed = true;
    }

    assert(
      hasFailed,
      " cannot tip an artist less than a full eth");
  });


  it("... owner of the digital art is able to withdraw their fund", async () => {
    const _mock_hash = "0x0400000000670000007890000070000001122000000005500023400003000083";
    const digitalArt = await DigitalArt.deployed(accounts[0], _mock_hash);

    (await digitalArt.transferOwnership(accounts[0]));

    const _artist_before = Number(web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')); 

    (await digitalArt.gratuity({"value": ether, "from": accounts[5]}));
    (await digitalArt.gratuity({"value": ether, "from": accounts[6]}));
    (await digitalArt.gratuity({"value": ether, "from": accounts[7]}));

    const response = (await digitalArt.withdrawFunds());

    const _artist_after = Number(web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')); 

    assert.isBelow(
      _artist_before, _artist_after,
       " artist balance before has to be below the artist balance after");
  });

});