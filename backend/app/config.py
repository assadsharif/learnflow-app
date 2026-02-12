from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "LearnFlow"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://learnflow:learnflow@localhost:5432/learnflow"

    # OpenAI
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    # Dapr
    dapr_http_port: int = 3500
    dapr_grpc_port: int = 50001
    pubsub_name: str = "pubsub"
    statestore_name: str = "statestore"

    # Kafka
    kafka_bootstrap_servers: str = "kafka-broker-0.kafka-broker-headless.kafka.svc.cluster.local:9092"

    # Auth
    better_auth_secret: str = "learnflow-dev-secret-change-in-production"
    better_auth_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
