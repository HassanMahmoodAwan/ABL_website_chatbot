from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from database import Base


class AblMuawin_dataCollection_Table(Base):
    __tablename__ = 'abl_com_chatbot_table'
    
    # id = Column(Integer, primary_key=True, index=True, autoincrement=True)    
    
    category_name = Column(String, primary_key=True, index=True, nullable=False)
    icon_theme = Column(String, nullable=False)
    color_theme = Column(String, nullable=False)
    questions = Column(ARRAY(String), nullable=True)
    
    
    
   