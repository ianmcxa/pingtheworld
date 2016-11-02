let ping = require ("net-ping");
let fs = require('fs');

let pingHost = function(server, session) {
  session.pingHost (server, (error, target, sent, rcvd) => {
    if (error)
        console.log (target + ": " + error.toString ());
    else
        console.log (target + ": time (ms) " + (rcvd - sent));
  });
}

let createSession = function() {
  let options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 1,
    sessionId: (process.pid % 65535),
    timeout: 2000,
    ttl: 128
  };

  return ping.createSession (options);
}
