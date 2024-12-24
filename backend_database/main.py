from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine, SessionLocal

from sqlalchemy import desc
from sqlalchemy.orm import Session
from typing import Annotated, List, Optional

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]


@app.get("/")
def main(db: db_dependency):
    
    print("\nStoring results in Database \n")
    db_analysis = models.AblMuawin_dataCollection_Table(
        product_info = "Product Info",
        finances = "Finances",
        Discounts = "Discount",
        Branch_ATM_Details = "Branch/ATM Details",
        Security = "Security",
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
       
    return "Commited in DB"



# ===== Fetch All Records ======
@app.get("/get_data")
async def get_all_records(db: db_dependency):
    db_table = models.AblMuawin_dataCollection_Table
    try:
        data = db.query(db_table).all()
        print(data)
        return data
    except Exception as e:
        return {"status": "Error Fetching Data (404)", "message": str(e)}