from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models import User, Session as SessionModel
from app.core.security import create_access_token, verify_password, get_password_hash


class AuthService:
    """Service for handling authentication operations"""

    @staticmethod
    def create_user(db: Session, artist_name: str, email: Optional[str] = None, password: Optional[str] = None) -> User:
        """
        Create a new user/artist.

        Args:
            db: Database session
            artist_name: Unique artist name
            email: Optional email address
            password: Optional password (for future login)

        Returns:
            Created User object

        Raises:
            HTTPException: If artist name or email already exists
        """
        # Check if artist name already exists
        existing_user = db.query(User).filter(User.artist_name == artist_name).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Artist name already taken"
            )

        # Check if email already exists (if provided)
        if email:
            existing_email = db.query(User).filter(User.email == email).first()
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )

        # Create new user
        user = User(
            artist_name=artist_name,
            email=email,
            hashed_password=get_password_hash(password) if password else None
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def authenticate_user(db: Session, artist_name: str, password: str) -> Optional[User]:
        """
        Authenticate a user with artist name and password.

        Args:
            db: Database session
            artist_name: Artist name
            password: Plain text password

        Returns:
            User object if authenticated, None otherwise
        """
        user = db.query(User).filter(User.artist_name == artist_name).first()

        if not user or not user.hashed_password:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return user

    @staticmethod
    def create_session(db: Session, user_id: int, ip_address: Optional[str] = None, user_agent: Optional[str] = None) -> tuple[str, SessionModel]:
        """
        Create a new session for a user.

        Args:
            db: Database session
            user_id: User ID
            ip_address: Client IP address
            user_agent: Client user agent string

        Returns:
            Tuple of (access_token, session_object)
        """
        # Create JWT token
        access_token = create_access_token(data={"sub": str(user_id)})

        # Calculate expiration (7 days from now)
        expires_at = datetime.utcnow() + timedelta(days=7)

        # Create session record
        session = SessionModel(
            session_token=access_token,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=expires_at
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        return access_token, session

    @staticmethod
    def get_current_user(db: Session, token: str) -> Optional[User]:
        """
        Get current user from JWT token.

        Args:
            db: Database session
            token: JWT access token

        Returns:
            User object if valid, None otherwise
        """
        from app.core.security import decode_access_token

        # Decode token
        payload = decode_access_token(token)
        if not payload:
            return None

        user_id = payload.get("sub")
        if not user_id:
            return None

        # Get user from database
        user = db.query(User).filter(User.id == int(user_id)).first()
        return user

    @staticmethod
    def invalidate_session(db: Session, token: str) -> bool:
        """
        Invalidate/logout a session.

        Args:
            db: Database session
            token: JWT access token

        Returns:
            True if successful, False otherwise
        """
        session = db.query(SessionModel).filter(SessionModel.session_token == token).first()

        if not session:
            return False

        session.is_active = False
        db.commit()

        return True
