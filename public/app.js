async function checkPrime() {
  const num = document.getElementById("num").value;

  const res = await fetch(`/api/v1/prime/${num}`);
  const data = await res.json();

  document.getElementById("result").innerText = data.error
    ? data.error
    : `${data.number} is ${data.isPrime ? "prime" : "not prime"}`;
}
