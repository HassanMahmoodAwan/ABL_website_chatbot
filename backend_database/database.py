from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


DATABASE_URL = "postgresql://postgres:hassan1234@postgres:5432/ablmuawin_data_collection"
# DATABASE_URL = "postgresql://postgres:hassan1234@db:5432/speech_analyzer_db"

engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()