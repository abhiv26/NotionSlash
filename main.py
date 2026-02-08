from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from commands import search_commands
from models import CommandsResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/commands", response_model=CommandsResponse)
def get_commands(q: str = "") -> CommandsResponse:
    return CommandsResponse(groups=search_commands(q))
