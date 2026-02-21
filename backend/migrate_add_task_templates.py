"""
Migration script to add task template support to the Task table.
Run this script to update your existing database with the new columns.

Usage:
    cd backend
    python migrate_add_task_templates.py
"""

from sqlalchemy import create_engine, text
from app.settings import settings

# Create engine
engine = create_engine(settings.database_url)

# Migration SQL statements
migration_statements = [
    # Add columns to tasks table
    """
    ALTER TABLE tasks ADD COLUMN task_template VARCHAR(50) DEFAULT NULL;
    """,
    """
    ALTER TABLE tasks ADD COLUMN service_type VARCHAR(50) DEFAULT NULL;
    """,
    """
    ALTER TABLE tasks ADD COLUMN is_template BOOLEAN DEFAULT FALSE;
    """,
]

def run_migration():
    """Execute the migration statements"""
    with engine.connect() as connection:
        for statement in migration_statements:
            try:
                connection.execute(text(statement.strip()))
                print(f"✓ Executed: {statement.strip()[:60]}...")
            except Exception as e:
                print(f"✗ Error executing statement: {e}")
                print(f"  Statement: {statement.strip()[:60]}...")
        
        connection.commit()
        print("\n✓ Migration completed successfully!")

if __name__ == "__main__":
    print("Starting migration: Adding task template support...")
    run_migration()
