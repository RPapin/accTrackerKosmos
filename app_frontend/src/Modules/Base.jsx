import axios from 'axios';

class Base {

    getIp = () => {
        const ip = (window.location.host).split(":");
        return ip[0];
    }

    getPort = () => {
        const port = (window.location.host).split(":");
        return port[1];
        // return 9000; 
    }

    getFullTime = (seconds) => {
        let tot;
        let duration = seconds / 1000;

        duration = duration % (3600);
        let minutes = parseInt(duration / 60);
        duration = duration % (3600);
        if (minutes >= 1) {
            seconds = duration - (60 * minutes);
        } else {
            seconds = duration;
        }
        seconds = seconds.toFixed(3);

        if (minutes === 0) {
            tot = seconds;
        } else {
            tot = seconds < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;
        }
        return tot;
    }

    getGap = (bestTime, currentTime) => {
        let gap = bestTime - currentTime;

        return (gap === 0 ? "-" : "+" + ((this.getFullTime(gap) * -1).toFixed(3)).replace("-", ""));
    }


    calculateAvgArray = (times) => {
        let avg = [];
        let sum = 0;
        let i = 1;

        for (let time of times) {
            avg.push(((sum + time.tim_totalTime) / i));
            sum = sum + time.tim_totalTime;
            i++;
        }

        return avg;
    }

    checkLogin = () => {
        if (sessionStorage.getItem("token") === null) {
            window.location.replace("/login");
        } else {
            axios.post(`http://${this.getIp()}:${this.getPort()}/checkLogin`, {pass: sessionStorage.getItem("token")})
                .then(res => {
                    if(res.data !== true) {
                        sessionStorage.removeItem("token");
                        this.checkLogin();
                    }
                })
        }
    }
}

export default new Base();
