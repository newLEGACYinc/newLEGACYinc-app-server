# SSL Setup

You'll need to renew the certificates to the server every year in order to maintain
HTTPs. Here's the process you'll need to go through:

1) Generate an RSA key:
`openssl genrsa -out ~/newLEGACYinc.me.ssl/newLEGACYinc.me.key 2048`
2) Create a CSR:
`openssl req -new -sha256 -key ~/newLEGACYinc.me.ssl/newLEGACYinc.me.key -out  ~/newLEGACYinc.me.ssl/newLEGACYinc.me.csr`.
  * For the common name, enter `newlegacyinc.me` (case-sensitive (I think))
  * DO NOT enter a challenge password
3) Copy this CSR to your clipboard (`more ~/newLEGACYinc.me.ssl/newLEGACYinc.me.csr`)
4) Enter information into Certificate Authority's site.
