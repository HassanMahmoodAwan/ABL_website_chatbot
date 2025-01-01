from sqlalchemy import Column, Integer, String, Text, BigInteger, TIMESTAMP, func
from sqlalchemy.dialects.postgresql import ARRAY, JSON
from database import Base
from sqlalchemy.ext.mutable import MutableList


class AblMuawin_dataCollection_Table(Base):
    __tablename__ = 'abl_com_chatbot_table'
      
    
    category_name = Column(String, primary_key=True, index=True, nullable=False)
    icon_theme = Column(String, nullable=False)
    color_theme = Column(String, nullable=False)
    questions = Column(ARRAY(String), nullable=True)
    
 
 
 
class ABLMuawin_Chatbot_Users_Table(Base):
    __TableName__ = "abl_muawin_users_table"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    user_name = Column(String, nullable=False)
    user_cnic = Column(BigInteger, nullable=False)
    register_datetime = Column(TIMESTAMP, default=func.now())
    

class ABLMuawin_Chatbot_ChatHistory_Table(Base):
    __tablename__ = "abl_muawin_chathistory_table"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=False)
    userName = Column(String, nullable=False)
    user_cnic = Column(BigInteger, nullable=False)
    
class ABLMuawin_Chatbot_Authentication_Table(Base):
    __tablename__ = "abl_chathistory_table"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    userName = Column(String, nullable=False)
    user_cnic = Column(BigInteger, nullable=False)
    chat_history = Column(MutableList.as_mutable(JSON), nullable=True) 
    