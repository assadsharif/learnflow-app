"""Pub/Sub service using Dapr for event-driven messaging."""
import httpx
from ..config import settings


class PubSubService:
    """Publish events via Dapr pub/sub (backed by Kafka)."""

    def __init__(self):
        self.base_url = f"http://localhost:{settings.dapr_http_port}/v1.0"
        self.pubsub = settings.pubsub_name

    async def publish(self, topic: str, data: dict) -> bool:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/publish/{self.pubsub}/{topic}",
                json=data,
            )
            return resp.status_code == 204

    async def subscribe_handler(self, topic: str):
        """Return Dapr subscription config for a topic."""
        return {
            "pubsubname": self.pubsub,
            "topic": topic,
            "route": f"/api/v1/events/{topic}",
        }


pubsub_service = PubSubService()
