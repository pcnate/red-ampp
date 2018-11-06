@echo off

:: set path
SET PATH=%PATH%;C:\Program Files (x86)\Windows Kits\10\bin\10.0.17134.0\x64

echo generate client cert
makecert.exe ^
-n "CN=ClientCert" ^
-iv CARoot.pvk ^
-ic CARoot.cer ^
-pe ^
-a sha512 ^
-len 4096 ^
-b 01/01/2014 ^
-e 01/01/2016 ^
-sky exchange ^
-eku 1.3.6.1.5.5.7.3.2 ^
-sv ClientCert.pvk ^
ClientCert.cer

pvk2pfx.exe ^
-pvk ClientCert.pvk ^
-spc ClientCert.cer ^
-pfx ClientCert.pfx ^
-po Test123