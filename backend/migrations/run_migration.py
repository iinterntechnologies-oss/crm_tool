#!/usr/bin/env python
"""
Database Migration Script: Add Referential Integrity with Foreign Keys
This script adds ForeignKey constraints and cascade deletes to Task, Note, and Activity tables.
"""

import sys
from pathlib import Path
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError, OperationalError

# Add the backend to the path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

from app.db import engine, Base
from app import models


def table_has_column(inspector, table_name: str, column_name: str) -> bool:
    """Check if a table has a specific column."""
    columns = inspector.get_columns(table_name)
    return any(col['name'] == column_name for col in columns)


def get_foreign_keys(inspector, table_name: str):
    """Get all foreign keys for a table."""
    return inspector.get_foreign_keys(table_name)


def run_migration():
    """Run the referential integrity migration."""
    print("🔄 Starting Database Migration: Add Referential Integrity")
    print("=" * 70)
    
    inspector = inspect(engine)
    dialect = engine.dialect.name
    
    print(f"Database Type: {dialect}")
    
    # Check if we're using SQLite and enable foreign keys
    if dialect == 'sqlite':
        with engine.connect() as conn:
            conn.execute(text("PRAGMA foreign_keys = ON"))
            conn.commit()
            print("✅ Enabled SQLite foreign key constraints")
    
    migration_steps = []
    
    # Step 1: Check and add Task ForeignKey columns
    print("\n1️⃣  Checking Task table...")
    if not table_has_column(inspector, 'tasks', 'client_id'):
        migration_steps.append(("tasks", "client_id"))
        print("  ❌ Missing client_id column - will add")
    else:
        print("  ✅ client_id column exists")
    
    if not table_has_column(inspector, 'tasks', 'lead_id'):
        migration_steps.append(("tasks", "lead_id"))
        print("  ❌ Missing lead_id column - will add")
    else:
        print("  ✅ lead_id column exists")
    
    # Step 2: Check and add Note ForeignKey columns
    print("\n2️⃣  Checking Note table...")
    if not table_has_column(inspector, 'notes', 'client_id'):
        migration_steps.append(("notes", "client_id"))
        print("  ❌ Missing client_id column - will add")
    else:
        print("  ✅ client_id column exists")
    
    if not table_has_column(inspector, 'notes', 'lead_id'):
        migration_steps.append(("notes", "lead_id"))
        print("  ❌ Missing lead_id column - will add")
    else:
        print("  ✅ lead_id column exists")
    
    # Step 3: Check and add Activity ForeignKey columns
    print("\n3️⃣  Checking Activity table...")
    activity_columns = ['lead_id', 'client_id', 'goal_id', 'task_id', 'customer_id']
    for col in activity_columns:
        if not table_has_column(inspector, 'activities', col):
            migration_steps.append(("activities", col))
            print(f"  ❌ Missing {col} column - will add")
        else:
            print(f"  ✅ {col} column exists")
    
    # If no changes needed
    if not migration_steps:
        print("\n" + "=" * 70)
        print("✅ Database is already up to date!")
        return True
    
    # Execute migration
    print("\n" + "=" * 70)
    print(f"📝 Applying {len(migration_steps)} changes...")
    
    try:
        with engine.connect() as conn:
            for table_name, column_name in migration_steps:
                # Determine the column type and constraint
                if table_name == 'tasks':
                    if column_name == 'client_id':
                        sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} VARCHAR(36) REFERENCES clients(id) ON DELETE CASCADE"
                    elif column_name == 'lead_id':
                        sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} VARCHAR(36) REFERENCES leads(id) ON DELETE CASCADE"
                
                elif table_name == 'notes':
                    if column_name == 'client_id':
                        sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} VARCHAR(36) REFERENCES clients(id) ON DELETE CASCADE"
                    elif column_name == 'lead_id':
                        sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} VARCHAR(36) REFERENCES leads(id) ON DELETE CASCADE"
                
                elif table_name == 'activities':
                    if column_name == 'lead_id':
                        sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} VARCHAR(36) REFERENCES leads(id) ON DELETE CASCADE"
                    elif column_name == 'client_id':
                        sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} VARCHAR(36) REFERENCES clients(id) ON DELETE CASCADE"
                    elif column_name == 'goal_id':
                        sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} VARCHAR(36) REFERENCES goals(id) ON DELETE CASCADE"
                    elif column_name == 'task_id':
                        sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} VARCHAR(36) REFERENCES tasks(id) ON DELETE CASCADE"
                    elif column_name == 'customer_id':
                        sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} VARCHAR(36) REFERENCES customers(id) ON DELETE CASCADE"
                
                try:
                    print(f"  Adding {table_name}.{column_name}...", end=" ")
                    conn.execute(text(sql))
                    conn.commit()
                    print("✅")
                except OperationalError as e:
                    if "already exists" in str(e).lower():
                        print("✅ (already exists)")
                    else:
                        print(f"❌\n    Error: {e}")
                        raise
            
            # Populate ForeignKey columns from existing data
            print("\n📋 Populating ForeignKey columns from existing data...")
            
            # Tasks
            try:
                print("  Updating tasks.client_id...", end=" ")
                conn.execute(text("UPDATE tasks SET client_id = related_id WHERE related_to = 'client' AND related_id IS NOT NULL"))
                conn.commit()
                print("✅")
            except Exception as e:
                print(f"⚠️  {e}")
            
            try:
                print("  Updating tasks.lead_id...", end=" ")
                conn.execute(text("UPDATE tasks SET lead_id = related_id WHERE related_to = 'lead' AND related_id IS NOT NULL"))
                conn.commit()
                print("✅")
            except Exception as e:
                print(f"⚠️  {e}")
            
            # Notes
            try:
                print("  Updating notes.client_id...", end=" ")
                conn.execute(text("UPDATE notes SET client_id = related_id WHERE related_to = 'client' AND related_id IS NOT NULL"))
                conn.commit()
                print("✅")
            except Exception as e:
                print(f"⚠️  {e}")
            
            try:
                print("  Updating notes.lead_id...", end=" ")
                conn.execute(text("UPDATE notes SET lead_id = related_id WHERE related_to = 'lead' AND related_id IS NOT NULL"))
                conn.commit()
                print("✅")
            except Exception as e:
                print(f"⚠️  {e}")
        
        print("\n" + "=" * 70)
        print("✅ Migration completed successfully!")
        print("\n📊 Summary of changes:")
        for table_name, column_name in migration_steps:
            print(f"  • Added ForeignKey: {table_name}.{column_name}")
        
        return True
    
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        print("\n💡 Rollback by restoring from database backup")
        return False


if __name__ == "__main__":
    try:
        success = run_migration()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
