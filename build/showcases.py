import cssutils
import math
import json


def text_shadow_generator(color, radius, steps=12):
    shadows = []
    for i in range(steps):
        angle = (2 * math.pi / steps) * i
        x = round(math.cos(angle) * float(radius), 6)
        y = round(math.sin(angle) * float(radius), 6)
        shadows.append(f"{color} {x}px {y}px 0px")
    return ", ".join(shadows)

def generate(file):
    with open(f"showcases/{file}","r") as f:
        data = json.loads(f.read())
    
    sheet = cssutils.css.CSSStyleSheet()

    def add_rule(selector, props):
        rule = cssutils.css.CSSStyleRule()
        rule.selectorText = f"[rw-theme=\"{file.split(".")[0]}\"] {selector}"
        for name, value in props.items():
            rule.style.setProperty(name, value)
        sheet.add(rule)

    add_rule(".avatar-card-image", {
        "background-color": "rgba(255,255,255,0.15)",
        "backdrop-filter": "blur(2px)"
    })

    add_rule(".avatar-name-container a", {
        "color": data["profile"]["text-color"],
        "text-shadow": text_shadow_generator(
            data["profile"]["stroke"][1],
            data["profile"]["stroke"][0]
        ),
        "padding": f"{data["profile"]["stroke"][0]}px"
    })

    add_rule(".avatar-card-label, .text-link", {
        "color": data["profile"]["subtext-color"],
        "text-shadow": text_shadow_generator(
            data["profile"]["stroke"][1],
            data["profile"]["stroke"][0]
        ),
        "padding": f"{data["profile"]["stroke"][0]}px"
    })
    
    bg = {
        "border-radius": "5px"
    }
    
    if data["type"] == "image":
        bg["background-image"] = f"url(\"{data["background"]["image"]}\")"
        bg["background-position"] = data["background"]["position"]
        bg["background-size"] = data["background"]["mini-zoom"]
    
    add_rule(".avatar-card-container",bg)
    
    return sheet.cssText.decode().replace("\n","")