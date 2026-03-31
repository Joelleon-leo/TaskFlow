from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise ValueError("DATABASE_URL is not set")
engine=create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)