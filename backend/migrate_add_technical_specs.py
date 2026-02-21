"""
Migration script to add technical specifications to Client and Customer tables.
Run this script to update your existing database with the new columns.

Usage:
    cd backend
    python migrate_add_technical_specs.py
"""

from sqlalchemy import create_engine, text
from app.settings import settings

# Create engine
engine = create_engine(settings.database_url)

# Migration SQL statements
migration_statements = [
    # Add columns to clients table
    """
    ALTER TABLE clients ADD COLUMN domain_name VARCHAR(255) DEFAULT NULL;
    """,
    """
    ALTER TABLE clients ADD COLUMN hosting_provider VARCHAR(255) DEFAULT NULL;
    """,
    """
    ALTER TABLE clients ADD COLUMN cms_type VARCHAR(100) DEFAULT NULL;
    """,
    """
    ALTER TABLE clients ADD COLUMN project_stage VARCHAR(50) DEFAULT 'Discovery';
    """,
    """
    ALTER TABLE clients ADD COLUMN maintenance_plan BOOLEAN DEFAULT FALSE;
    """,
    """
    ALTER TABLE clients ADD COLUMN renewal_date DATE DEFAULT NULL;
    """,
    # Add columns to customers table
    """
    ALTER TABLE customers ADD COLUMN domain_name VARCHAR(255) DEFAULT NULL;
    """,
    """
    ALTER TABLE customers ADD COLUMN hosting_provider VARCHAR(255) DEFAULT NULL;
    """,
    """
    ALTER TABLE customers ADD COLUMN cms_type VARCHAR(100) DEFAULT NULL;
    """,
    """
    ALTER TABLE customers ADD COLUMN maintenance_plan BOOLEAN DEFAULT FALSE;
    """,
    """
    ALTER TABLE customers ADD COLUMN renewal_date DATE DEFAULT NULL;
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
    print("Starting migration: Adding technical specifications to Client and Customer tables...")
    run_migration()
