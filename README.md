# ddot-cli


A small TypeScript authored CLI for browsing traffic cameras.

I made this because the main site provided by DDOT largely fails to load. The Javascript from their site was pretty easy to deconstruct. Under the hood:

* They're running an MQTT server in AWS
* On page load, the browser will connect to the MQTT server, and subscribe to the `WS/Camera` topic
* The MQTT server pushes a message on that topic to the client, with a structured list of available cameras. Each camera has the following properties:
  * `id`: numeric ID
  * `agencyId`: Not sure but they're all `4` so assuming this is something DDOT internal
  * `title`: Location name (cross-streets)
  * `lat` and `lng`
  * `host`: the host where the HLS playlist is located
  * `stream`: part of the HLS URI


To play back a certain camera, construct the URL `http://${camera.host}/rtplive/${camera.stream}/playlist.m3u8`. Playing this back via an HLS
capable player such as `ffplay` or VLC is sufficient to view footage.
