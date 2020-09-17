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

print("index.html")
copyfile("./index.html", "./www/index.html")

if not os.path.exists("./www/img"):
    os.makedirs("./www/img")
webp = list(Path(".").rglob("*.webp"))
for file in webp:
    print(file)
    filename = os.path.basename(file)
    copyfile(str(file), "./www/img/" + filename)

svg = list(Path(".").rglob("*.svg"))
for file in svg:
    print(file)
    filename = os.path.basename(file)
    copyfile(str(file), "./www/img/" + filename)

# js = list(Path(".").rglob("*.js"))
# for file in js:
#     print(file)
# file_path = (os.path.join(directory, filename))
# file_object = open(file_path, "r")
# code = file_object.read()
# file_object.close()
# params = urllib.parse.urlencode([
#     ('js_code', code),
#     ('compilation_level', 'ADVANCED_OPTIMIZATIONS'),
#     ('output_format', 'text'),
#     ('output_info', 'compiled_code'),
# ])
# headers = {"Content-type": "application/x-www-form-urlencoded"}
# conn = http.client.HTTPSConnection('closure-compiler.appspot.com')
# conn.request('POST', '/compile', params, headers)
# response = conn.getresponse()
# data = response.read()
# code = data.decode("utf-8")
# print("Minified by closure-compiler")
# file_object = open(file_path, "w")
# file_object.write('"use strict";\n'+code)
# file_object.close()
# conn.close()
pass
