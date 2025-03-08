from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
from models import ARepoResMod
from typing import List
from pydantic import BaseModel
from uuid import UUID

class AReqMod(BaseModel):
    org_id: UUID

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/get-repos/", response_model=List[ARepoResMod])
async def get_repos_by_uid_and_org(req: AReqMod):
    print(req)
    response = supabase.table("repo").select("*").eq("org_id", str(req.org_id)).execute()

    if not response.data:  # Check if no repositories found
        raise HTTPException(status_code=404, detail="No repositories found for this UID and Org ID")

    return response.data  # Return list of repositories
