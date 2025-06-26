// app.js
const CONTRACT_ADDRESS = "TXf6VxedZiDsE1NoMcAE3vKnh6fdjppoG3"; // replace with your deployed contract address
let contract = null;

window.addEventListener("load", async () => {
  if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
    alert("Please install TronLink and log in.");
    return;
  }

  const abi = await fetch("contract_abi.json").then(res => res.json());
  contract = await tronWeb.contract(abi, CONTRACT_ADDRESS);

  document.getElementById("address").innerText = tronWeb.defaultAddress.base58;
  loadBalance();
});

async function loadBalance() {
  const balance = await contract.balanceOf(tronWeb.defaultAddress.base58).call();
  document.getElementById("balance").innerText = (balance / 1e6).toFixed(2) + " USDTF";
}

async function transfer() {
  const to = document.getElementById("to").value;
  const amount = parseFloat(document.getElementById("amount").value) * 1e6;

  try {
    const result = await contract.transfer(to, amount).send();
    alert("Transfer successful! TX: " + result);
    loadBalance();
  } catch (err) {
    console.error(err);
    alert("Transfer failed.");
  }
}
async function waitForTronWeb() {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        clearInterval(checkInterval);
        resolve(window.tronWeb);
      }
    }, 200);
  });
}

async function connect() {
  const tronWeb = await waitForTronWeb();
  const address = tronWeb.defaultAddress.base58;
  document.getElementById('wallet-address').innerText = "Connected: " + address;

  // Optional: show balance (TRX)
  const balance = await tronWeb.trx.getBalance(address);
  document.getElementById('trx-balance').innerText = "TRX Balance: " + (balance / 1e6).toFixed(2);
}

window.addEventListener("load", connect);

