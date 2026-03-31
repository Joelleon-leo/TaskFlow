from fastapi import FastAPI, HTTPException, status
import database_modals 
from fastapi.middleware.cors import CORSMiddleware
from database import engine,SessionLocal
from database_modals import UserCreate,TaskOut,TaskCreate
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

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
def signup(user: UserCreate):
    db = SessionLocal()
    try:
        # check if user exists
        existing_user = db.query(database_modals.Users)\
            .filter(database_modals.Users.username == user.username)\
            .first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username already exists"
            )

        # create new user
        new_user = database_modals.Users(
            username=user.username,
            password=hash(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User created successfully",
            "user_id": new_user.id
        }

    finally:
        db.close()

@app.post("/login")
def login_user(user: UserCreate):
    db = SessionLocal()

    # 1. Find user by username
    db_user = db.query(database_modals.Users).filter(database_modals.Users.username == user.username).first()

    # 2. Check if user exists
    if db_user is None:
        db.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # 3. Check password (plain-text for demo)
    if db_user.password != user.password:
        db.close()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")

    # 4. Success
    db.close()
    return {"message": "Login successful", "user_id": db_user.id}


@app.get("/tasks/{user_id}")
def get_tasks(user_id: int):
    db = SessionLocal()
    try:
        user = db.query(database_modals.Users).filter(database_modals.Users.id == user_id).first()

        return {
            "username": user.username,
            "tasks": user.tasks
        }

    finally:
        db.close()


@app.post("/tasks/{user_id}", response_model=TaskOut)
def create_task(user_id: int, task: TaskCreate):
    db = SessionLocal()
    try:
        new_task = database_modals.Tasks(
            description=task.description,
            user_id=user_id
        )

        db.add(new_task)
        db.commit()
        db.refresh(new_task)

        return new_task

    finally:
        db.close()

@app.delete("/tasks/{user_id}/{task_id}")
def delete_task(user_id: int, task_id: int):
    db = SessionLocal()
    try:
        task = db.query(database_modals.Tasks)\
            .filter(database_modals.Tasks.id == task_id, database_modals.Tasks.user_id == user_id)\
            .first()

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        db.delete(task)
        db.commit()

        return {"message": "Deleted"}

    finally:
        db.close()