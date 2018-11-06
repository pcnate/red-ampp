@echo off

:: set path
SET PATH=%PATH%;C:\Program Files (x86)\Windows Kits\10\bin\10.0.17134.0\x64

echo generate root cert
makecert.exe ^
  -n "CN=CARoot" ^
  -sr LocalMachine ^
  -ss Root ^
  -r ^
  -pe ^
  -a sha512 ^
  -len 4096 ^
  -cy authority ^
  -sv CARoot.pvk ^
  CARoot.cer
 
:: convert pvk to pfx
pvk2pfx.exe ^
  -pvk CARoot.pvk ^
  -spc CARoot.cer ^
  -pfx CARoot.pfx ^
  -po Test123
