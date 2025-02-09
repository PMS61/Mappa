from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
import logging
from models import RoomRequestModel, RoomResponseModel, RoomAndPathRequestModel, RoomAndPathResponseModel, NewFileRequestModel, NewFileResponseModel

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logger = logging.getLogger(__name__)

@router.post("/create-room", response_model=RoomResponseModel)
async def create_room(req: RoomRequestModel):
    logger.info(f"Received request: {req}")
    response = supabase.table("room").insert({
        "room_id": req.room_id,
        "repo_id": req.repo_id,
        "path": req.path
    }).execute()
    
    # Log the full response for debugging
    logger.info(f"Supabase response: {response}")

    if not response.data:
        error_message = response.error.message if response.error else "Unknown error"
        logger.error(f"Failed to create room: {error_message}")
        raise HTTPException(status_code=500, detail=f"Failed to create room: {error_message}")
    
    logger.info(f"Room created successfully with ID {req.room_id}")
    
    return {"error": False, "message": "Room created successfully"}

@router.post("/get-room-and-path", response_model=RoomAndPathResponseModel)
async def get_room_and_path(req: RoomAndPathRequestModel):
    response = supabase.table("room").select("*").eq("repo_id", req.repo_id).execute()
    if not response.data:
        error_message = response.error.message if response.error else "Unknown error"
        logger.error(f"Failed to get room and path: {error_message}")
        raise HTTPException(status_code=500, detail=f"Failed to get room and path: {error_message}")
    
    rooms = [{"room_id": room["room_id"], "path": room["path"]} for room in response.data]
    return {"error": False, "message": "Rooms and paths retrieved successfully", "rooms": rooms}

@router.post("/create-new-file", response_model=NewFileResponseModel)
async def create_new_file(req: NewFileRequestModel):
    room_id = str(uuid.uuid4())
    response = supabase.table("room").insert({
        "room_id": room_id,
        "repo_id": req.repo_id,
        "path": req.path,
    }).execute()
    if not response.data:
        error_message = response.error.message if response.error else "Unknown error"
        logger.error(f"Failed to create new file: {error_message}")
        raise HTTPException(status_code=500, detail=f"Failed to create new file: {error_message}")
    
    return {"error": False, "message": "New file created successfully", "room_id": room_id}