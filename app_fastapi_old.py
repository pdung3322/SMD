from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
from infrastructure.databases.database import SessionLocal
from infrastructure.models.user import User

app = FastAPI()

@app.post("/login")
def login(data: dict):
    db: Session = SessionLocal()

    user = db.query(User).filter(
        User.email == data["email"],
        User.password == data["password"],  # hiện tại chưa hash
        User.status == "active"
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Sai email hoặc mật khẩu")

    return {
        "user": {
            "user_id": user.user_id,
            "email": user.email,
            "role": user.role
        }
    }
