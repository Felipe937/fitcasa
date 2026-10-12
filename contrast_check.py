import re
import sys

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))

def relative_luminance(rgb):
    def channel(c):
        if c <= 0.03928:
            return c / 12.92
        return ((c + 0.055) / 1.055) ** 2.4
    r, g, b = map(channel, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(l1, l2):
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def ratio_for(hex_fg, hex_bg):
    fg_rgb = hex_to_rgb(hex_fg)
    bg_rgb = hex_to_rgb(hex_bg)
    return contrast_ratio(relative_luminance(fg_rgb), relative_luminance(bg_rgb))

# Define colors from CSS variables
colors = {
    'color-texto': '#1f2933',
    'color-texto-suave': '#4a5a66',
    'color-fondo': '#f7fafb',
    'color-fondo-azul': '#e8f3f7',
    'color-fondo-verde': '#e6f4ee',
    'color-fondo-aviso': '#fdf3d7',
    'color-primario': '#1f6f8b',
    'color-primario-oscuro': '#17566d',
    'color-secundario': '#2f7d5b',
    'color-sobre-primario': '#ffffff',
    'color-foco': '#0b4f9c',
}

pairs = [
    ('color-texto', 'color-fondo'),
    ('color-texto', 'color-fondo-azul'),
    ('color-texto', 'color-fondo-verde'),
    ('color-texto-suave', 'color-fondo'),
    ('color-texto-suave', 'color-fondo-azul'),
    ('color-texto', 'color-fondo-aviso'),
    ('color-sobre-primario', 'color-primario'),
    ('color-sobre-primario', 'color-primario-oscuro'),
    ('color-sobre-primario', 'color-secundario'),
    ('color-primario', 'color-fondo'),
    ('color-primario', 'color-fondo-azul'),
    ('color-foco', 'color-fondo'),
]

print('Contrast ratios (rounded to 2 decimals):')
for fg, bg in pairs:
    ratio = ratio_for(colors[fg], colors[bg])
    print(f"{fg} on {bg}: {ratio:.2f}")
