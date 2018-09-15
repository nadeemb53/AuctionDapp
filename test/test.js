let Auction = artifacts.require("./Auction.sol");

let auctionInstance;

contract('AuctionContract', function (accounts) {
  //accounts[0] is the default account
  //Test case 1
  it("Contract deployment", function() {
    //Fetching the contract instance of our smart contract
    return Auction.deployed().then(function (instance) {
      //We save the instance in a gDlobal variable and all smart contract functions are called using this
      auctionInstance = instance;
      assert(auctionInstance !== undefined, 'Auction contract should be defined');
    });
  });

  //Sample Test Case
  it("Should set bidders", function() {
    return auctionInstance.register({from:accounts[1]}).then(function(result) {
        return auctionInstance.getPersonDetails(0);
    }).then(function(result) {
      assert.equal(result[2], accounts[1], 'bidder address set');
    })
  });

  //Test Case for checking if the bid is more than the token amount
  it("Should NOT allow to bid more than remaining tokens", function() {
    return auctionInstance.bid({from:accounts[1]},itemId=0, count=6)
    .then(function (result) {
      /*
      We are testing for a negative condition and hence this particular block will not have executed if our test case was correct. If this part is executed then we throw an error and catch the error to assert false
      */
      throw("Failed to check remaining tokens less than count");
    }).catch(function (e) {
      var a = e.toString();
      if(e === "Failed to check remaining tokens less than count") {
        assert(false);
      } else {
        assert(true);
      }
    })
  });

  //Modifier Checking
  it("Should NOT allow non owner to reveal winners", function() {
     return auctionInstance.revealWinners({from:accounts[1]})
     .then(function (instance) {
       /*
       We are testing for a negative condition and hence this particular block will not have executed if our test case was correct. If this part is executed then we throw an error and catch the error to assert false
       */
       throw("Failed to check owner in reveal winners");
     }).catch(function (e) {
       if(e === "Failed to check owner in reveal winners") {
         assert(false);
       } else {
         assert(true);
       }
     })
   });


  it("Should set winners", function() {
    return auctionInstance.register({from:accounts[2]})
    .then(function(result) {
        return auctionInstance.register({from:accounts[3]})
    }).then(function() {
        return auctionInstance.register({from:accounts[4]})
    }).then(function() {
        return auctionInstance.bid(itemId=0,count=5,{from:accounts[2]})
    }).then(function() {
        return auctionInstance.bid(itemId=1,count=5,{from:accounts[3]})
    }).then(function() {
        return auctionInstance.bid(itemId=2,count=5,{from:accounts[4]})
    }).then(function() {
        return auctionInstance.revealWinners({from:accounts[0]})
    }).then(function() {
        return auctionInstance.winners(itemId=0,{from:accounts[0]})
    }).then(function(result) {
      assert.notEqual(result,'0x0000000000000000000000000000000000000000','failed');
      return auctionInstance.winners(itemId=1,{from:accounts[0]})
    }).then(function(result) {
      assert.notEqual(result,'0x0000000000000000000000000000000000000000','failed');
      return auctionInstance.winners(itemId=2,{from:accounts[3]})
    }).then(function(result) {
      assert.notEqual(result,'0x0000000000000000000000000000000000000000','failed');
    })
  });
});
