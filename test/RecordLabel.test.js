const RecordLabel = artifacts.require("./../contracts/RecordLabel.sol");
const DigitalArt = artifacts.require("./../contracts/DigitalArt.sol");

const statusEnum = Object.freeze({"Applied":0, "Published":1, "Cancelled":2});

const ether = 10000000000000000000;

contract("RecordLabel", accounts => {    
  it("... Record label gets deployed correctly", async () => {
    const recordLabel = await RecordLabel.deployed();
    const _balance = await recordLabel.getBalance(); 
    assert.equal(_balance, 0," balance should be zero");  
  });

  it("... user is able creates digital art, record lable accepts money and charges the paying account", async () => {
    const _mock_hash = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const recordLabel = await RecordLabel.deployed();
    const _balance_before = Number(web3.utils.fromWei((await recordLabel.getBalance()), 'ether'));
    const returnedDigitalArtAddress = (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[2]}));
    const _balance_after = Number(web3.utils.fromWei((await recordLabel.getBalance()), 'ether'));
    assert.isAbove(_balance_after, _balance_before, "Balance before has to be bigger than balance after");
    assert.equal(JSON.stringify(returnedDigitalArtAddress.receipt.to).substring(1,3) ,'0x', "Could not create an address");
  });

  it("... owner of record label contract cannot create any digital arts", async () => {
    var _didFail = false;
    const _mock_hash = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const recordLabel = await RecordLabel.deployed();
    try {
      (await recordLabel.createDigitalArt.call(_mock_hash, {"value": ether}));  
    } catch {
      _didFail = true;
    }
    assert.equal(_didFail, true, "An owner of a record lable should not be able to register a digital art.");
  });

  it("... record label is able to publish contract", async () => {
    const _mock_hash = "0x0000000000000000000000000000000000000000000000000000000003000000";
    const recordLabel = await RecordLabel.deployed();
    (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[2]}));
    (await recordLabel.publishDigitalArt(_mock_hash, {"from": accounts[0]}));
    const _statusAfter = (await recordLabel.getStatusOfDigitalArt.call(_mock_hash, {"from": accounts[3]}));
    assert.equal(_statusAfter ,1, " record label was not able to publish digital art");
  });

  it("... public are able of searching an existing digital art", async () => {
    const _mock_hash = "0x0000000000000000000000000000000000000000000000000000000003000031";
    const recordLabel = await RecordLabel.deployed();
    const _createdDigitalArt = (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[2]}));
    (await recordLabel.publishDigitalArt(_mock_hash, {"from": accounts[0]}));
    const _searched_art = (await recordLabel.searchDigitalArt.call(_mock_hash));
    assert.equal(_searched_art, JSON.stringify(_createdDigitalArt.logs[0].address).replaceAll("\"", ""), " Need to be able to search a digital art");
  });

  it("... public get a trivial value when searching for a non existing art ", async () => {
    const _mock_hash = "0x0000000000000000000000000000000000000000000000000000000043000031";
    const _mock_nde_hash = "0x7770000000000000000000000000000000000000000000000000000043000031";
    const recordLabel = await RecordLabel.deployed();
    (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[2]}));
    (await recordLabel.publishDigitalArt(_mock_hash, {"from": accounts[0]}));
    var _didFail = false;
    try {
      (await recordLabel.searchDigitalArt.call(_mock_nde_hash));
    } catch {
      _didFail = true;
    }
    assert.equal(_didFail, true, " should not be able to find a hash that does not exist ");
  });

  it("... unable to create a contract from a null account", async () => {
    const _mock_hash = "0x0000000000000000000000000000000000000000000000000000000043000031";
    const recordLabel = await RecordLabel.deployed();
    var _didFail = false;
    try {
      (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": 0}));
    } catch {
      _didFail = true;
    }
    assert.equal(_didFail, true, " should not be able to create a digital art from a zero address");
  });

  it("... a user is unable to create a duplicate digital art", async () => {
    const _mock_hash = "0x0000000000000000900000000000000000000000000000000000000043000031";
    const recordLabel = await RecordLabel.deployed();
    var _didFail = false;
    (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[3]}));
    try {
      (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[3]}));
    } catch {
      _didFail = true;
    }
    assert.equal(_didFail, true, " should not be able to duplicate digital art");
  });

  it("... record label is able to cancel contract", async () => {
    const _mock_hash = "0x0000000000670000000000000070000000000000000000000000000003000000";
    const recordLabel = await RecordLabel.deployed();

    (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[2]}));
    (await recordLabel.publishDigitalArt(_mock_hash, {"from": accounts[0]}));
    const _statusBefore = (await recordLabel.getStatusOfDigitalArt.call(_mock_hash, {"from": accounts[3]}));
    (await recordLabel.cancelDigitalArt(_mock_hash, {"from": accounts[0]}));
    const _statusAfter = (await recordLabel.getStatusOfDigitalArt.call(_mock_hash, {"from": accounts[3]}));

    assert.equal(_statusBefore ,1, " record lable was not able to publish digital art, then cancel it");  
    assert.equal(_statusAfter ,2, " record lable was not able to cancel digital art");  
  });

  it("... normal users cannot cancel contract", async () => {
    const _mock_hash = "0x0000000000670000000000000070000000000000000005500000000003000000";
    const recordLabel = await RecordLabel.deployed();

    (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[2]}));
    (await recordLabel.publishDigitalArt(_mock_hash, {"from": accounts[0]}));
    const _statusBefore = (await recordLabel.getStatusOfDigitalArt.call(_mock_hash, {"from": accounts[3]}));

    var _didFail = false;

    try {
      (await recordLabel.cancelDigitalArt(_mock_hash, {"from": accounts[3]}));
    } catch {
      _didFail = true;
    }
    assert.equal(_didFail, true, " normal user should be able to cancel digital art");  
  });

  it("... record lable is capable withdraw funds to their account", async () => {
    const _mock_hash = "0x0000000000670000000000000070000001122000000005500000000003000000";
    const _mock_hash2 = "0x0000000000670004500000000070000001122000000005500000000003000000";
    const _mock_hash3 = "0x0000000000670005300000000070000001122000000005500000000003000000";

    const recordLabel = await RecordLabel.deployed();

    (await recordLabel.createDigitalArt(_mock_hash, {"value": ether, "from": accounts[2]}));
    (await recordLabel.publishDigitalArt(_mock_hash, {"from": accounts[0]}));

    (await recordLabel.createDigitalArt(_mock_hash2, {"value": ether, "from": accounts[3]}));
    (await recordLabel.publishDigitalArt(_mock_hash2, {"from": accounts[0]}));

    (await recordLabel.createDigitalArt(_mock_hash3, {"value": ether, "from": accounts[4]}));
    (await recordLabel.publishDigitalArt(_mock_hash3, {"from": accounts[0]}));

    const _record_label_balance_before = Number(web3.utils.fromWei((await recordLabel.getBalance()), 'ether')); 
    const _owner_balance_before = Number(web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')); 

    const response = (await recordLabel.withdrawAllFunds());

    const _record_label_balance_after = Number(web3.utils.fromWei((await recordLabel.getBalance()), 'ether'));
    const _owner_balance_after = Number(web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')); 

    assert.isAbove(
      _record_label_balance_before ,_record_label_balance_after, 
      " record label balance before has to be bigger than the record label balance after");  
    assert.isBelow(
      _owner_balance_before, _owner_balance_after,
       " owner balance before has to be below the owner balance after");
  });
});