from pydantic import BaseModel
from uuid import UUID
from typing import List

class OrgReq(BaseModel):
    org_name: str
    uid: UUID
    org_id:UUID
    admin:bool
    username:str

class OrgRes(BaseModel):
    org_id: UUID
    org_name: str
    error:bool

class OrgByUIDRequest(BaseModel):
    uid: UUID

class OrgInfo(BaseModel):
    org_id: UUID
    org_name: str

class OrgByUIDResponse(BaseModel):
    orgs: List[OrgInfo]
    error: bool
