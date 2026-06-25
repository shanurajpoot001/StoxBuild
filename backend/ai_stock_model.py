import json
import math
import sys
from datetime import datetime, timedelta, timezone


def number(value, default=0.0):
    try:
        result = float(value)
        if math.isfinite(result):
            return result
    except (TypeError, ValueError):
        pass
    return default


def linear_regression(values):
    n = len(values)
    if n < 2:
        return 0.0, values[-1] if values else 0.0

    x_mean = (n - 1) / 2
    y_mean = sum(values) / n
    numerator = sum((idx - x_mean) * (value - y_mean) for idx, value in enumerate(values))
    denominator = sum((idx - x_mean) ** 2 for idx in range(n)) or 1
    slope = numerator / denominator
    intercept = y_mean - slope * x_mean
    return slope, intercept


def ema(values, period):
    if not values:
        return 0.0
    alpha = 2 / (period + 1)
    current = values[0]
    for value in values[1:]:
        current = alpha * value + (1 - alpha) * current
    return current


def volatility(values):
    returns = []
    for index in range(1, len(values)):
        previous = values[index - 1]
        if previous:
            returns.append((values[index] - previous) / previous)
    if len(returns) < 2:
        return 0.0
    mean = sum(returns) / len(returns)
    variance = sum((item - mean) ** 2 for item in returns) / (len(returns) - 1)
    return math.sqrt(variance)


def rsi(values, period=14):
    if len(values) <= period:
        return 50.0
    gains = []
    losses = []
    for index in range(-period, 0):
        change = values[index] - values[index - 1]
        gains.append(max(change, 0))
        losses.append(abs(min(change, 0)))
    avg_gain = sum(gains) / period
    avg_loss = sum(losses) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))


def confidence_from(values, slope, current_price):
    if len(values) < 10 or current_price <= 0:
        return 0.35
    vol = volatility(values[-45:])
    trend_strength = min(abs(slope) / current_price * 120, 0.35)
    vol_penalty = min(vol * 8, 0.3)
    sample_bonus = min(len(values) / 240, 0.25)
    return max(0.2, min(0.86, 0.42 + trend_strength + sample_bonus - vol_penalty))


def main():
    payload = json.load(sys.stdin)
    candles = payload.get("candles", [])
    horizon = int(number(payload.get("horizonDays"), 10))
    horizon = max(1, min(horizon, 30))

    closes = [number(item.get("close")) for item in candles if number(item.get("close")) > 0]
    timestamps = [item.get("time") for item in candles if number(item.get("close")) > 0]

    if len(closes) < 8:
        raise SystemExit("At least 8 close prices are required for prediction")

    training_window = closes[-120:]
    slope, intercept = linear_regression(training_window)
    current_price = training_window[-1]
    short_ema = ema(training_window[-12:], 12)
    long_ema = ema(training_window[-30:], 30)
    momentum = short_ema - long_ema
    daily_step = slope + (momentum * 0.08)

    last_time = None
    if timestamps:
        try:
            last_time = datetime.fromisoformat(str(timestamps[-1]).replace("Z", "+00:00"))
        except ValueError:
            last_time = None
    if last_time is None:
        last_time = datetime.now(timezone.utc)

    prediction = []
    for day in range(1, horizon + 1):
        projected = current_price + (daily_step * day)
        regression_anchor = intercept + slope * (len(training_window) - 1 + day)
        price = (projected * 0.68) + (regression_anchor * 0.32)
        date = (last_time + timedelta(days=day)).date().isoformat()
        prediction.append({"date": date, "price": round(max(price, 0.01), 2)})

    predicted_price = prediction[-1]["price"]
    expected_return = ((predicted_price - current_price) / current_price) * 100
    rsi_value = rsi(training_window)
    confidence = confidence_from(training_window, daily_step, current_price)

    if expected_return > 2 and rsi_value < 72:
        action = "BUY"
    elif expected_return < -2 or rsi_value > 78:
        action = "SELL"
    else:
        action = "HOLD"

    output = {
        "model": "python-linear-regression-ema-v1",
        "trainedOn": len(training_window),
        "currentPrice": round(current_price, 2),
        "predictedPrice": round(predicted_price, 2),
        "expectedReturn": round(expected_return, 2),
        "confidence": round(confidence, 2),
        "action": action,
        "indicators": {
            "shortEma": round(short_ema, 2),
            "longEma": round(long_ema, 2),
            "rsi": round(rsi_value, 2),
            "dailyTrend": round(daily_step, 4),
            "volatility": round(volatility(training_window[-45:]) * 100, 2),
        },
        "prediction": prediction,
    }
    print(json.dumps(output))


if __name__ == "__main__":
    main()
