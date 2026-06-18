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

// Health check / root route (FIX for "Cannot GET /")
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "prime-api",
    usage: "/api/v1/prime/17",
  });
});

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }

  return true;
}

app.get("/api/v1/prime/:number", (req, res) => {
  const num = Number(req.params.number);

  if (!Number.isInteger(num) || num < 0) {
    return res.status(400).json({
      error: "number must be a positive integer",
    });
  }

  res.json({
    number: num,
    isPrime: isPrime(num),
  });
});

// IMPORTANT for Railway
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
