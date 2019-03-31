@echo off
mkdir temp
echo node ".\index.js" ^&^& del "temp\splasher.vbs" ^&^& del "temp\splasher.bat" ^&^& rmdir "temp" > "temp\splasher.bat"
echo CreateObject("Wscript.Shell").Run """" ^& WScript.Arguments(0) ^& """", 0, False > "temp\splasher.vbs"
START /MIN "minimin" wscript "temp\splasher.vbs" "temp\splasher.bat"