#!/usr/bin/python3

import os
from pathlib import Path
import shutil
from shutil import copyfile
from shutil import rmtree

print("tsconfig.json")
os.system("tsc -p ./tsconfig.json --pretty")

scss = list(Path(".").rglob("*.scss"))
for file in scss:
    print(file)
    compiledFile = os.path.basename(file).replace(".scss", ".css")
    os.system("sass "+str(file)+" www/style/" + compiledFile + " --style compressed")
    pass
