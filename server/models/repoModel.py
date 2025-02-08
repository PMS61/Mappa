from pydantic import BaseModel
import uuid

class RepoRequestModel(BaseModel):
    userid: str
    repository_name: str

class RepoResponseModel(BaseModel):
    error: bool
    repo_id: str

class FileRequestModel(BaseModel):
    repo_id: str
    path: str
    content: str
    version: int

class FileResponseModel(BaseModel):
    error: bool
    file_id: str
