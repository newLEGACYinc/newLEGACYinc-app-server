# Technical FAQ

This isn't so much an "FAQ" as it is a "things I discovered while developing and don't want to have to re-Google".

### Why use HTTPs at all?

Registration IDs for GCM [must be kept secret](http://developer.android.com/google/gcm/gcm.html#key).
Using an unencrypted protocol to send client registration IDs to the server could compromise the security of this
 information.