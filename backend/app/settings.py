from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
import os


class Settings(BaseSettings):
    database_url: str = ""
    jwt_secret_key: str = "default-change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    allowed_origins: str = "http://localhost:3000,http://localhost:3001"

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent / ".env",
        case_sensitive=False,
        env_prefix="",
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

settings = Settings()

# Debug: Log which JWT secret is being used
env_file_path = Path(__file__).parent.parent / ".env"
print(f"🔍 Loading settings from: {env_file_path}")
print(f"🔐 JWT_SECRET_KEY loaded: {settings.jwt_secret_key[:20]}..." if len(settings.jwt_secret_key) > 20 else f"🔐 JWT_SECRET_KEY loaded: {settings.jwt_secret_key}")
