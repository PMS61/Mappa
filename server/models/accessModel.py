from pydantic import BaseModel
import uuid

class AccessRequestModel(BaseModel):
    uid: str
    repo_id: str
    access: str

class AccessResponseModel(BaseModel):
    error: bool
    message: str
    access: str
