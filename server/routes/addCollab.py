from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from models import ARepoResMod
from typing import List
from pydantic import BaseModel

class NewRepoRequest(BaseModel):
    username: str
    repo_id: str
    repo_name: str

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/add-collab/",response_model=ARepoResMod)
async def add_repo(req: NewRepoRequest):
    # Find the user in the login table
    user_response = supabase.table("users").select("*").eq("username", req.username).execute()
    
    if not user_response.data:  # Check if user does not exist
        raise HTTPException(status_code=404, detail="User not found")

    user = user_response.data[0]
    uid = user["uid"]

    # Add the new repository
    repo_data = {
        "repo_id":req.repo_id,
        "uid": uid,
        "repo_name": req.repo_name
    }
    response = supabase.table("repo").insert(repo_data).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to add repository")

    return ARepoResMod(**repo_data)