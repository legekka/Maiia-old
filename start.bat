@Echo off
title Maiia
:start
node frame.js --no-warnings
if %ERRORLEVEL% NEQ 2 goto:start