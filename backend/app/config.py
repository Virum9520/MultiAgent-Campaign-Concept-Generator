from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    openai_model: str = "gpt-4o"
    chroma_persist_dir: str = "./chroma_data"
    chroma_collection_name: str = "campaign_patterns"
    cors_origins: list[str] = ["http://localhost:5173"]
    log_level: str = "INFO"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
