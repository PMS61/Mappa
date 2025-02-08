from pydantic import BaseModel
import uuid


class RoomRequestModel(BaseModel):
    room_id: str
    repo_id: str
    path: str

class RoomResponseModel(BaseModel):
    error: bool
    message: str


class RoomAndPathRequestModel(BaseModel):
    repo_id: str

class RoomAndPathResponseModel(BaseModel):
    error: bool
    message: str
    rooms: list[dict[str, str]]

class NewFileRequestModel(BaseModel):
    repo_id: str
    path: str

class NewFileResponseModel(BaseModel):
    error: bool
    message: str
    room_id: str