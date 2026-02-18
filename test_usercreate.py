import traceback
from backend.app.schemas import UserCreate
from pydantic import ValidationError

# Test UserCreate schema validation
try:
    user_data = {
        "email": "newuser@example.com",
        "password": "password123"
    }
    
    user = UserCreate(**user_data)
    print(f"UserCreate validation: SUCCESS")
    print(f"Email: {user.email}")
    print(f"Password: {user.password}")
except Exception as e:
    print(f"UserCreate validation: FAILED")
    print(f" Error: {e}")
    traceback.print_exc()
