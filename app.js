const CONTRACT_ADDRESS = "TXf6VxedZiDsE1NoMcAE3vKnh6fdjppoG3"; // replace with your deployed contract address
let contract = null;

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

async function connectAndInit() {
  const tronWeb = await waitForTronWeb();
  const address = tronWeb.defaultAddress.base58;

  document.getElementById("wallet-address").innerText = "Connected: " + address;

  const trxBalance = await tronWeb.trx.getBalance(address);
  document.getElementById("trx-balance").innerText = "TRX Balance: " + (trxBalance / 1e6).toFixed(2);

  const abi = await fetch("contract_abi.json").then(res => res.json());
  contract = await tronWeb.contract(abi, CONTRACT_ADDRESS);

  await loadTokenBalance();
}

async function loadTokenBalance() {
  if (!contract) return;
  const address = tronWeb.defaultAddress.base58;
  const balance = await contract.balanceOf(address).call();
  document.getElementById("token-balance").innerText = "USDTF Balance: " + (balance / 1e6).toFixed(2);
}

async function transfer() {
  const to = document.getElementById("to").value;
  const amount = parseFloat(document.getElementById("amount").value) * 1e6;

  try {
    const result = await contract.transfer(to, amount).send();
    alert("Transfer successful! TX: " + result);
    await loadTokenBalance();
  } catch (err) {
    console.error(err);
    alert("Transfer failed.");
  }
}

window.addEventListener("load", connectAndInit);
