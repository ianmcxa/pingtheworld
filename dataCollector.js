/**
 * This abomination is an attempt to parse data into a CSV in an hour.
 * It randomly samples
 */

let Datastore = require('nedb');

/**
 * We load the database in this function.
 */
let loadDB = function() {
  let db = new Datastore('./data.db');
  db.loadDatabase();
  return db;
}

let loadLocationDay = function(db, location, day) {
  db.find({ $and: [{targetName: location}, {$where:
    function () {
      let time = new Date(this.time);
      return this.time.includes(day) && time.getHours() > 6 && time.getHours() < 18;
    }
    }]},
    function(err, docs) {
      let arr = [];
      //randomize the array
      docs.sort( function() { return 0.5 - Math.random() } );

      for(let i = 0; i < 5; i++) {
        arr.push(docs[i].duration);
      }

      arr.forEach(function(element) {
        console.log(location + ",Day," + day + "," + element);
      });
    });
}

let loadLocationNight = function(db, location, day) {
  db.find({ $and: [{targetName: location}, {$where:
    function () {
      let time = new Date(this.time);
      return this.time.includes(day) && (time.getHours() <= 6 || time.getHours() >= 18);
    }
    }]},
    function(err, docs) {
      let arr = [];
      //randomize the array
      docs.sort( function() { return 0.5 - Math.random() } );

      for(let i = 0; i < 5; i++) {
        arr.push(docs[i].duration);
      }

      arr.forEach(function(element) {
        console.log(location + ",Night," + day + "," + element);
      });
    });
}



let db = loadDB();

let loadData = function() {
  console.log("Location, Day/Night, Day of Week, Ping Time");
  ["New York","Amsterdam","San Francisco","Frankfurt","Bangalore"].forEach(function(location) {
    ["Thu","Fri","Sat","Sun","Mon"].forEach(function(day) {
      loadLocationDay(db, location, day);
      loadLocationNight(db, location, day);
    });
  });
}

loadData();
