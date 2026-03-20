from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.models.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import auth_service, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login/token")

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    """
    Register a new user (HR or USER).
    Returns a JWT access token immediately after registration.
    """
    db_user = auth_service.register_user(user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": db_user.email, "role": db_user.role}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Standard JSON login endpoint matching the prompt constraints.
    Returns { token, role }
    """
    user = auth_service.get_user_by_email(credentials.email)
    if not user or not auth_service.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.email, "role": user.role}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}


@router.post("/login/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token login, accepts x-www-form-urlencoded data.
    Primarily used for interactive Swagger UI docs.
    """
    user = auth_service.get_user_by_email(form_data.username)
    if not user or not auth_service.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.email, "role": user.role}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}
