"""Comprueba el contraste WCAG 2.1 AA de la paleta de FitCasa.

Lee las variables de color de :root en public/style.css (no usa colores
copiados) y calcula cada par relevante. Termina con codigo distinto de 0
si algun par de texto baja de 4.5:1 o algun foco de 3:1.
"""
import re
import sys
from pathlib import Path

STYLE_PATH = Path(__file__).resolve().parent / "public" / "style.css"

TEXT_THRESHOLD = 4.5
FOCUS_THRESHOLD = 3.0

# Pares (variable de texto/foco, variable de fondo).
TEXT_PAIRS = [
    ("--color-texto", "--color-fondo"),
    ("--color-texto-suave", "--color-fondo"),
    ("--color-texto", "--color-fondo-azul"),
    ("--color-texto-suave", "--color-fondo-azul"),
    ("--color-texto", "--color-superficie"),
    ("--color-texto-suave", "--color-superficie"),
    ("--color-texto", "--color-fondo-aviso"),
    ("--color-texto", "--color-fondo-verde"),
    ("--color-sobre-primario", "--color-primario"),
    ("--color-sobre-primario", "--color-primario-oscuro"),
    ("--color-sobre-primario", "--color-secundario"),
    ("--color-sobre-primario", "--color-secundario-oscuro"),
    ("--color-sobre-primario", "--color-peligro"),
    ("--color-primario", "--color-fondo"),
    ("--color-primario-oscuro", "--color-fondo-azul"),
    ("--color-secundario", "--color-fondo"),
    ("--color-secundario-oscuro", "--color-fondo"),
    ("--color-secundario", "--color-superficie"),
]

FOCUS_PAIRS = [
    ("--color-foco", "--color-fondo"),
    ("--color-foco", "--color-superficie"),
    ("--color-foco-invertido", "--color-primario-oscuro"),
]


def read_root_colors(path):
    text = path.read_text(encoding="utf-8")
    match = re.search(r":root\s*\{(.*?)\}", text, re.S)
    if not match:
        raise ValueError("no se encontro el bloque :root en " + str(path))
    colors = {}
    for name, value in re.findall(r"(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\b", match.group(1)):
        colors[name] = value.lower()
    return colors


def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) / 255.0 for i in (0, 2, 4))


def relative_luminance(rgb):
    def channel(c):
        if c <= 0.03928:
            return c / 12.92
        return ((c + 0.055) / 1.055) ** 2.4

    r, g, b = map(channel, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio_for(hex_fg, hex_bg):
    lum_fg = relative_luminance(hex_to_rgb(hex_fg))
    lum_bg = relative_luminance(hex_to_rgb(hex_bg))
    lighter = max(lum_fg, lum_bg)
    darker = min(lum_fg, lum_bg)
    return (lighter + 0.05) / (darker + 0.05)


def main():
    colors = read_root_colors(STYLE_PATH)
    failures = 0
    print("Fuente: %s" % STYLE_PATH)
    print("%-28s %-28s %-9s %-9s %-7s %-5s" % ("primer plano", "fondo", "fg", "bg", "ratio", "ok"))
    for pairs, threshold in ((TEXT_PAIRS, TEXT_THRESHOLD), (FOCUS_PAIRS, FOCUS_THRESHOLD)):
        for fg_name, bg_name in pairs:
            if fg_name not in colors:
                print("%-28s %-28s %-9s %-9s %-7s %-5s" % (fg_name, bg_name, "?", "?", "?", "FALTA"))
                failures += 1
                continue
            if bg_name not in colors:
                print("%-28s %-28s %-9s %-9s %-7s %-5s" % (fg_name, bg_name, colors.get(fg_name, "?"), "?", "?", "FALTA"))
                failures += 1
                continue
            ratio = ratio_for(colors[fg_name], colors[bg_name])
            ok = ratio >= threshold
            if not ok:
                failures += 1
            print("%-28s %-28s %-9s %-9s %-7.2f %-5s" % (
                fg_name, bg_name, colors[fg_name], colors[bg_name], ratio,
                "OK" if ok else "FALLA"))
    print("Umbral texto: %.1f:1, umbral foco: %.1f:1" % (TEXT_THRESHOLD, FOCUS_THRESHOLD))
    if failures:
        print("%d par(es) por debajo del umbral." % failures)
        return 1
    print("Todos los pares cumplen.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
