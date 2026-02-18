import traceback
from backend.app.schemas import UserCreate
from backend.app.routers.auth import register
from backend.app.db import SessionLocal, Base, engine
from datetime import datetime
import uuid

# Create tables
Base.metadata.create_all(bind=engine)

# Get a database session
db = SessionLocal()

try:
    # Create a unique email using timestamp
    email = f"test_{datetime.now().timestamp()}@example.com"
    
    payload = UserCreate(email=email, password="password123")
    print(f"Testing register with email: {payload.email}")
    
    # Call the register endpoint handler
    result = register(payload, db)
    print(f"Register SUCCESS")
    print(f"User ID: {result.id}")
    print(f"Email: {result.email}")
    
except Exception as e:
    print(f"Register FAILED")
    print(f"Error: {e}")
    traceback.print_exc()
finally:
    db.close()
