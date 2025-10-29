#!/bin/bash
cd /home/kavia/workspace/code-generation/netweb-application-5907-6069/ReactFrontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

