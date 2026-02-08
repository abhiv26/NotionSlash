from pydantic import BaseModel


class Command(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    keywords: list[str] = []


class CommandGroup(BaseModel):
    category: str
    commands: list[Command]


class CommandsResponse(BaseModel):
    groups: list[CommandGroup]
