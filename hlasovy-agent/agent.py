"""Obal nad Claude Agent SDK – sestavení voleb, oprávnění a dotaz na agenta."""
from pathlib import Path

from claude_agent_sdk import ClaudeAgentOptions

try:  # názvy se mezi verzemi SDK mírně liší
    from claude_agent_sdk import PermissionResultAllow, PermissionResultDeny
except ImportError:  # pragma: no cover
    from claude_agent_sdk.types import PermissionResultAllow, PermissionResultDeny


# Příkazy, které z bezpečnosti rovnou blokujeme (kontrola na podřetězec).
DANGEROUS_PATTERNS = [
    "rm -rf",
    "rm -fr",
    "rmdir /s",
    "rd /s",
    "del /f",
    "deltree",
    "format ",
    "mkfs",
    "diskpart",
    "shutdown",
    ":(){",
    "> /dev/sd",
    "dd if=",
]


def make_permission_callback(verbose: bool = True):
    """Bash příkazy filtruje denylistem a (volitelně) je vypisuje.
    Ostatní nástroje povolí."""

    async def can_use_tool(tool_name, input_data, context):  # noqa: ANN001
        if tool_name == "Bash":
            command = (input_data or {}).get("command", "")
            lowered = command.lower()
            for pattern in DANGEROUS_PATTERNS:
                if pattern in lowered:
                    return PermissionResultDeny(
                        message=f"Zablokován potenciálně nebezpečný příkaz ({pattern})."
                    )
            if verbose:
                print(f"   ▶ shell: {command}")
        return PermissionResultAllow()

    return can_use_tool


def build_options(
    cwd: Path,
    model: str,
    system_prompt: str,
    can_use_tool,
) -> ClaudeAgentOptions:
    return ClaudeAgentOptions(
        cwd=str(cwd),
        model=model,
        system_prompt=system_prompt,
        # Čtení/hledání/úpravy se schvalují automaticky;
        # Bash projde přes callback výše.
        allowed_tools=["Read", "Glob", "Grep", "Edit", "Write"],
        can_use_tool=can_use_tool,
    )


async def ask(client, prompt: str, on_text=None) -> str:
    """Pošle dotaz do běžící session a vrátí finální textovou odpověď.

    Pokud předáš `on_text`, dostane průběžné kousky textu (streamování).
    """
    await client.query(prompt)

    parts: list[str] = []
    final: str | None = None

    async for message in client.receive_response():
        for block in (getattr(message, "content", None) or []):
            text = getattr(block, "text", None)
            if isinstance(text, str):
                parts.append(text)
                if on_text:
                    on_text(text)
        result = getattr(message, "result", None)
        if result is not None:
            final = result

    return final if final is not None else "".join(parts)
