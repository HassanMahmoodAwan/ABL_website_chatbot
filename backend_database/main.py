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


@app.post("/api/upload_category")
def main(db: db_dependency, category_name: str, icon_theme, color_theme,  questions:list[str] = []):
    
    print("\nStoring results in Database \n")
    db_analysis = models.AblMuawin_dataCollection_Table(
        category_name = category_name,
        icon_theme = icon_theme,
        color_theme = color_theme,
        questions = questions  
            
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
       
    return "Commited in DB"



# ===== Fetch All Records ======
@app.get("/api/get_alldata")
async def get_all_records(db: db_dependency):
    db_table = models.AblMuawin_dataCollection_Table
    try:
        data = db.query(db_table).all()
        print(data)
        print(type(data))
        return data
    except Exception as e:
        return {"status": "Error Fetching Data (404)", "message": str(e)}
    
    
    
@app.delete("/api/delete_record")
async def delete_record(category_name:str, db: db_dependency):
    db_table = models.AblMuawin_dataCollection_Table
    try:
        data = db.query(db_table).filter(db_table.category_name == category_name).first()
        if not data:
            raise HTTPException(status_code=404, detail="Record not found")
        
        db.delete(data)
        db.commit()
        return {"status": "success", "message": "Data deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))