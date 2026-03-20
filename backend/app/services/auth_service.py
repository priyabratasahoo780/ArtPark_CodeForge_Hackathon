import os
import json
from datetime import datetime, timedelta
from typing import Optional, Dict
from passlib.context import CryptContext
import jwt
from fastapi import HTTPException, status

from app.models.user import UserCreate, UserInDB

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "super_secret_key_change_me_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# Use a local JSON file in datasets to mock a database for incremental implementation
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "datasets", "users.json")

class AuthService:
    def __init__(self):
        # Ensure the mock DB exists
        if not os.path.exists(DB_PATH):
            os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
            with open(DB_PATH, 'w') as f:
                json.dump({}, f)

    def _load_users(self) -> Dict[str, dict]:
        try:
            with open(DB_PATH, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}

    def _save_users(self, users: Dict[str, dict]):
        with open(DB_PATH, 'w') as f:
            json.dump(users, f, indent=2)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        users = self._load_users()
        email_lower = email.lower()
        if email_lower in users:
            return UserInDB(**users[email_lower])
        return None

    def register_user(self, user: UserCreate) -> UserInDB:
        users = self._load_users()
        email_lower = user.email.lower()
        
        if email_lower in users:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
            
        hashed_password = self.get_password_hash(user.password)
        db_user = UserInDB(
            email=email_lower,
            role=user.role,
            hashed_password=hashed_password
        )
        
        users[email_lower] = db_user.dict()
        self._save_users(users)
        
        return db_user

auth_service = AuthService()
