from sqlalchemy import Column, Integer, String, Text
from database import Base

class AblMuawin_dataCollection_Table(Base):
    __tablename__ = 'speech_analysis_table'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
       
    product_info = Column(String)
    finances = Column(String)
    Discounts = Column(String)
    Branch_ATM_Details = Column(String)
    Security = Column(String)
    
    
    