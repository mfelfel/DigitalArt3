var recordLabel = artifacts.require("./../contracts/RecordLabel.sol");
var digitalArtTestCases = artifacts.require("./../contracts/DigitalArt.sol");

module.exports = function(deployer) { 
  deployer.then(async () => {
      await deployer.deploy(recordLabel);

      //      deployer.link(recordLabel, digitalArtTestCases);

      await deployer.deploy(digitalArtTestCases, recordLabel.address, "0x0400000000670000007890000070000001122000000005500023400003000083");
  });
}; 