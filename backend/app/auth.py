"""Auth dependency for validating Better Auth session tokens."""
from fastapi import Depends, HTTPException, Request
from .config import settings
import httpx


async def get_current_user(request: Request) -> dict:
    """Validate the session by calling Better Auth's session endpoint."""
    cookie = request.headers.get("cookie", "")
    if not cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{settings.better_auth_url}/api/auth/get-session",
                headers={"cookie": cookie},
                timeout=5.0,
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")

            data = resp.json()
            if not data or not data.get("user"):
                raise HTTPException(status_code=401, detail="Invalid session")

            return data["user"]
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Auth service unavailable")


async def optional_user(request: Request) -> dict | None:
    """Optional auth — returns user if authenticated, None otherwise."""
    try:
        return await get_current_user(request)
    except HTTPException:
        return None
