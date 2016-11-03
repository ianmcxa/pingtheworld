let ping = require ("net-ping");
let fs = require('fs');
let Datastore = require('nedb');
let cron = require('node-cron');

/**
 * This function pings a server and saves the result to the database
 */
let pingHost = function(target, session, db) {
  session.pingHost (target.ip, (error, ip, sent, rcvd) => {
    if (error) {
      db.insert({ targetName: target.name,
                  targetIp: target.ip,
                  time: new Date().toString(),
                  duration: null,
                  error: error.toString()
      });

      console.log (target.ip + ": " + error.toString ());
    } else {
      db.insert({ targetName: target.name,
                  targetIp: target.ip,
                  time: new Date().toString(),
                  duration: rcvd - sent,
                  error: null
      });

      console.log (target.ip + ": time (ms) " + (rcvd - sent));
    }
  });
}

/**
 * Here we create the session to ping from
 */
let createSession = function() {
  let options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 1,
    sessionId: (process.pid % 65535),
    timeout: 2000,
    ttl: 128
  };

  return ping.createSession(options);
}

/**
 * We load the database in this function.
 */
let loadDB = function() {
  let db = new Datastore('./data.db');
  db.loadDatabase();
  return db;
}

/**
 * Main function, runs the program
 */
let main = function() {
  let db = loadDB();
  let session = createSession();

  let serverString = fs.readFileSync('./servers.json');
  let servers = JSON.parse(serverString);

  cron.schedule('0 * * * *', () => {
    servers.forEach((server) => {
      pingHost(server, session, db);
    });
  });
}

main();
