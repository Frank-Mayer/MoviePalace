#!/usr/bin/python3

# import http.client
# import urllib.request
# import urllib.parse
# import urllib.error
# import sys
import os
from pathlib import Path
import shutil
from shutil import copyfile
from shutil import rmtree

rmtree('./www', ignore_errors=True)

os.system("tsc -p " + "./tsconfig.json --pretty")

scss = list(Path(".").rglob("*.scss"))
for file in scss:
    print(file)
    compiledFile = os.path.basename(file).replace(".scss", ".css")
    os.system("sass "+str(file)+" www/style/" + compiledFile)
    pass

html = list(Path(".").rglob("*.html"))
for file in html:
    print(file)
    copyfile(file, "./www/"+os.path.basename(file))
    pass

if not os.path.exists("./www/img"):
    os.makedirs("./www/img")
webp = list(Path(".").rglob("*.webp"))
for file in webp:
    print(file)
    filename = os.path.basename(file)
    copyfile(str(file), "./www/img/" + filename)
    pass

svg = list(Path(".").rglob("*.svg"))
for file in svg:
    print(file)
    filename = os.path.basename(file)
    copyfile(str(file), "./www/img/" + filename)
    pass
