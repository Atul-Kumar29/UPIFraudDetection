from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List, Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ml.features import build_behavioural_features
from ml.generator import build_user_profiles
from ml.predict import predict_anomaly
from simulator.scenarios import (
    generate_account_takeover,
    generate_high_amount_transaction,
    generate_location_anomaly,
    generate_new_device_transaction,
    generate_normal_transaction,
    generate_unusual_time_transaction,
    generate_velocity_attack,
)


USER_HISTORY: Dict[str, List[Dict[str, Any]]] = defaultdict(list)


def _normalize_timestamp(value: Optional[datetime]) -> pd.Timestamp:
    if value is None:
        return pd.Timestamp.now().tz_localize(None)
    ts = pd.Timestamp(value)
    if ts.tzinfo is not None:
        ts = ts.tz_convert("UTC").tz_localize(None)
    return ts

app = FastAPI(
    title="UPI Behavioural Fraud Detection API",
    version="1.0.0"
)


class ScenarioRequest(BaseModel):
    user_id: Optional[str] = "U001"
    scenario: Optional[str] = "normal"
    timestamp: Optional[datetime] = None
    seed: int = 42


SCENARIO_FUNCTIONS: Dict[str, Any] = {
    "normal": generate_normal_transaction,
    "high_amount": generate_high_amount_transaction,
    "high_velocity": generate_velocity_attack,
    "new_device": generate_new_device_transaction,
    "location_anomaly": generate_location_anomaly,
    "unusual_time": generate_unusual_time_transaction,
    "account_takeover": generate_account_takeover,
}


def _predict_transaction(transaction: Dict[str, Any]) -> Dict[str, Any]:
    user_id = transaction["user_id"]
    profiles = build_user_profiles(num_users=max(1, int(user_id[1:]) + 1 if user_id.startswith("U") else 1), seed=42)
    history = USER_HISTORY.get(user_id, [])
    if not history:
        history = []

    candidate = pd.DataFrame([transaction])
    prior_df = pd.DataFrame(history)
    frame = pd.concat([prior_df, candidate], ignore_index=True) if not prior_df.empty else candidate
    if not frame.empty:
        frame["timestamp"] = pd.to_datetime(frame["timestamp"])
        features = build_behavioural_features(frame, profiles)
        prediction = predict_anomaly(features.iloc[-1].to_dict())
        return prediction
    raise HTTPException(status_code=500, detail="No historical context available for feature generation")


@app.get("/")
def root():
    return {
        "message": "UPI Fraud Detection API"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/api/simulator/transaction")
def create_transaction(payload: ScenarioRequest):
    scenario = (payload.scenario or "normal").lower()
    if scenario not in SCENARIO_FUNCTIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported scenario: {scenario}")

    ts = _normalize_timestamp(payload.timestamp)
    transaction = SCENARIO_FUNCTIONS[scenario](user_id=payload.user_id, timestamp=ts.to_pydatetime(), seed=payload.seed)
    transaction["timestamp"] = _normalize_timestamp(transaction["timestamp"])
    USER_HISTORY[transaction["user_id"]].append(transaction)
    prediction = _predict_transaction(transaction)
    return {
        "transaction": transaction,
        "prediction": prediction,
        "scenario": scenario,
    }


@app.post("/api/simulator/scenario")
def simulate_scenario(payload: ScenarioRequest):
    return create_transaction(payload)
