"""Shell command execution tool for the Forge agent."""

import asyncio
from langchain_core.tools import tool


@tool
async def run_command(command: str) -> str:
    """Run a shell command and return output.

    Args:
        command: Shell command to execute
    """
    try:
        process = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await asyncio.wait_for(
            process.communicate(),
            timeout=60.0,
        )

        output = ""

        if stdout:
            output += stdout.decode("utf-8", errors="replace")

        if stderr:
            output += stderr.decode("utf-8", errors="replace")

        if process.returncode != 0:
            return f"Exit code {process.returncode}:\n{output}"

        return output or "Command executed successfully"

    except asyncio.TimeoutError:
        return "Error: Command timed out after 60 seconds"
    except Exception as e:
        return f"Error running command: {str(e)}"
