const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract..");

  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log("Deployed contract to " + simpleStorage.address);
  console.log(network.config)

  if (network.config === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block txes")
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address,[])
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is ${currentValue}`);

  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait();
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated value is ${updatedValue}`)

}

async function verify(contractAddress, args) {
  console.log("Verifying the contract address...");
  try{
  await run("verify:verify",{
    address:contractAddress,
    constructorArguments:args,
  });
}catch(err){
  if(err.message.toLowerCase().includes("already verified")){
    console.log("Already Verified")
  }else{
    console.log(err)
  }
}
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
