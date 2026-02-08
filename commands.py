from models import Command, CommandGroup


COMMANDS: list[CommandGroup] = [
    CommandGroup(
        category="Basic blocks",
        commands=[
            Command(id="text", title="Text", description="Just start writing with plain text.", icon="text", keywords=["paragraph", "plain"]),
            Command(id="page", title="Page", description="Embed a sub-page inside this page.", icon="file-text", keywords=["subpage", "nested"]),
            Command(id="todo", title="To-do list", description="Track tasks with a to-do list.", icon="check-square", keywords=["checkbox", "task"]),
            Command(id="heading_1", title="Heading 1", description="Big section heading.", icon="heading-1", keywords=["h1", "title"]),
            Command(id="heading_2", title="Heading 2", description="Medium section heading.", icon="heading-2", keywords=["h2", "subtitle"]),
            Command(id="heading_3", title="Heading 3", description="Small section heading.", icon="heading-3", keywords=["h3"]),
            Command(id="table", title="Table", description="Add a simple table to this page.", icon="table", keywords=["grid", "spreadsheet"]),
            Command(id="bulleted_list", title="Bulleted list", description="Create a simple bulleted list.", icon="list", keywords=["ul", "bullet"]),
            Command(id="numbered_list", title="Numbered list", description="Create a list with numbering.", icon="list-ordered", keywords=["ol", "number"]),
            Command(id="toggle", title="Toggle list", description="Toggles can hide and show content inside.", icon="chevrons-down-up", keywords=["collapse", "expand", "accordion"]),
            Command(id="quote", title="Quote", description="Capture a quote.", icon="text-quote", keywords=["blockquote", "cite"]),
            Command(id="divider", title="Divider", description="Visually divide blocks.", icon="minus", keywords=["hr", "separator", "line"]),
            Command(id="link_to_page", title="Link to page", description="Link to an existing page.", icon="link", keywords=["reference", "internal link"]),
            Command(id="callout", title="Callout", description="Make writing stand out.", icon="megaphone", keywords=["alert", "notice", "info"]),
        ],
    ),
    CommandGroup(
        category="Media",
        commands=[
            Command(id="image", title="Image", description="Upload or embed with a link.", icon="image", keywords=["photo", "picture", "img"]),
            Command(id="bookmark", title="Web bookmark", description="Save a link as a visual bookmark.", icon="bookmark", keywords=["link", "url"]),
            Command(id="video", title="Video", description="Embed from YouTube, Vimeo...", icon="video", keywords=["movie", "clip"]),
            Command(id="audio", title="Audio", description="Embed from SoundCloud, Spotify...", icon="headphones", keywords=["sound", "music"]),
            Command(id="code", title="Code", description="Capture a code snippet.", icon="code", keywords=["snippet", "programming"]),
            Command(id="file", title="File", description="Upload or embed with a link.", icon="file", keywords=["attachment", "upload"]),
        ],
    ),
    CommandGroup(
        category="Embeds",
        commands=[
            Command(id="equation", title="Equation", description="Display a math equation.", icon="sigma", keywords=["math", "latex", "formula"]),
        ],
    ),
]


def search_commands(query: str) -> list[CommandGroup]:
    if not query:
        return COMMANDS

    q = query.lower()
    results: list[CommandGroup] = []

    for group in COMMANDS:
        matching = [
            cmd for cmd in group.commands
            if q in cmd.title.lower()
            or q in cmd.description.lower()
            or any(q in kw.lower() for kw in cmd.keywords)
        ]
        if matching:
            results.append(CommandGroup(category=group.category, commands=matching))

    return results
