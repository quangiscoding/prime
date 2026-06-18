function formatNumber(str) {
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function checkPrime() {
  const input = document.getElementById("num");
  const num = input.value;

  const res = await fetch(`/api/v1/prime/${num}`);
  const data = await res.json();

  const numberEl = document.querySelector(".number");
  const resultEl = document.getElementById("result");

  if (data.error) {
    numberEl.textContent = "";
    resultEl.textContent = data.error;
  } else {
    numberEl.textContent = formatNumber(data.number);
    resultEl.textContent = data.isPrime ? "is prime ✅" : "is not prime ❌";
  }

  input.value = "";
  input.focus();
}
