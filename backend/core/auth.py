"""Authentication helpers for HireVision backend."""
import requests
from fastapi import Request, HTTPException
from .config import settings


def get_current_user_id(req: Request) -> str:
    """
    Resolve current user id (UUID) via Supabase Auth /auth/v1/user.
    Requires Authorization: Bearer <access_token> header from the client.
    """
    auth = req.headers.get("authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = auth.split(" ", 1)[1]

    try:
        resp = requests.get(
            f"{settings.supabase_url}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": settings.supabase_anon_key,
            },
            timeout=5,
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Auth service unavailable")

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        user_json = resp.json()
        return user_json["id"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid auth response")

