from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.schemas import UserCreate, UserLogin, TokenResponse, MessageResponse
from app.services import AuthService
from app.api.middleware import get_current_user
from app.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/claim-art", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def claim_art(
    user_data: UserCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Quest-based authentication: Claim your art by setting your artist name.
    This is the primary way users "sign up" - after creating their artwork.
    """
    # Get client info
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    # Create user
    user = AuthService.create_user(
        db=db,
        artist_name=user_data.artist_name,
        email=user_data.email,
        password=user_data.password
    )

    # Create session
    access_token, session = AuthService.create_session(
        db=db,
        user_id=user.id,
        ip_address=ip_address,
        user_agent=user_agent
    )

    # Import schema here to avoid circular import
    from app.api.schemas import UserResponse

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Traditional login for users who have set a password.
    """
    # Authenticate user
    user = AuthService.authenticate_user(
        db=db,
        artist_name=login_data.artist_name,
        password=login_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect artist name or password"
        )

    # Get client info
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    # Create session
    access_token, session = AuthService.create_session(
        db=db,
        user_id=user.id,
        ip_address=ip_address,
        user_agent=user_agent
    )

    # Import schema here to avoid circular import
    from app.api.schemas import UserResponse

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Logout current user by invalidating their session.
    """
    # Get token from header
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )

    token = auth_header.split(" ")[1]

    # Invalidate session
    success = AuthService.invalidate_session(db, token)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to logout"
        )

    return MessageResponse(message="Successfully logged out")


@router.get("/me", response_model=None)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current user information.
    """
    from app.api.schemas import UserResponse
    return UserResponse.model_validate(current_user)
