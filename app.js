const CONTRACT_ADDRESS = "TXf6VxedZiDsE1NoMcAE3vKnh6fdjppoG3"; // Replace with your actual contract
let contract = null;

async function waitForTronLink() {
  return new Promise((resolve) => {
    const check = setInterval(() => {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        clearInterval(check);
        resolve(window.tronWeb);
      }
    }, 300);
  });
}

async function initApp() {
  const tronWeb = await waitForTronLink();

  const abi = await fetch("contract_abi.json").then((res) => res.json());
  contract = await tronWeb.contract(abi, CONTRACT_ADDRESS);

  const userAddress = tronWeb.defaultAddress.base58;
  document.getElementById("wallet-address").innerText = userAddress;

  const trxBalance = await tronWeb.trx.getBalance(userAddress);
  document.getElementById("trx-balance").innerText = (trxBalance / 1e6).toFixed(2) + " TRX";

  const tokenBalance = await contract.balanceOf(userAddress).call();
  document.getElementById("token-balance").innerText = (tokenBalance / 1e6).toFixed(2) + " USDTF";
}

async function transfer() {
  const to = document.getElementById("to").value;
  const amount = parseFloat(document.getElementById("amount").value) * 1e6;

  if (!to || isNaN(amount)) {
    alert("Please fill in both address and amount.");
    return;
  }

  try {
    const result = await contract.transfer(to, amount).send();
    document.getElementById("txStatus").innerText = "Transfer successful! TX: " + result;
    initApp(); // Refresh balance
  } catch (err) {
    console.error(err);
    document.getElementById("txStatus").innerText = "Transfer failed.";
  }
}

window.addEventListener("load", initApp);
