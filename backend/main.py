from fastapi import FastAPI
import database_modals 
from fastapi.middleware.cors import CORSMiddleware
from database import engine,SessionLocal
from database_modals import UserCreate

database_modals.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup")
def insert_user(user: UserCreate):
    db = SessionLocal()

    new_user = database_modals.Users(
        username=user.username,
        password=user.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {"message": "User created", "id": new_user.id}

@app.post("/login")
def login_user(user: UserCreate):
    db = SessionLocal()

    # 1. Find user by username
    user = db.query(database_modals.Users).filter(
        database_modals.Users.username == user.username
    ).first()

    # 2. Check if user exists
    if user is None:
        db.close()
        return {"error": "User not found"}

    # 3. Check password
    if user.password != user.password:
        db.close()
        return {"error": "Wrong password"}

    # 4. Success
    db.close()
    return {"message": "Login successful", "user_id": user.id}