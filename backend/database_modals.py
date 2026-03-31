from pydantic import BaseModel
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column,String,Integer,ForeignKey,Boolean
from sqlalchemy.orm import relationship


Base=declarative_base()

class UserCreate(BaseModel):
    username: str
    password: str

class Users(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, unique=True)
    password= Column(String, nullable=False)

    tasks = relationship("Tasks", back_populates="user")


class Tasks(Base):
    __tablename__ = "Tasks"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)

    user = relationship("Users", back_populates="tasks")



class TaskCreate(BaseModel):
    description: str


class TaskUpdate(BaseModel):
    description: str


class TaskOut(BaseModel):
    id: int
    description: str
    user_id: int

    class Config:
        orm_mode = True