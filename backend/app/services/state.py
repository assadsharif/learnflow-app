"""State management service using Dapr state store."""
import httpx
from ..config import settings


class StateService:
    """Manage session state via Dapr state store."""

    def __init__(self):
        self.base_url = f"http://localhost:{settings.dapr_http_port}/v1.0"
        self.store = settings.statestore_name

    async def get_state(self, key: str) -> dict | None:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/state/{self.store}/{key}")
            if resp.status_code == 200 and resp.text:
                return resp.json()
            return None

    async def save_state(self, key: str, value: dict) -> bool:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/state/{self.store}",
                json=[{"key": key, "value": value}],
            )
            return resp.status_code == 204

    async def delete_state(self, key: str) -> bool:
        async with httpx.AsyncClient() as client:
            resp = await client.delete(f"{self.base_url}/state/{self.store}/{key}")
            return resp.status_code == 204


state_service = StateService()
