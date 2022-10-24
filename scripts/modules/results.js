const fs = require('fs');
const fsPromises = fs.promises;
const colors = require('colors/safe');

exports.getAllJsonFiles = async (filespath) => {
    let arr = [];
    if (fs.existsSync(filespath)) {
        let files = await fsPromises.readdir(filespath);
        if (files.length == 0) console.log(colors.bgRed(`0 files detected`));
        files.forEach(file => {
            if (file.indexOf(".json") > -1 && (file.includes("_FP") || file.includes("_Q") || file.includes("_R"))) {
                arr.push(this.getJsonFile(filespath + "/" + file));
                // console.log(`FILE OK ${colors.green(file)}`);
            } else {
                console.log(`FILE SKIPPED ${colors.red(file)}`);
            }
        });

        // console.log(colors.green("-------------------------------------"));
        
    } else {
        console.log(colors.bgRed(`No directory found || Your directory: ${filespath}`));
    }

    return arr;
}

exports.getJsonFile = (filename) => {
    let data;
    data = fs.readFileSync(filename).toString();
    data = this.removeEscape(data);

    return data;
}

exports.getAllJsonDataCreation = async (filespath) => {
    let dates = [];
    if (fs.existsSync(filespath)) {
        let files = await fsPromises.readdir(filespath);
        files.forEach(file => {
            let dateCreation = fs.statSync((filespath + "/" + file));
            dates.push(dateCreation["birthtime"]);
        })
    }
    return dates;
}

exports.getDataFile = (filespath) => {
    let data = fs.stat(filespath, (err, stat) => {
        return stat.mtime;
    })

    return data;
}

exports.getServerName = (arr) => {
    return arr["serverName"];
}

exports.getSessionType = (arr) => {
    return arr["sessionType"];
}

exports.getTrackName = (arr) => {
    return arr["trackName"];
}

exports.getBestLap = (arr) => {
    return arr["sessionResult"].bestlap;
}

exports.getWeather = (arr) => {
    return arr["sessionResult"].isWetSession;
}

exports.getFullLeaderBoard = (arr) => {
    return arr["sessionResult"].leaderBoardLines;
}

exports.getAllLapsFromDriver = (arr, id) => {
    let times = [];
    let i = 0;

    while (arr.laps[i] != undefined) {
        if (arr.laps[i].carId === id) {

            const obj = {
                splits: arr.laps[i].splits,
                isValidForBest: arr.laps[i].isValidForBest
            }

            times.push(obj);
        }

        i++;
    }

    return times;
}

exports.removeEscape = (string) => {
    string = string.replace(/[\u0000-\u0019]+/g, "");

    return JSON.parse(string);
}

exports.fixTrackYear = (track) => {
    return track.replace("_2019", "").replace("_2020", "");
}