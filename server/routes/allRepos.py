from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
from models import ARepoResMod
from typing import List
from auth import jwt_decode
from pydantic import BaseModel

class AReqMod(BaseModel):
    uid: str

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/get-repos/", response_model=List[ARepoResMod])
async def get_repos_by_uid(req: AReqMod):
    print(req)
    response = supabase.table("repo").select("*").eq("uid", req.uid).execute()
    
    if not response.data:  # Check if no repositories found
        raise HTTPException(status_code=404, detail="No repositories found for this UID")

    return response.data  # Return list of repositories
