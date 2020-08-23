const Dogs = artifacts.require('Dogs');
const DogsUpdated =  artifacts.require('DogsUpdated');
const Proxy = artifacts.require('Proxy');

module.exports = async function(deployer, network, accounts) {
    //Deploy contracts
    const dogs = await Dogs.new();
    const proxy = await Proxy.new(dogs.address);

    // Create proxy Dog to fool truffle
    var proxyDog = await Dogs.at(proxy.address);
    
    // Set number of dogs
    await proxyDog.setNumberOfDogs(10);

    // Tested
    var nrOfDogs = await proxyDog.getNumberOfDogs();
    console.log("Before Update: " + nrOfDogs.toNumber())

    // Deploy new verion of Dogs
    const dogsUpdated = await DogsUpdated.new();
    proxy.upgrade(dogsUpdated.address);
    
    // Recreate proxyDog var. Truffle thinks proxyDog has all functions
    proxyDog = await DogsUpdated.at(proxy.address);
    //Initialized proxy state.
    proxyDog.initialize(accounts[0]);

    // Checks that storage remains
    nrOfDogs = await proxyDog.getNumberOfDogs();
    console.log("After Update: " + nrOfDogs.toNumber());

    //Set nr of dogs through the proxy with NEW FUNC CONTRACT
    await proxyDog.setNumberOfDogs(30);

    //Check setNumberOfDogs worked with new func contract
    nrOfDogs = await proxyDog.getNumberOfDogs();
    console.log("After dog nr update: " + nrOfDogs.toNumber());
}