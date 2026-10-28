# Vzory tvých textů

Sem dej 2–3 svoje starší texty, nejlépe od různých typů zakázek:
- textovou část architektonické studie,
- průvodní list (A) a souhrnnou technickou zprávu (B) k povolení stavby,
- technickou zprávu architektonicko-stavebního řešení (D.1.1.1).

Soubory zůstávají jen u tebe. Agent z nich převezme styl a ustálené formulace, ale nikdy ne
jména, adresy, parcelní čísla ani ceny.

Převod do textu (v Ubuntu, ve složce `vzory`):

    pdftotext -layout zprava.pdf zprava.txt
    pandoc zprava.docx -t gfm -o zprava.md

Pak řekni agentovi: „Nauč se můj styl ze vzorů." (nejlépe s `/model hluboky`).
