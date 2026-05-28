"""File operation tools for the Forge agent."""

import os
import difflib
from langchain_core.tools import tool


@tool
async def read_file(path: str) -> str:
    """Read contents of a file.

    Args:
        path: Path to the file to read
    """
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return f"Error: File '{path}' not found"
    except Exception as e:
        return f"Error reading file: {str(e)}"


@tool
async def write_file(path: str, content: str) -> str:
    """Write content to a file and return a diff.

    Args:
        path: Path to the file to write
        content: Content to write to the file
    """
    try:
        # Read existing content for diff
        old_content = ""
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                old_content = f.read()

        # Write new content
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

        # Generate diff
        diff = list(difflib.unified_diff(
            old_content.splitlines(),
            content.splitlines(),
            fromfile=f"a/{path}",
            tofile=f"b/{path}",
            lineterm="",
        ))

        if diff:
            return "\n".join(diff)
        return f"File '{path}' written successfully (no changes)"

    except Exception as e:
        return f"Error writing file: {str(e)}"


@tool
async def create_file(path: str, content: str = "") -> str:
    """Create a new file with optional content.

    Args:
        path: Path to the file to create
        content: Optional initial content
    """
    try:
        if os.path.exists(path):
            return f"Error: File '{path}' already exists"

        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

        return f"File '{path}' created successfully"
    except Exception as e:
        return f"Error creating file: {str(e)}"


@tool
async def delete_file(path: str) -> str:
    """Delete a file.

    Args:
        path: Path to the file to delete
    """
    try:
        if not os.path.exists(path):
            return f"Error: File '{path}' not found"

        os.remove(path)
        return f"File '{path}' deleted successfully"
    except Exception as e:
        return f"Error deleting file: {str(e)}"
