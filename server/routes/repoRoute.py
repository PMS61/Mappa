from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from models import RepoRequestModel, RepoResponseModel

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/create-repo", response_model=RepoResponseModel)
async def create_repo(req: RepoRequestModel):
    repo_id = str(uuid.uuid4())
    response = supabase.table("repo").insert({
        "repo_id": repo_id,
        "userid": req.userid,
        "repository_name": req.repository_name
    }).execute()
    if response.error:
        raise HTTPException(status_code=500, detail="Failed to create repository")
    return {"error": False, "repo_id": repo_id, "message": "Repository created successfully"}

@router.post("/create-file", response_model=FileResponseModel)
async def create_file(req: FileRequestModel):
    file_id = str(uuid.uuid4())
    response = supabase.table("filesys").insert({
        "file_id": file_id,
        "repo_id": req.repo_id,
        "path": req.path,
        "content": req.content,
        "version": req.version
    }).execute()
    if response.error:
        raise HTTPException(status_code=500, detail="Failed to create file entry")
    return {"error": False, "file_id": file_id, "message": "File entry created successfully"}
