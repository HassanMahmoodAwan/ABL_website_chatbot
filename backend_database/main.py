from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine, SessionLocal

from sqlalchemy import desc
from sqlalchemy.orm import Session
from typing import Annotated, List, Optional

models.Base.metadata.create_all(bind=engine)

app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH"],
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
        category_name = category_name.lower(),
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
        # data["category_name"] = data["category_name"].capitalize()
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
    
    


# ======== ABL ChatHistory Endpoints ==========

@app.post("/api/add_chathistory")
def add_chathistory(data:dict, db: db_dependency):
    
    userName = data.get("userName")
    user_cnic = data.get("user_cnic")
    chat_history = data.get("chat_history")
    
    new_record = models.ABLMuawin_Chatbot_Authentication_Table(
        userName=userName,
        user_cnic=user_cnic,
        chat_history=chat_history
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    
    return {
        "status": "commited in DB",
        "message": "Record added successfully",
        "id": new_record.id,
        "data": new_record
    }

        
    
@app.patch("/api/update_chathistory")
async def update_chathistory(data:list[dict], db: db_dependency):
    try:
        
        
        id = data[0]["id"]
        userName = data[0]["userName"]
        user_cnic = data[0]["user_cnic"]
        
        # Query the record by id, userName, and user_cnic
        record = db.query(models.ABLMuawin_Chatbot_Authentication_Table).filter(
            models.ABLMuawin_Chatbot_Authentication_Table.id == id,
            models.ABLMuawin_Chatbot_Authentication_Table.userName == userName,
            models.ABLMuawin_Chatbot_Authentication_Table.user_cnic == user_cnic
        ).first()
        
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")       
        
        print(record)
        # Append new entry to chat_history
        if record.chat_history  == [{}]:
            print("new")
            record.chat_history = [data[1]]
        else:
            record.chat_history.append(data[1])
            print("append")
        
        db.commit()
        # db.refresh(record)
        
        return {"status": "success", "message": "Chat history updated successfully", "data": record.chat_history}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





@app.get("/api/get_allchathistory")
async def get_all_records(db: db_dependency):
    try:
        data = db.query(models.ABLMuawin_Chatbot_Authentication_Table).all()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
    
@app.delete("/api/delete_chathistory")
async def delete_record(record_id:int, db: db_dependency):
    db_table = models.ABLMuawin_Chatbot_Authentication_Table
    try:
        data = db.query(db_table).filter(db_table.id == record_id).first()
        if not data:
            raise HTTPException(status_code=404, detail="Record not found")
        
        db.delete(data)
        db.commit()
        return {"status": "success", "message": "Data deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    