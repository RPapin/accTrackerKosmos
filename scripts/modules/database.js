const pathDb = "./public/tracker.db";
const results = require('./results');
const timeParse = require('./time');
const sqlite = require('better-sqlite3');

exports.createSession = (server, track, weatherValue, sessionType, dataCreation) => {
    const db = new sqlite(pathDb);
    
    const date = new Date(dataCreation).getTime();
    track = results.fixTrackYear(track);
    let stmt = db.prepare(`INSERT OR IGNORE INTO Sessions VALUES(NULL, ?, ?, ?, ?, ?)`);
    stmt.run(server, track, weatherValue, sessionType, date);

    stmt = db.prepare(`SELECT ses_id FROM Sessions WHERE ses_creation = ?`);
    let lastId = stmt.get(date);

    db.close();

    return lastId["ses_id"];
};

exports.insertTime = (driverName, carModel, time, lastId, isValid) => {
    const db = new sqlite(pathDb);

    // ACI 40 LAPS
    const isValidForACI = checkACI(driverName, time);

    let stmt = db.prepare(`INSERT OR IGNORE INTO Times VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(driverName, carModel, timeParse.getSeconds(time[0]), timeParse.getSeconds(time[1]), timeParse.getSeconds(time[2]), lastId, isValidForACI, isValid);

    db.close();
};

checkACI = (driverName, time) => {
    const db = new sqlite(pathDb);

    let stmt = db.prepare(`SELECT COUNT(tim_driverName) as Count FROM Times WHERE tim_driverName = ?`);
    let rs = stmt.get(driverName);

   let count = rs["Count"];

    if(count >= 40) {
        return 0
    } else {
        return -1
    }
}

exports.serverCollections = () => {
    const db = new sqlite(pathDb);

    let stmt = db.prepare(`SELECT * FROM Sessions INNER JOIN Tracks ON ses_track = tra_nameCode INNER JOIN Times on tim_sessionId = ses_id GROUP BY ses_serverName, ses_track, ses_weather ORDER BY ses_weather ASC`);
    let servers = stmt.all();

    db.close();
    return servers;
}

exports.sessionCollections = () => {
    const db = new sqlite(pathDb);

    let stmt = db.prepare(`SELECT * FROM Sessions INNER JOIN Tracks ON ses_track = tra_nameCode INNER JOIN Times ON tim_sessionId = ses_id GROUP BY ses_id ORDER BY ses_creation DESC`);
    let sessions = stmt.all();

    db.close();
    return sessions;
}

exports.timesCollection = (sessionId) => {
    const db = new sqlite(pathDb);
    let stmt = db.prepare(`SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_id = ? GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName ORDER BY tim_totalTime ASC `);
    let times = stmt.all(sessionId);

    db.close();
    return times;
}

exports.sessionDetails = (sessionId) => {
    const db = new sqlite(pathDb);

    let stmt = db.prepare(`SELECT ses_serverName, ses_weather FROM Sessions WHERE ses_id = ?`);
    let serverInfo = stmt.get(sessionId);

    stmt = db.prepare(`SELECT count(tim_driverName) as tim_driverCount FROM (SELECT tim_driverName FROM Times WHERE tim_sessionId = ? GROUP BY tim_driverName);`);
    let driverCount = stmt.get(sessionId);

    stmt = db.prepare(`SELECT tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree, sum(tim_sectorOne + tim_sectorTwo+ tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions on tim_sessionId = ses_id WHERE ses_id = ? GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC LIMIT 1`);
    let bestTime = stmt.get(sessionId);

    stmt = db.prepare(`SELECT min(tim_sectorOne) as bestSectorOne, min(tim_sectorTwo) as bestSectorTwo, min(tim_sectorTree) as bestSectorTree FROM (SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_id = ? GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName ORDER BY tim_totalTime ASC)`);
    let bestSectors = stmt.get(sessionId);

    db.close();

    return [serverInfo, driverCount, bestTime, bestSectors];
}

exports.driverDetail = (sessionId, driverName) => {
    const db = new sqlite(pathDb);

    let stmt = db.prepare(`SELECT * FROM (SELECT tim_sectorOne, tim_sectorTwo, tim_sectorTree, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_id = ? AND tim_driverName = ? GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree);`);
    let times = stmt.all(sessionId, driverName);

    stmt = db.prepare(`SELECT * FROM (SELECT tra_km, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId INNER JOIN Tracks ON ses_track = tra_nameCode WHERE ses_id = ? AND tim_driverName = ? GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC LIMIT 1) ORDER BY tim_totalTime ASC`);
    
    let avgSpeed = (timeParse.getAvg(stmt.get(sessionId, driverName))).toFixed(3);

    stmt = db.prepare(`SELECT * FROM (SELECT sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_id = ?  GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree)ORDER BY tim_totalTime ASC LIMIT 1;`);
    let bestTime = stmt.get(sessionId);

    stmt = db.prepare(`SELECT * FROM (SELECT sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_id = ? AND tim_driverName = ? GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree)ORDER BY tim_totalTime ASC LIMIT 1;`);
    let bestDriverTime = stmt.get(sessionId, driverName);

    db.close();

    return [times, avgSpeed, bestTime.tim_totalTime, bestDriverTime.tim_totalTime];
}

exports.getAllTracks = () => {
    const db = new sqlite(pathDb);

    let stmt = db.prepare(`SELECT tra_name, tra_nameCode, tra_flag, tra_track FROM Sessions INNER JOIN Tracks ON ses_track = tra_nameCode INNER JOIN Times ON tim_sessionId = ses_id GROUP BY tra_name`);
    let tracks = stmt.all();

    db.close();
    return tracks;
}

exports.fullLeaderboard = (track) => {
    const db = new sqlite(pathDb);

    let stmt = db.prepare(`SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_track = ? AND tim_isValid = -1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName ORDER BY tim_totalTime ASC;`);
    let times = stmt.all(track);

    stmt = db.prepare(`SELECT * FROM (SELECT sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_track = ? AND tim_isValid = -1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree)ORDER BY tim_totalTime ASC LIMIT 1;`)
    let bestTime = stmt.get(track);

    stmt = db.prepare(`SELECT count(tim_driverName) as tim_driverCount FROM (SELECT tim_driverName FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_track = ? GROUP BY tim_driverName);`);
    let driverCount = stmt.get(track);

    stmt = db.prepare(`SELECT min(tim_sectorOne) as bestSectorOne, min(tim_sectorTwo) as bestSectorTwo, min(tim_sectorTree) as bestSectorTree FROM (SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_track = ? AND tim_isValid = -1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName ORDER BY tim_totalTime ASC);`);
    let bestSectors = stmt.get(track);

    stmt = db.prepare(`SELECT * FROM Tracks WHERE tra_nameCode = ?;`);
    let trackInfo = stmt.get(track);

    db.close();
    
    return [times, bestTime, driverCount, bestSectors, trackInfo];
}

exports.serverLeaderboard = (server, track) => {
    const db = new sqlite(pathDb);
    // request to update to gather only valids laps / all laps
    let stmt = db.prepare(`SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Cars on tim_carModel = car_id INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_serverName = ? AND ses_track = ? AND tim_isValid=-1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName ORDER BY tim_totalTime ASC;`);
    let times = stmt.all(server, track);

    stmt = db.prepare(`SELECT * FROM (SELECT sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_serverName = ? AND ses_track = ? AND tim_isValid = -1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree)ORDER BY tim_totalTime ASC LIMIT 1;`);
    let bestTime = stmt.get(server, track);

    stmt = db.prepare(`SELECT count(tim_driverName) as tim_driverCount FROM (SELECT tim_driverName FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_serverName = ? AND ses_track = ? GROUP BY tim_driverName);`);
    let driverCount = stmt.get(server, track);

    stmt = db.prepare(`SELECT min(tim_sectorOne) as bestSectorOne, min(tim_sectorTwo) as bestSectorTwo, min(tim_sectorTree) as bestSectorTree FROM (SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_serverName = ? AND ses_track = ? AND tim_isValid = -1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName ORDER BY tim_totalTime ASC);`);
    let bestSectors = stmt.get(server, track);

    stmt = db.prepare(`SELECT * FROM Sessions INNER JOIN Tracks ON ses_track = tra_nameCode WHERE ses_serverName = ? AND tra_nameCode = ?;`);
    let info = stmt.get(server, track);

    stmt = db.prepare(`SELECT count(car_carsUsed) as car_count, car_name, car_color FROM (SELECT count(tim_carModel) as car_carsUsed, car_name, car_color FROM Times INNER JOIN Cars ON tim_carModel = car_id INNER JOIN Sessions ON tim_sessionId = ses_id WHERE ses_serverName = ? AND ses_track = ? GROUP BY tim_driverName) GROUP BY car_name`);
    let cars = stmt.all(server, track);

    stmt = db.prepare(`SELECT car_name, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totaltime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId INNER JOIN Cars ON tim_carModel = car_id WHERE ses_serverName= ? AND ses_track = ? AND tim_isValid = -1 ORDER BY tim_totaltime ASC LIMIT 1;`)
    let bestAvgCar = stmt.get(server, track);
    let avgCars = stmt.all(server, track);

    // Valid laps
    stmt = db.prepare(`SELECT tim_driverName, count(tim_driverName) as tim_validCount FROM Times INNER JOIN Sessions ON tim_sessionId = ses_id WHERE ses_serverName = ? AND ses_track = ? AND tim_isValid = -1 GROUP BY tim_drivername`);
    let validsCount = stmt.all(server, track);
    //For all who havn't made one valid lap
    stmt = db.prepare(`SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Cars on tim_carModel = car_id INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_serverName = ? AND ses_track = ? GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName HAVING max(case when tim_isValid = -1 then 1 else 0 end )= 0 ORDER BY tim_totalTime ASC;`);
    let notValidTimes = stmt.all(server, track);
    //count all laps
    stmt = db.prepare(`SELECT tim_driverName, count(tim_driverName) as tim_totalCount FROM Times INNER JOIN Sessions ON tim_sessionId = ses_id WHERE ses_serverName = ? AND ses_track = ? GROUP BY tim_drivername`);
    let allLapsCount = stmt.all(server, track);

    db.close();

    return[times, bestTime, driverCount, bestSectors, info, cars, bestAvgCar, avgCars, validsCount, notValidTimes, allLapsCount];
}

exports.serverDetail = (server, track, driverName) => {
    const db = new sqlite(pathDb);

    let stmt = db.prepare(`SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Cars on tim_carModel = car_id INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_serverName = ? AND ses_track = ? AND tim_driverName = ? AND tim_isValid = -1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName ORDER BY tim_totalTime ASC;`);
    let bestDriverTime = stmt.get(server, track, driverName);

    stmt = db.prepare(`SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Cars on tim_carModel = car_id INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_serverName = ? AND ses_track = ? AND tim_isValid = -1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName ORDER BY tim_totalTime ASC;`);
    let bestDriver = stmt.get(server, track);

    stmt = db.prepare(`SELECT * FROM (SELECT tim_sectorOne, tim_sectorTwo, tim_sectorTree, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime, tim_isValid, tim_aciValid FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_serverName = ? AND ses_track = ? AND tim_driverName = ? GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_id);`);
    let times = stmt.all(server, track, driverName);

    stmt = db.prepare(`SELECT * FROM (SELECT tra_km, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId INNER JOIN Tracks ON ses_track = tra_nameCode WHERE ses_serverName = ? AND ses_track = ? AND tim_driverName = ? AND tim_isValid = -1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC LIMIT 1) ORDER BY tim_totalTime ASC`);

    let avgSpeed = (timeParse.getAvg(stmt.get(server, track, driverName))).toFixed(3);

    stmt = db.prepare(`SELECT count(tim_driverName) as tim_driverCount FROM (SELECT tim_driverName FROM Times INNER JOIN Sessions ON tim_sessionId = ses_id WHERE ses_serverName = ? AND ses_track = ? AND tim_driverName = ?);`);
    let driverCount = stmt.get(server, track, driverName);

    stmt = db.prepare(`SELECT min(tim_sectorOne) as bestSectorOne, min(tim_sectorTwo) as bestSectorTwo, min(tim_sectorTree) as bestSectorTree FROM (SELECT * FROM (SELECT *, sum(tim_sectorOne + tim_sectorTwo + tim_sectorTree) as tim_totalTime FROM Times INNER JOIN Sessions ON ses_id = tim_sessionId WHERE ses_serverName = ? AND ses_track = ? AND tim_isValid = -1 GROUP BY tim_driverName, tim_sectorOne, tim_sectorTwo, tim_sectorTree ORDER BY tim_totalTime ASC) GROUP BY tim_driverName ORDER BY tim_totalTime ASC);`);
    let bestSectors = stmt.get(server, track);

    stmt = db.prepare(`SELECT count(tim_driverName) as tim_driverCount FROM (SELECT tim_driverName FROM Times INNER JOIN Sessions ON tim_sessionId = ses_id WHERE ses_serverName = ? AND ses_track = ? AND tim_driverName = ? AND tim_isValid = -1);`);
    let driverCountValid = stmt.get(server, track, driverName);

    return [bestDriverTime, bestDriver, times, avgSpeed, driverCount, bestSectors, driverCountValid];
}

exports.resetDB = () => {
    const db = new sqlite(pathDb);

    let stmt = db.prepare(`DELETE FROM Sessions`);
    stmt.run();

    stmt = db.prepare(`DELETE FROM Times`);
    stmt.run();
    
    db.close();

    return true;
}