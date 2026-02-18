import traceback
from backend.app.schemas import UserOut
from backend.app.models import User
from datetime import datetime
import uuid

# Test if UserOut can serialize a User object
try:
    user = User(
        id=str(uuid.uuid4()),
        email="test@example.com",
        password_hash="$2b$12$test",
        created_at=datetime.utcnow()
    )
    
    # Try to convert to UserOut
    user_out = UserOut.model_validate(user)
    print(f"UserOut serialization: SUCCESS")
    print(f"Response: {user_out.model_dump_json()}")
except Exception as e:
    print(f"UserOut serialization: FAILED")
    print(f"Error: {e}")
    traceback.print_exc()
