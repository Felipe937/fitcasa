#!/usr/bin/env python3
"""
Comprobador de contraste WCAG 2.1 AA para los tokens visuales de FitCasa.
Lee las variables CSS desde src/styles/style.css y verifica los ratios de contraste
para texto normal (>= 4.5:1), texto grande (>= 3.0:1) y componentes de UI (>= 3.0:1).
"""

import re
import sys
from pathlib import Path

CSS_PATH = Path("src/styles/style.css")

def parse_hex_color(hex_str: str) -> tuple[int, int, int]:
    hex_clean = hex_str.strip().lstrip("#")
    if len(hex_clean) == 3:
        hex_clean = "".join(c * 2 for c in hex_clean)
    if len(hex_clean) != 6:
        raise ValueError(f"Color hexadecimal no válido: {hex_str}")
    return (
        int(hex_clean[0:2], 16),
        int(hex_clean[2:4], 16),
        int(hex_clean[4:6], 16),
    )

def relative_luminance(rgb: tuple[int, int, int]) -> float:
    def channel_luminance(val: int) -> float:
        c = val / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (channel_luminance(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(hex1: str, hex2: str) -> float:
    lum1 = relative_luminance(parse_hex_color(hex1))
    lum2 = relative_luminance(parse_hex_color(hex2))
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)

def extract_variables(css_content: str) -> dict[str, str]:
    var_pattern = re.compile(r"(--color-[a-z0-9\-]+)\s*:\s*(#[0-9a-fA-F]{3,8});")
    variables = {}
    for match in var_pattern.finditer(css_content):
        variables[match.group(1)] = match.group(2).lower()
    return variables

def main() -> int:
    if not CSS_PATH.exists():
        print(f"ERROR: No se encontró el archivo de estilos en {CSS_PATH}")
        return 1

    content = CSS_PATH.read_text(encoding="utf-8")
    vars_map = extract_variables(content)

    # Pares clave de contraste a auditar según el diseño de FitCasa
    test_pairs = [
        # (Nombre del par, Texto/Primer plano, Fondo, Mínimo requerido, Tipo)
        ("Texto general en fondo base", "--color-texto", "--color-fondo", 4.5, "normal"),
        ("Texto general en superficie blanca", "--color-texto", "--color-superficie", 4.5, "normal"),
        ("Texto general en fondo azul suave", "--color-texto", "--color-fondo-azul", 4.5, "normal"),
        ("Texto general en fondo verde suave", "--color-texto", "--color-fondo-verde", 4.5, "normal"),
        ("Texto general en fondo aviso (ámbar)", "--color-texto", "--color-fondo-aviso", 4.5, "normal"),
        ("Texto general en fondo alerta", "--color-texto", "--color-fondo-alerta", 4.5, "normal"),
        ("Texto secundario en superficie", "--color-texto-suave", "--color-superficie", 4.5, "normal"),
        ("Texto secundario en fondo base", "--color-texto-suave", "--color-fondo", 4.5, "normal"),
        ("Texto blanco sobre botón primario", "--color-sobre-primario", "--color-primario", 4.5, "normal"),
        ("Texto blanco sobre primario oscuro (hover)", "--color-sobre-primario", "--color-primario-oscuro", 4.5, "normal"),
        ("Enlace primario sobre fondo base", "--color-primario", "--color-fondo", 4.5, "normal"),
        ("Enlace primario sobre fondo blanco", "--color-primario", "--color-superficie", 4.5, "normal"),
        ("Texto peligro sobre fondo alerta", "--color-peligro", "--color-fondo-alerta", 4.5, "normal"),
        ("Indicador de foco sobre fondo blanco", "--color-foco", "--color-superficie", 3.0, "ui"),
        ("Indicador de foco invertido sobre primario oscuro", "--color-foco-invertido", "--color-primario-oscuro", 3.0, "ui"),
    ]

    print("=== Comprobación de Contraste WCAG 2.1 AA (FitCasa) ===")
    print(f"Fuente evaluada: {CSS_PATH}\n")

    failed = False
    for label, fg_var, bg_var, min_ratio, kind in test_pairs:
        fg_hex = vars_map.get(fg_var)
        bg_hex = vars_map.get(bg_var)

        if not fg_hex or not bg_hex:
            print(f"❌ {label}: Variable no encontrada ({fg_var} o {bg_var})")
            failed = True
            continue

        ratio = contrast_ratio(fg_hex, bg_hex)
        passed = ratio >= min_ratio

        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} | {label}")
        print(f"       {fg_var} ({fg_hex}) sobre {bg_var} ({bg_hex})")
        print(f"       Ratio: {ratio:.2f}:1 (Requerido: >={min_ratio}:1 [{kind}])\n")

        if not passed:
            failed = True

    if failed:
        print("RESULTADO: Se encontraron problemas de contraste que incumplen WCAG 2.1 AA.")
        return 1

    print("RESULTADO: Todos los pares evaluados cumplen con las pautas WCAG 2.1 AA.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
