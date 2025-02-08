from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
import logging
from models import RoomRequestModel, RoomResponseModel, RoomAndPathRequestModel, RoomAndPathResponseModel

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logger = logging.getLogger(__name__)

@router.post("/create-room", response_model=RoomResponseModel)
async def create_room(req: RoomRequestModel):
    print("hello")
    # logger.info(f"Received request: {req}")
    response = supabase.table("room").insert({
        "room_id": req.room_id,
        "repo_id": req.repo_id,
        "path": req.path
    }).execute()
    
    # Log the full response for debugging
    # logger.info(f"Supabase response: {response}")

    if not response.data:
        logger.error(f"Failed to create room: {response.error.message}")
        raise HTTPException(status_code=500, detail=f"Failed to create room: {response.error.message}")
    
    # Uncomment this line to log successful creation
    # logger.info(f"Room created successfully with ID {req.room_id}")
    
    return {"error": False, "message": "Room created successfully"}

@router.post("/get-room-and-path", response_model=RoomAndPathResponseModel)
async def get_room_and_path(req: RoomAndPathRequestModel):
    response = supabase.table("room").select("*").eq("repo_id", req.repo_id).execute()
    if not response.data:
        logger.error(f"Failed to get room and path: {response.error.message}")
        raise HTTPException(status_code=500, detail=f"Failed to get room and path: {response.error.message}")
    
    rooms = [{"room_id": room["room_id"], "path": room["path"]} for room in response.data]
    return {"error": False, "message": "Rooms and paths retrieved successfully", "rooms": rooms}
