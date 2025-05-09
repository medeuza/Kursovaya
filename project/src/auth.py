from jose import jwt, JWTError
from .config import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM
from datetime import timedelta, datetime
from .database import get_db
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .models import User

oauth2scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_access_token(data: dict):
    expire = datetime.utcnow()+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data_to_encode = data.copy()
    data_to_encode.update({"expire": expire.strftime("%d.%m.%Y-%H:%M:%S")})
    print(data_to_encode, SECRET_KEY, ALGORITHM)
    return jwt.encode(data_to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str, db: Session = Depends(get_db)):
    exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                              detail="неудалось проверить данные авторизации",
                              headers={"WWW-Authenticate": "Bearer"})
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = data.get("email")
        if email is None:
            raise exception
    except JWTError:
        raise exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise exception
    return user

