// a common library for interacting with ethereum wallets
import * as ethers from "ethers";

// the aavegotchi contract abi from the official github
import abi from "../../aavegotchi-contracts/diamondABI/diamond"

// https://github.com/aavegotchi/aavegotchi-contracts in the readme.md
const aavegotchiDiamondAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d';

// ethers.js tutorials will be needed to follow logically on things like default browser provider
let provider = new ethers.providers.Web3Provider(window.ethereum);
// when looking through the facets we see in the AavegotchiGameFacet is an interact button that takes an array of aavegotchi id's by their number
// this tells us we need to figure out the user's gotchis, and supply them to the function
// when called it will prompt the user to confirm the action of the transaction fee
// for a prodution case / change you may decide to filter the gotchis that are not ready to be pet

// since petting spending funds, this will require getting their signer approval and opens a popup,
// we'll get started by making the pet all function easy to remember
// later we will decide to expose it so our frontend can trigger the function for us
// alternatively one could also use the browser console to trigger this function

async function pet_all() {

  if (provider) {

    // our metamask in the browser should have already been on the matic network btw
    // authorizing the account will allow our site to spend for this smart contract
    // [!]
    // [!] very important to only approve this after vetting the app you are using
    // [!]
    // explicitly request the wallet address, it returns an array of the ones approved so we take the first
    // if the user accepts, signer variable now holds their active wallet address
    let contract = await new ethers.Contract(
      // we supply the contract address, contract abi, and the provider with our connection to matic
      aavegotchiDiamondAddress, abi, provider.getSigner()
    );

    if (contract) {

      // So now we have permission to call the contract with our wallet, lets first get the gotchis.
      // to do this first we need to know who's wallet we're looking for.
      // Our wallet is always a good choice, this will prompt you to connect to your site and reveal the account.
      let accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // In the AavegotchiFacet lib there is a function called tokenIdsOfOwner()
      // this is useful because as mentioned above we can start by finding all the gotchis owned which this does exactly
      let gotchis = await contract.tokenIdsOfOwner(accounts[0]);

      if (gotchis.length > 0) {
        console.log("The gotchi's owned by ", accounts[0], "is", gotchis);
        // excellent, with this accounts gotchis it's to our great fortune
        // we can now use the contract's function interact() from the AacevegotchiGameFacet's function to pet them all!

        // its just another function call away from it's name. the abi hooked things up behind the scenes
        // [!] Remember because this broadcasts a transaction, it requires your approval
        contract.interact(gotchis);

        // excellent, now be patient for a sec since Matic is fast.
        // Once your transaction confirms, all the gotchi's we retrieved will be pet and gain kinship assuming the time limit was met. Nice!
        // now head over to https://github.com/aaveghotchi/smart-contracts to find more functions and facets to explore
      }

    }

  }

}

// triggers the pet_all function when our pet_button is clicked
document.getElementById("pet_button").onclick = pet_all
