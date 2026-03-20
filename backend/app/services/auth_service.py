import os
import json
from datetime import datetime, timedelta
from typing import Optional, Dict
from passlib.context import CryptContext
import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from app.models.user import UserCreate, UserInDB, RoleEnum

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "super_secret_key_change_me_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Use bcrypt if available, fall back to pbkdf2_sha256
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    pwd_context.hash("test")  # Verify bcrypt works
except Exception:
    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login/token", auto_error=False)

# Use a local JSON file in datasets to mock a database for incremental implementation
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "datasets", "users.json")


class AuthService:
    def __init__(self):
        # Ensure the mock DB exists
        db_dir = os.path.dirname(DB_PATH)
        os.makedirs(db_dir, exist_ok=True)
        if not os.path.exists(DB_PATH):
            with open(DB_PATH, 'w') as f:
                json.dump({}, f)

    def _load_users(self) -> Dict[str, dict]:
        try:
            with open(DB_PATH, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

    def _save_users(self, users: Dict[str, dict]):
        with open(DB_PATH, 'w') as f:
            json.dump(users, f, indent=2)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            return False

    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        # Convert role enum to string for JWT serialization
        if "role" in to_encode and hasattr(to_encode["role"], "value"):
            to_encode["role"] = to_encode["role"].value
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

        # Use model_dump() for Pydantic v2, fall back to dict() for v1
        try:
            users[email_lower] = db_user.model_dump()
        except AttributeError:
            users[email_lower] = db_user.dict()
        self._save_users(users)

        return db_user

    async def get_current_user(self, token: str = Depends(oauth2_scheme)) -> UserInDB:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        if not token:
            raise credentials_exception
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
        except Exception:
            raise credentials_exception

        user = self.get_user_by_email(email)
        if user is None:
            raise credentials_exception
        return user


# Instantiate first — RoleChecker will reference this singleton
auth_service = AuthService()


class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user: UserInDB = Depends(auth_service.get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return user
