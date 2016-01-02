# Technical FAQ

This isn't so much an "FAQ" as it is a "things I discovered while developing and don't want to have to re-Google".

### Why use HTTPs at all?

Registration IDs for GCM [must be kept secret](http://developer.android.com/google/gcm/gcm.html#key).
Using an unencrypted protocol to send client registration IDs to the server could compromise the security of this
 information.

### Why are you removing devices from your database?

Sometimes, multiple registrations will be triggered for the same device. In order to reconcile the difference between
 the old registration ID and the new registration ID, the old registration ID (and the settings associated with it) are
 discarded. In the future, it would probably be better to attempt to preserve the settings from the old registration
 id.
