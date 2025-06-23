const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const resultDiv = document.getElementById("result");
const historyList = document.getElementById("history-list");

async function loadCurrencies() {
  try {
    const res = await fetch("https://api.frankfurter.app/currencies");
    const currencies = await res.json();

    for (let code in currencies) {
      const flag = getFlagEmoji(getCountryCode(code));
      const text = `${flag} ${code} - ${currencies[code]}`;

      const opt1 = new Option(text, code);
      const opt2 = new Option(text, code);
      fromCurrency.add(opt1);
      toCurrency.add(opt2);
    }

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
  } catch (err) {
    resultDiv.textContent = "Error loading currencies.";
    console.error(err);
  }
}

function getCountryCode(currencyCode) {
  const map = {
    EUR: "EU", USD: "US", INR: "IN", GBP: "GB", JPY: "JP", AUD: "AU", CAD: "CA",
    CNY: "CN", RUB: "RU", BRL: "BR", ZAR: "ZA", SGD: "SG", MYR: "MY", HKD: "HK",
  };
  return map[currencyCode] || currencyCode.substring(0, 2);
}

function getFlagEmoji(cc) {
  return cc.toUpperCase().replace(/./g, char =>
    String.fromCodePoint(127397 + char.charCodeAt())
  );
}

async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || from === to) {
    resultDiv.textContent = "Enter valid amount and different currencies.";
    return;
  }

  try {
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    const res = await fetch(url);
    const data = await res.json();
    const rate = data.rates[to];

    resultDiv.textContent = `${amount} ${from} = ${rate} ${to}`;
    addToHistory(`${amount} ${from} ➡️ ${rate} ${to}`);
  } catch (err) {
    resultDiv.textContent = "Conversion failed.";
    console.error(err);
  }
}

function addToHistory(entry) {
  const li = document.createElement("li");
  li.textContent = entry;
  historyList.prepend(li);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

loadCurrencies();
