from pydantic import BaseModel
import uuid

class FileModel(BaseModel):
    path: str
    content: str

class PostVersionModel(BaseModel):
    repo_id: str
    uid: str
    commit: str
    files: list[FileModel]  # [{"path": "file.txt", "content": "hello"}]

class GetVersionModel(BaseModel):
    repo_id: str

class GetVersionResponseModel(BaseModel):
    error: bool
    versions: list[dict]  # [{"version": 1, "user": "user1", "commit": "init"}]

class ReadVersionModel(BaseModel):
    repo_id: str
    version: int

class ReadVersionResponseModel(BaseModel):
    error: bool
    files: list[dict]  # [{"path": "file.txt", "content": "hello"}]