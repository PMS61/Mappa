from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import logging
from models import AccessRequestModel, AccessResponseModel
from auth import jwt_decode
router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logger = logging.getLogger(__name__)

@router.post("/set-access", response_model=AccessResponseModel)
async def set_access(req: AccessRequestModel):
    logger.info(f"Received request: {req}")
    response = supabase.table("perm").insert({
        "uid": req.uid,
        "repo_id": req.repo_id,
        "access": req.access
    }).execute()
    if not response.data:
        logger.error(f"Failed to set access: {response.error.message}")
        raise HTTPException(status_code=500, detail=f"Failed to set access: {response.error.message}")
    logger.info(f"Access set successfully for user {req.uid} on repo {req.repo_id}")
    return {"error": False, "access": req.access, "message": "Access set successfully"}
