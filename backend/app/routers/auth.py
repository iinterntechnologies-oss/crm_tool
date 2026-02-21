from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import logging
from ..db import get_db
from ..crud import create_user, get_user_by_email
from ..auth import create_access_token, verify_password
from ..schemas import Token, UserCreate, UserOut

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with email and password"""
    logger.info(f"📝 Register attempt: email={payload.email}")
    existing = get_user_by_email(db, payload.email)
    if existing:
        logger.warning(f"⚠️ User already exists: {payload.email}")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    try:
        user = create_user(db, payload.email, payload.password)
        logger.info(f"✅ User created successfully: {payload.email}")
        return user
    except Exception as e:
        logger.error(f"❌ Error registering user: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login with email and password, returns JWT token"""
    logger.info(f"🔑 Login attempt: username={form_data.username}")
    user = get_user_by_email(db, form_data.username)
    if not user:
        logger.warning(f"⚠️ User not found: {form_data.username}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(form_data.password, user.password_hash):
        logger.warning(f"⚠️ Invalid password for user: {form_data.username}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    try:
        token = create_access_token(user.email)
        logger.info(f"✅ Login successful: {form_data.username}")
        return Token(access_token=token, token_type="bearer")
    except Exception as e:
        logger.error(f"❌ Error generating token: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Token generation failed")
