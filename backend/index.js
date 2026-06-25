// require("dotenv").config();
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
const path = require("path");
const { spawn } = require("child_process");

const { HoldingsModel } = require("./model/HoldingsModel");

const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payments");

const PORT = process.env.PORT || 8080;
// Trim is important because some .env editors may keep leading/trailing spaces,
// which breaks MongoDB SRV hostname resolution.
const uri = (process.env.MONGO_URL || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stocks").trim();

const app = express();

const FundTransaction =
  mongoose.models.fundTransaction ||
  mongoose.model(
    "fundTransaction",
    new mongoose.Schema({
      type: { type: String, enum: ["ADD", "WITHDRAW"], required: true },
      amount: { type: Number, required: true, min: 1 },
      method: { type: String, default: "UPI" },
      upiId: { type: String, default: "" },
      note: String,
      createdAt: { type: Date, default: Date.now },
    })
  );

const AccountSetting =
  mongoose.models.accountSetting ||
  mongoose.model(
    "accountSetting",
    new mongoose.Schema({
      userKey: { type: String, default: "default", unique: true },
      commodityEnabled: { type: Boolean, default: false },
      commodityOpenedAt: Date,
      upiId: { type: String, default: "" },
      updatedAt: { type: Date, default: Date.now },
    })
  );

const safeRedactUri = (connectionString) => {
  // Hide credentials (user:pass@) while keeping host visible.
  // Example: mongodb+srv://user:pass@host/... -> mongodb://***@host/...
  return connectionString.replace(/^mongodb(?:\+srv)?:\/\/([^@]+)@/, "mongodb://***@");
};

const connectWithFallback = async (primaryUri) => {
  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    return;
  } catch (err) {
    const message = err?.message || "";
    const isSrv = typeof primaryUri === "string" && primaryUri.startsWith("mongodb+srv://");
    const isSrvDnsIssue = message.includes("querySrv") || message.includes("ENOTFOUND");

    if (isSrv && isSrvDnsIssue) {
      const fallbackUri = primaryUri.replace(/^mongodb\+srv:\/\//, "mongodb://");
      console.warn(
        "MongoDB SRV connect failed (DNS). Trying non-SRV fallback:",
        safeRedactUri(fallbackUri)
      );
      await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 5000 });
      return;
    }

    throw err;
  }
};

// CORS first, before routes
app.use(
  cors({
    origin: [
      process.env.FRONTEND_ORIGIN || "http://localhost:3000",
      process.env.DASHBOARD_ORIGIN || "http://localhost:3001",
      "https://stoxbuild-frontend.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    preflightContinue: false,
  })
);

app.use(bodyParser.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Payment routes
app.use("/api/payments", paymentRoutes);

// app.use("/api/auth", require("./routes/auth"));
// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.get("/allOrders", async (req, res) => {
  let allOrders = await OrdersModel.find({}).sort({ _id: -1 });
  res.json(allOrders);
});

const baseOpeningBalance = Number(process.env.OPENING_BALANCE || 75000);

const fundsSummary = async () => {
  const transactions = await FundTransaction.find({}).sort({ createdAt: -1 });
  const settings =
    (await AccountSetting.findOne({ userKey: "default" })) ||
    (await AccountSetting.create({ userKey: "default" }));
  const totalAdded = transactions
    .filter((transaction) => transaction.type === "ADD")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
  const totalWithdrawn = transactions
    .filter((transaction) => transaction.type === "WITHDRAW")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  return {
    openingBalance: baseOpeningBalance,
    totalAdded,
    totalWithdrawn,
    cashBalance: baseOpeningBalance + totalAdded - totalWithdrawn,
    transactions,
    commodityEnabled: settings.commodityEnabled,
    commodityOpenedAt: settings.commodityOpenedAt,
    upiId: settings.upiId || "",
    updatedAt: new Date().toISOString(),
  };
};

app.get("/api/funds", async (_req, res) => {
  res.json(await fundsSummary());
});

app.post("/api/funds/add", async (req, res) => {
  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: "Enter a valid amount" });
  }

  await FundTransaction.create({
    type: "ADD",
    amount,
    method: req.body.method || "UPI",
    upiId: req.body.upiId || "",
    note: req.body.note || "Funds added",
  });

  res.json(await fundsSummary());
});

app.post("/api/funds/withdraw", async (req, res) => {
  const amount = Number(req.body.amount);
  const summary = await fundsSummary();

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: "Enter a valid amount" });
  }

  if (amount > summary.cashBalance) {
    return res.status(400).json({ error: "Withdraw amount exceeds cash balance" });
  }

  await FundTransaction.create({
    type: "WITHDRAW",
    amount,
    method: req.body.method || "Bank",
    upiId: req.body.upiId || "",
    note: req.body.note || "Funds withdrawn",
  });

  res.json(await fundsSummary());
});

app.post("/api/accounts/commodity", async (_req, res) => {
  await AccountSetting.findOneAndUpdate(
    { userKey: "default" },
    {
      commodityEnabled: true,
      commodityOpenedAt: new Date(),
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  res.json(await fundsSummary());
});

app.post("/api/accounts/upi", async (req, res) => {
  const upiId = String(req.body.upiId || "").trim();
  if (!upiId) {
    return res.status(400).json({ error: "Enter a valid UPI ID" });
  }

  await AccountSetting.findOneAndUpdate(
    { userKey: "default" },
    {
      upiId,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  res.json(await fundsSummary());
});

const symbolAliases = {
  HUL: "HINDUNILVR",
  "M&M": "M&M",
};

const toYahooSymbol = (symbol = "") => {
  const clean = String(symbol).trim().toUpperCase();
  if (!clean) return "";
  if (clean.includes(".") || clean.startsWith("^")) return clean;
  return `${symbolAliases[clean] || clean}.NS`;
};

const getJson = (url) =>
  new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 StoxBuild Dashboard",
          Accept: "application/json",
        },
      },
      (response) => {
        let body = "";

        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`Quote provider responded ${response.statusCode}`));
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        });
      }
    );

    request.setTimeout(8000, () => {
      request.destroy(new Error("Quote provider timed out"));
    });
    request.on("error", reject);
  });

const lastNumber = (values = []) => {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    const value = Number(values[index]);
    if (Number.isFinite(value)) return value;
  }
  return null;
};

const chartQuoteFor = async (symbol) => {
  const providerSymbol = toYahooSymbol(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    providerSymbol
  )}?range=1d&interval=1m`;
  const payload = await getJson(url);
  const result = payload?.chart?.result?.[0];
  const meta = result?.meta || {};
  const closes = result?.indicators?.quote?.[0]?.close || [];
  const price = Number(meta.regularMarketPrice) || lastNumber(closes);
  const previousClose = Number(meta.chartPreviousClose || meta.previousClose);
  const change =
    Number.isFinite(price) && Number.isFinite(previousClose)
      ? price - previousClose
      : 0;
  const percent = previousClose ? (change / previousClose) * 100 : 0;

  if (!Number.isFinite(price)) {
    throw new Error(`No live price for ${symbol}`);
  }

  return {
    symbol,
    providerSymbol,
    name: meta.shortName || meta.longName || symbol,
    price,
    previousClose: Number.isFinite(previousClose) ? previousClose : null,
    change,
    percent,
    currency: meta.currency || "INR",
    marketState: meta.marketState || "UNKNOWN",
    exchange: meta.fullExchangeName || meta.exchangeName || "NSE",
    time: meta.regularMarketTime
      ? new Date(meta.regularMarketTime * 1000).toISOString()
      : new Date().toISOString(),
  };
};

const historicalCandlesFor = async (symbol, range = "6mo", interval = "1d") => {
  const providerSymbol = toYahooSymbol(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    providerSymbol
  )}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`;
  const payload = await getJson(url);
  const result = payload?.chart?.result?.[0];
  const quote = result?.indicators?.quote?.[0] || {};
  const timestamps = result?.timestamp || [];
  const candles = timestamps
    .map((timestamp, index) => ({
      time: new Date(timestamp * 1000).toISOString(),
      open: Number(quote.open?.[index]),
      high: Number(quote.high?.[index]),
      low: Number(quote.low?.[index]),
      close: Number(quote.close?.[index]),
      volume: Number(quote.volume?.[index] || 0),
    }))
    .filter((candle) => Number.isFinite(candle.close) && candle.close > 0);

  if (!candles.length) {
    throw new Error(`No historical candles for ${symbol}`);
  }

  return {
    symbol,
    providerSymbol,
    meta: result?.meta || {},
    candles,
  };
};

const runPythonForecast = (payload) =>
  new Promise((resolve, reject) => {
    const pythonCommand = process.env.PYTHON_BIN || "python";
    const scriptPath = path.join(__dirname, "ai_stock_model.py");
    const child = spawn(pythonCommand, [scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Python model exited with code ${code}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (err) {
        reject(err);
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });

const postJson = (url, payload, extraHeaders = {}) =>
  new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const body = JSON.stringify(payload);
    const request = https.request(
      {
        hostname: parsed.hostname,
        path: `${parsed.pathname}${parsed.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          ...extraHeaders,
        },
        timeout: 12000,
      },
      (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`Gemini responded ${response.statusCode}`));
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    request.on("timeout", () => request.destroy(new Error("Gemini timed out")));
    request.on("error", reject);
    request.write(body);
    request.end();
  });

const buildRagContext = ({ symbol, quote, candles, forecast }) => {
  const recentCandles = candles.slice(-20).map((candle) => ({
    date: candle.time.slice(0, 10),
    close: candle.close,
    volume: candle.volume,
  }));

  return {
    symbol,
    liveQuote: quote,
    recentCandles,
    modelForecast: forecast,
    rules: [
      "Do not guarantee returns.",
      "Return short practical trading guidance.",
      "Mention risk and confidence.",
    ],
  };
};

const deterministicAdvice = (forecast) => {
  const actionMap = {
    BUY: "Trend is positive, but enter in parts and keep a strict stop-loss.",
    SELL: "Forecast is weak or overbought; reduce exposure or wait for a better setup.",
    HOLD: "Signal is mixed; track price action before adding fresh capital.",
  };

  return {
    provider: "local-rag-fallback",
    summary: actionMap[forecast.action] || actionMap.HOLD,
    suggestion: forecast.action,
    risk: forecast.confidence < 0.5 ? "High" : "Moderate",
  };
};

const geminiAdviceFor = async (ragContext) => {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_KEY ||
    process.env.GOOGLE_API_KEY;
  if (!apiKey) return deterministicAdvice(ragContext.modelForecast);

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const prompt = `You are an assistant inside a stock dashboard. Use only this JSON RAG context to produce concise educational analysis, not financial guarantees. Return valid JSON with keys summary, suggestion, risk, reasons.\n\n${JSON.stringify(
    ragContext
  )}`;

  try {
    const response = await postJson(
      url,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      },
      { "x-goog-api-key": apiKey }
    );
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return deterministicAdvice(ragContext.modelForecast);
    return {
      provider: "gemini-rag",
      ...JSON.parse(text),
    };
  } catch (err) {
    console.warn("Gemini RAG failed:", err?.message || err);
    return deterministicAdvice(ragContext.modelForecast);
  }
};

const localMentorAnswer = (question = "") => {
  const text = question.toLowerCase();
  if (text.includes("intraday")) {
    return "Intraday trading means buying and selling within the same market day. Beginners should use small position sizes, predefined stop-losses, and avoid trading around major news until they understand volatility.";
  }
  if (text.includes("stop") || text.includes("loss")) {
    return "A stop-loss is a price level where you exit to limit loss. Decide it before entering a trade, place it near invalidation of your setup, and avoid moving it further away after entry.";
  }
  if (text.includes("sell")) {
    return "You can sell to book profit, reduce risk, or exit when your original reason for buying is no longer valid. In delivery holdings, selling closes your position; in intraday/F&O, selling may also create short exposure.";
  }
  if (text.includes("option") || text.includes("future")) {
    return "Futures and options are leveraged derivatives. They can move faster than equity delivery and can create large losses. Learn contract size, expiry, margin, and option Greeks before trading them.";
  }
  return "Start with delivery investing, learn order types, risk per trade, position sizing, and basic chart reading. Treat every AI or indicator signal as research support, not a guaranteed trade.";
};

app.post("/api/ai/mentor", async (req, res) => {
  const question = String(req.body?.question || "").trim();
  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.json({
      provider: "local-mentor-fallback",
      answer: localMentorAnswer(question),
    });
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const prompt = `You are an educational stock market mentor inside StoxFlow. Answer this beginner question clearly in 5-8 sentences. Do not give guaranteed profit claims. Include practical risk guidance.\n\nQuestion: ${question}`;

  try {
    const response = await postJson(
      url,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
      { "x-goog-api-key": apiKey }
    );
    const answer = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({
      provider: "gemini-mentor",
      answer: answer || localMentorAnswer(question),
    });
  } catch (err) {
    console.warn("Gemini mentor failed:", err?.message || err);
    res.json({
      provider: "local-mentor-fallback",
      answer: localMentorAnswer(question),
    });
  }
});

app.get("/api/market/quotes", async (req, res) => {
  const requestedSymbols = String(req.query.symbols || "")
    .split(",")
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(Boolean);

  const uniqueSymbols = [...new Set(requestedSymbols)].slice(0, 60);

  if (!uniqueSymbols.length) {
    return res.json({ source: "yahoo-finance-chart", quotes: [] });
  }

  try {
    const settledQuotes = await Promise.allSettled(
      uniqueSymbols.map((symbol) => chartQuoteFor(symbol))
    );
    const quotes = settledQuotes
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    if (!quotes.length) {
      throw new Error("No symbols returned live quote data");
    }

    res.json({
      source: "yahoo-finance-chart",
      asOf: new Date().toISOString(),
      quotes,
    });
  } catch (err) {
    console.error("Quote fetch failed:", err?.message || err);
    res.status(502).json({
      source: "yahoo-finance-chart",
      error: "Unable to fetch live quotes right now",
      quotes: [],
    });
  }
});

app.get("/api/ai/predict", async (req, res) => {
  const symbol = String(req.query.symbol || "INFY").trim().toUpperCase();
  const horizonDays = Math.max(1, Math.min(Number(req.query.days || 10), 30));

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  try {
    const [history, quote] = await Promise.all([
      historicalCandlesFor(symbol, "6mo", "1d"),
      chartQuoteFor(symbol),
    ]);
    const forecast = await runPythonForecast({
      symbol,
      horizonDays,
      candles: history.candles,
    });
    const ragContext = buildRagContext({
      symbol,
      quote,
      candles: history.candles,
      forecast,
    });
    const advice = await geminiAdviceFor(ragContext);

    res.json({
      source: "yahoo-finance-chart",
      symbol,
      providerSymbol: history.providerSymbol,
      asOf: new Date().toISOString(),
      quote,
      candles: history.candles.slice(-60),
      forecast,
      advice,
      disclaimer:
        "AI predictions are educational estimates based on recent market data, not guaranteed investment advice.",
    });
  } catch (err) {
    console.error("AI prediction failed:", err?.message || err);
    res.status(502).json({
      error: "Unable to generate AI prediction right now",
      details: err?.message || "Unknown error",
    });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim().toUpperCase();
    const qty = Number(req.body.qty);
    const price = Number(req.body.price);
    const mode = String(req.body.mode || "BUY").trim().toUpperCase();
    const paymentMethod = req.body.paymentMethod || "Funds";
    const amount = Number((qty * price).toFixed(2));

    if (!name || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ error: "Enter a valid stock, quantity and price" });
    }

    if (!["BUY", "SELL"].includes(mode)) {
      return res.status(400).json({ error: "Order mode must be BUY or SELL" });
    }

    const summary = await fundsSummary();
    if (mode === "BUY" && amount > summary.cashBalance) {
      return res.status(400).json({
        error: "Insufficient funds. Add funds before placing this buy order.",
        cashBalance: summary.cashBalance,
        required: amount,
      });
    }

    const order = await OrdersModel.create({
      name,
      qty,
      price,
      mode,
      amount,
      paymentMethod,
      status: "EXECUTED",
    });

    await FundTransaction.create({
      type: mode === "BUY" ? "WITHDRAW" : "ADD",
      amount,
      method: paymentMethod,
      note: `${mode} ${qty} ${name} @ ${price}`,
    });

    res.status(201).json({
      message: `${mode} order executed`,
      order,
      funds: await fundsSummary(),
    });
  } catch (err) {
    res.status(500).json({ error: "Unable to place order", details: err.message });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

let isDbConnected = false;

const ensureMongo = async () => {
  try {
    await connectWithFallback(uri);
    isDbConnected = true;
    console.log("DB started!");
  } catch (err) {
    isDbConnected = false;
    console.error("MongoDB connection failed:", err?.message || err);
    console.log("Retrying MongoDB connection in 10 seconds...");
    setTimeout(ensureMongo, 10_000);
  }
};

app.listen(PORT, () => {
  console.log("App started!");
  ensureMongo();
});

// Simple status endpoint for debugging connection issues from the frontend.
app.get("/health/db", (req, res) => {
  res.json({ connected: isDbConnected });
});
