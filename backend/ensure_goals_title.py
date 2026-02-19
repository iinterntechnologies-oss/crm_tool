from sqlalchemy import text
from app.db import engine


def main() -> None:
    with engine.begin() as conn:
        conn.execute(
            text(
                "ALTER TABLE goals "
                "ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT '' NOT NULL"
            )
        )
    print("goals.title ensured")


if __name__ == "__main__":
    main()
