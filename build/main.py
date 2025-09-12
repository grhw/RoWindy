import json
import os
import re

script = ["// ==UserScript=="]

with open("userscript.json") as f:
    config = json.load(f)

for k,v in config.items():
    script.append(f"// @{k}{" "*(15-len(k))}{v}")

script.append("// ==/UserScript==")
script.append("""(function() {'use strict';""")

def walk(file):
    with open(file,"r") as f:
        content = f.read()
    for imp in re.findall(r"//\W+@[\w\/.]+", content):
        path = f"src/{imp.split(" ")[-1].replace("@","")}"
        return content.replace(imp,walk(path))
    return content

script.append(walk("src/main.js"))
script.append("""})();""")

with open("dist/unformatted.js","w+") as f:
    f.write("\n".join(script))

os.system("js-beautify -r dist/RoWindy.userscript.js")