import json
import os
import re

metadata = ["// ==UserScript=="]

with open("userscript.json") as f:
    config = json.load(f)

for k,v in config.items():
    metadata.append(f"// @{k}{" "*(15-len(k))}{v}")

metadata.append("// ==/UserScript==")
script = []
script.append("\n".join(metadata))

script.append("""(function() {'use strict';""")

with open("src/style.css","r") as f:
    script.append(f"""
const style = document.createElement("style");
style.innerHTML = `{f.read()}`
document.body.prepend(style)
""")

def walk(file):
    with open(file,"r") as f:
        content = f.read()
    for imp in re.findall(r"//\W+@[\w\/.]+", content):
        path = f"src/{imp.split(" ")[-1].replace("@","")}"
        return content.replace(imp,walk(path))
    return content

script.append(walk("src/main.js"))

script.append("""})();""")

with open("dist/RoWindy.dev.js","w+") as f:
    f.write("\n".join(script))

os.system("js-beautify -r dist/RoWindy.dev.js")
os.system("terser dist/RoWindy.dev.js --compress --mangle --output dist/RoWindy.js")

with open("dist/RoWindy.userscript.js","w+") as f:
    with open("dist/RoWindy.js","r") as r:
        f.write("\n".join(["\n".join(metadata),"\n// Source at https://github.com/grhw/RoWindy\n",r.read()]))