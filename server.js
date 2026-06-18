const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (important for Railway / Render)
app.set("trust proxy", 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Static frontend
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Logic
function modPow(base, exponent, modulus) {
  let result = 1n;
  base %= modulus;

  while (exponent > 0n) {
    if (exponent & 1n) {
      result = (result * base) % modulus;
    }

    exponent >>= 1n;
    base = (base * base) % modulus;
  }

  return result;
}

function isPrime(n) {
  if (n < 2n) return false;

  const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

  for (const p of smallPrimes) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }

  let d = n - 1n;
  let s = 0n;

  while (d % 2n === 0n) {
    d /= 2n;
    s++;
  }

  const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n];

  for (const a of witnesses) {
    if (a >= n) continue;

    let x = modPow(a, d, n);

    if (x === 1n || x === n - 1n) {
      continue;
    }

    let composite = true;

    for (let r = 1n; r < s; r++) {
      x = (x * x) % n;

      if (x === n - 1n) {
        composite = false;
        break;
      }
    }

    if (composite) {
      return false;
    }
  }

  return true;
}

app.get("/api/v1/prime/:number", (req, res) => {
  let num;

  try {
    num = BigInt(req.params.number);
  } catch {
    return res.status(400).json({
      error: "invalid number",
    });
  }

  if (num < 0n) {
    return res.status(400).json({
      error: "number must be positive",
    });
  }

  try {
    const result = isPrime(num);

    return res.json({
      number: num.toString(),
      isPrime: result,
    });
  } catch (err) {
    return res.status(500).json({
      error: "server error",
    });
  }
});

// IMPORTANT for Railway
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
