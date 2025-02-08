from pydantic import BaseModel
import uuid


class RoomRequestModel(BaseModel):
    room_id: str
    repo_id: str
    path: str

class RoomResponseModel(BaseModel):
    error: bool
    message: str
