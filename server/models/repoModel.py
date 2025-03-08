from pydantic import BaseModel
from uuid import UUID

class RepoRequestModel(BaseModel):
    uid: str
    repo_name: str
    org_id: UUID

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

class ARepoResMod(BaseModel):
    repo_id: str
    uid: str
    repo_name: str
