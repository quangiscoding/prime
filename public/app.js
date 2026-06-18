function formatNumber(str) {
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function checkPrime() {
  const input = document.getElementById("num");
  const num = input.value;

  const res = await fetch(`/api/v1/prime/${num}`);
  const data = await res.json();

  document.getElementById("result").innerText = data.error
    ? data.error
    : `${formatNumber(data.number)} is ${data.isPrime ? "prime" : "not prime"}`;

  input.value = "";
}
