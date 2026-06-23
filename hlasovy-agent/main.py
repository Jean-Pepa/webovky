"""Hlasový programátorský agent – hlavní smyčka.

Ovládání:
    [Enter]  – začni mluvit; dalším Enterem nahrávání ukončíš
    t        – napsat zadání ručně (bez mikrofonu)
    q        – konec
"""
import asyncio

from claude_agent_sdk import ClaudeSDKClient

import agent as agent_mod
from config import Config
from conversation_logger import ConversationLogger


def banner(cfg: Config) -> None:
    print("=" * 60)
    print("  Hlasový programátorský agent (Claude)")
    print("=" * 60)
    print(f"  Projekt:  {cfg.project_dir}")
    print(f"  Model:    {cfg.model}")
    print(f"  Whisper:  {cfg.whisper_model} ({cfg.whisper_device}/{cfg.whisper_compute})")
    print(f"  Logy:     {cfg.log_dir.resolve()}")
    print("-" * 60)
    print("  [Enter] mluvit • 't' psát • 'q' konec")
    print("=" * 60)


async def run() -> None:
    cfg = Config()
    cfg.validate()

    # Import až tady, ať se těžké knihovny načítají s viditelnou hláškou.
    from audio import Recorder
    from stt import Transcriber

    recorder = Recorder(samplerate=cfg.samplerate)

    print("Načítám Whisper model (poprvé se stáhne, chvíli to trvá)...")
    transcriber = Transcriber(
        model_size=cfg.whisper_model,
        device=cfg.whisper_device,
        compute_type=cfg.whisper_compute,
        language=cfg.language,
    )

    log = ConversationLogger(cfg.log_dir)
    can_use_tool = agent_mod.make_permission_callback(verbose=True)
    options = agent_mod.build_options(
        cwd=cfg.project_dir,
        model=cfg.model,
        system_prompt=cfg.system_prompt,
        can_use_tool=can_use_tool,
    )

    banner(cfg)

    async with ClaudeSDKClient(options=options) as client:
        while True:
            choice = input("\n> ").strip().lower()

            if choice == "q":
                print("Končím. Ahoj!")
                break

            if choice == "t":
                user_text = input("✍️  Napiš zadání: ").strip()
            else:
                recorder.start()
                input("🎙️  Nahrávám... (Enter = konec) ")
                audio = recorder.stop()
                print("📝 Přepisuji...")
                user_text = transcriber.transcribe(audio)
                print(f"🧑 Ty: {user_text}")

            if not user_text:
                print("(prázdné zadání, zkus to znovu)")
                continue

            log.log("user", user_text)

            print("🤖 Claude pracuje...\n")
            printed = {"any": False}

            def on_text(chunk: str) -> None:
                printed["any"] = True
                print(chunk, end="", flush=True)

            answer = await agent_mod.ask(client, user_text, on_text=on_text)
            if printed["any"]:
                print()  # ukončit řádek po streamování
            else:
                print(answer)

            log.log("assistant", answer)


def main() -> None:
    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        print("\nPřerušeno. Ahoj!")


if __name__ == "__main__":
    main()
