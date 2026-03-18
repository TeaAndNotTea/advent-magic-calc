#!/usr/bin/env python3
import time

MAGNM_DEFAULT = 11111  # wizcom_1.magnm default in your build


def datime_like_adventure():
    """
    Match datime_() in the f2c C code:
      d = days since 01-Jan-1977
      t = minutes past midnight (local time)
    Note: leap year handling matches the game's simple y//4 rule.
    """
    tm = time.localtime()
    year = tm.tm_year  # e.g. 2026
    y = year - 1977
    leap = y // 4
    d = y * 365 + leap + tm.tm_yday  # tm_yday is 0-based
    t = tm.tm_hour * 60 + tm.tm_min
    return d, t


def compute_expected_response(challenge_word: str, magnm: int = MAGNM_DEFAULT) -> str:
    """
    Compute the 5-letter response the game expects, given the 5-letter
    challenge printed by the game (e.g. 'JDGXL').

    This is a direct translation of the second stage of wizard_() in your C file.
    """
    w = challenge_word.strip().upper()
    if len(w) != 5 or not w.isalpha():
        raise ValueError("Challenge must be exactly 5 letters A-Z")

    # Recover val[] from the printed challenge:
    # in C, printed letter = '@' + val (so A->1 .. Z->26)
    val = [ord(c) - 64 for c in w]  # 'A'(65)->1 ... 'Z'(90)->26

    # Get time in the same units as Adventure, then apply the same mangling:
    _d, t = datime_like_adventure()
    t = (t // 60) * 40 + (t // 10) * 10

    d = int(magnm)

    out = []
    for y in range(5):
        # C is 1-based: z__ = y % 5 + 1  => in 0-based: z = (y+1) % 5
        z = (y + 1) % 5

        x = (abs(val[y] - val[z]) * (d % 10) + (t % 10)) % 26 + 1

        # The C code subtracts x from your input and expects '@' (64):
        # so the required input char is '@' + x  => 'A'..'Z'
        out.append(chr(64 + x))

        t //= 10
        d //= 10

    return "".join(out)


if __name__ == "__main__":
    challenge = input("Enter the 5-letter challenge the game printed: ").strip()
    magnm_str = input(f"Enter magnm (press Enter for {MAGNM_DEFAULT}): ").strip()
    magnm = int(magnm_str) if magnm_str else MAGNM_DEFAULT

    print("Type this response into the game:", compute_expected_response(challenge, magnm))
