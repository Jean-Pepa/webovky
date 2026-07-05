#!/usr/bin/env python3
"""Stahne aktivity z Garminu (garth) a upsertne je do Supabase (cockpit_activities).

Env promenne:
    GARMIN_TOKEN                 token z get-token.py (garth client.dumps())
    SUPABASE_URL                 https://<projekt>.supabase.co
    SUPABASE_SERVICE_ROLE_KEY    service_role key ze Supabase
    SYNC_LIMIT                   kolik poslednich aktivit (vychozi 50)

Prihlaseni se NEDELA (zadne MFA) — jen se nacte ulozeny token a obnovi se.
Bezi lokalne, z GitHub Action cronu nebo z tveho budouciho bota na PC.
"""
import os
import sys
import json
import garth
import requests

# Mapovani Garmin typu na typy v cockpitu.
TYPE_MAP = {
    "running": "running", "trail_running": "running", "treadmill_running": "running",
    "track_running": "running", "indoor_running": "running", "virtual_run": "running",
    "cycling": "cycling", "road_biking": "cycling", "mountain_biking": "cycling",
    "indoor_cycling": "cycling", "virtual_ride": "cycling", "gravel_cycling": "cycling",
    "lap_swimming": "swimming", "open_water_swimming": "swimming",
    "strength_training": "strength", "indoor_cardio": "strength", "hiit": "strength",
    "walking": "walking", "hiking": "walking", "casual_walking": "walking",
    "resort_skiing_snowboarding": "skiing", "cross_country_classic_skiing": "skiing",
    "cross_country_skiing": "skiing", "backcountry_skiing": "skiing", "skate_skiing": "skiing",
}


def map_type(type_key):
    if not type_key:
        return "other"
    tk = str(type_key).lower()
    if tk in TYPE_MAP:
        return TYPE_MAP[tk]
    if "run" in tk:
        return "running"
    if "cycl" in tk or "bik" in tk or "ride" in tk:
        return "cycling"
    if "ski" in tk:
        return "skiing"
    if "swim" in tk:
        return "swimming"
    if "strength" in tk:
        return "strength"
    if "walk" in tk or "hik" in tk:
        return "walking"
    return "other"


def to_int(v):
    return int(v) if isinstance(v, (int, float)) else None


def main():
    token = os.environ.get("GARMIN_TOKEN")
    url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not (token and url and key):
        sys.exit("Chybi GARMIN_TOKEN / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.")

    garth.client.loads(token)
    limit = int(os.environ.get("SYNC_LIMIT", "50"))

    acts = garth.connectapi(
        "/activitylist-service/activities/search/activities",
        params={"start": 0, "limit": limit},
    ) or []
    print(f"Staženo {len(acts)} aktivit z Garminu.")

    rows = []
    for a in acts:
        dist_m = a.get("distance") or 0
        dur_s = a.get("duration") or 0
        typ = map_type((a.get("activityType") or {}).get("typeKey"))
        pace = None
        if dist_m and dur_s and typ in ("running", "walking", "skiing"):
            pace = round(dur_s / (dist_m / 1000.0), 1)
        start = a.get("startTimeLocal") or a.get("startTimeGMT") or ""
        rows.append({
            "id": str(a.get("activityId")),
            "date": start[:10],
            "type": typ,
            "name": a.get("activityName"),
            "distance_km": round(dist_m / 1000.0, 3) if dist_m else None,
            "duration_s": to_int(dur_s) or None,
            "pace_s_per_km": pace,
            "avg_hr": to_int(a.get("averageHR")),
            "max_hr": to_int(a.get("maxHR")),
            "vo2max": a.get("vO2MaxValue"),
            "training_effect": a.get("aerobicTrainingEffect"),
            "elevation_gain_m": a.get("elevationGain"),
            "calories": to_int(a.get("calories")),
            "raw": a,
        })

    if not rows:
        print("Zadne aktivity ke zpracovani.")
        return

    resp = requests.post(
        f"{url}/rest/v1/cockpit_activities",
        params={"on_conflict": "id"},
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        data=json.dumps(rows),
        timeout=30,
    )
    if resp.status_code >= 300:
        sys.exit(f"Supabase chyba {resp.status_code}: {resp.text}")
    print(f"Hotovo: upsertnuto {len(rows)} aktivit do Supabase.")


if __name__ == "__main__":
    main()
