from pydantic import BaseModel
import uuid

class ScheduleRequestModel(BaseModel):
    repo_id: str
    name: str
    date: str
    time: str

class ScheduleResponseModel(BaseModel):
    error: bool
    message: str
    name: str
    date: str
    time: str

class GetScheduleRequestModel(BaseModel):
    repo_id: str

