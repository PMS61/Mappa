from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from models import PostVersionModel, GetVersionModel, GetVersionResponseModel, ReadVersionModel, ReadVersionResponseModel
from auth import jwt_decode

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/post-version")
async def post_version(req: PostVersionModel):
    # Get the latest version
    latest_version = supabase.table("versions").select("version") \
        .eq("repo_id", req.repo_id).order("version", desc=True).limit(1).execute()
    
    new_version = (latest_version.data[0]["version"] + 1) if latest_version.data else 1

    # Insert new version entry
    response = supabase.table("versions").insert({
        "repo_id": req.repo_id,
        "version": new_version,
        "uid": req.uid,
        "commit": req.commit
    }).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create version")

    # Insert files for the new version
    file_entries = [{"repo_id": req.repo_id, "version": new_version, "path": f["path"], "content": f["content"]} for f in req.files]

    if file_entries:
        supabase.table("files").insert(file_entries).execute()

    return {"error": False}

@router.get("/get-version", response_model=GetVersionResponseModel)
async def get_version(req: GetVersionModel):
    response = supabase.table("versions").select("version", "uid", "commit").eq("repo_id", req.repo_id).order("version").execute()

    if not response.data:
        return {"error": True, "versions": []}

    return {"error": False, "versions": response.data}

@router.get("/read-version", response_model=ReadVersionResponseModel)
async def read_version(req: ReadVersionModel):
    response = supabase.table("files").select("path", "content").eq("repo_id", req.repo_id).eq("version", req.version).execute()

    if not response.data:
        return {"error": True, "files": []}

    return {"error": False, "files": response.data}
