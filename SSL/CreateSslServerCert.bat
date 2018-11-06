@echo off

:: set path
SET PATH=%PATH%;C:\Program Files (x86)\Windows Kits\10\bin\10.0.17134.0\x64

:: short expiration incose this doesn't get updated for future security issues
echo generate localhost server SSL cert
makecert.exe ^
-n "CN=localhost" ^
-iv CARoot.pvk ^
-ic CARoot.cer ^
-sr CurrentUser ^
-ss My ^
-pe ^
-a sha512 ^
-len 4096 ^
-b 01/01/2018 ^
-e 01/01/2020 ^
-sky exchange ^
-eku 1.3.6.1.5.5.7.3.1 ^
-sv ServerSSL.pvk ^
ServerSSL.cer


pvk2pfx.exe ^
-pvk ServerSSL.pvk ^
-spc ServerSSL.cer ^
-pfx ServerSSL.pfx ^
-po Test123