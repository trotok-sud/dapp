let tronWeb;
let contract;

async function init() {
  if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
    alert("Please install TronLink and unlock it.");
    return;
  }

  tronWeb = window.tronWeb;
  document.getElementById("userAddress").textContent = tronWeb.defaultAddress.base58;

  contract = await tronWeb.contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  updateBalance();
}

async function updateBalance() {
  const addr = tronWeb.defaultAddress.base58;
  const balance = await contract.methods.balanceOf(addr).call();
  document.getElementById("balance").textContent = (balance.toString() / 1e6) + " USDTF";
}

async function transferTokens() {
  const to = document.getElementById("recipient").value;
  const amt = parseInt(document.getElementById("amount").value);

  try {
    const tx = await contract.methods.transfer(to, amt).send();
    document.getElementById("txStatus").textContent = "✅ Sent!";
    updateBalance();
  } catch (e) {
    document.getElementById("txStatus").textContent = "❌ Error: " + e.message;
  }
}

window.addEventListener("load", init);
