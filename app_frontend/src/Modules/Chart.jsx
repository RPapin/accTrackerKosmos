import cjs from 'chart.js';
import Base from './Base';

class Chart {
    lineChartAvg = (id, times) => {
        let arrTimes = [];
        let arrTimesFormatted = [];
        let avg = Base.calculateAvgArray(times);
        for (let time of times) {
            arrTimes.push(time.tim_totalTime);
            arrTimesFormatted.push(Base.getFullTime(time.tim_totalTime * 1000));
        }
        let ctx = document.getElementById(id).getContext('2d');
        new cjs(ctx, {
            type: 'line',
            data: {
                labels: arrTimesFormatted,
                datasets: [
                    {
                        data: avg,
                        backgroundColor: [
                            "rgba(199, 0, 0, 0)",
                        ],
                        borderColor: "rgba(255, 255, 255, 1)",
                        fillColor: "rgba(210,27,71,0)",
                        borderWidth: 1
                    },
                    {
                        data: arrTimes,
                        backgroundColor: [
                            "rgba(139, 0, 0, .6)",
                        ],
                        borderColor: "rgba(139, 0, 0, 1)",
                        fillColor: "rgba(210,27,71,0)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            color: 'transparent'
                        },
                        ticks: {
                            beginAtZero: false,
                            display: false
                        },

                    }],
                    xAxes: [{
                        gridLines: {
                            color: 'rgba(139, 0, 0, .3)'
                        },

                    }],
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy'
                        },
                        zoom: {
                            enabled: true,
                            mode: 'xy',
                        }
                    }
                }
            }
        })
    }

    lineChart = (id, times) => {
        let arrTimes = [];
        let arrTimesFormatted = [];
        for (let time of times) {
            arrTimes.push(time.tim_totalTime);
            arrTimesFormatted.push(Base.getFullTime(time.tim_totalTime * 1000));
        }
        let ctx = document.getElementById(id).getContext('2d');
        new cjs(ctx, {
            type: 'line',
            data: {
                labels: arrTimesFormatted,
                datasets: [
                    {
                        data: arrTimes,
                        backgroundColor: [
                            "rgba(139, 0, 0, .6)",
                        ],
                        borderColor: "rgba(139, 0, 0, 1)",
                        fillColor: "rgba(210,27,71,0)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            color: 'transparent'
                        },
                        ticks: {
                            beginAtZero: false,
                            display: false
                        },

                    }],
                    xAxes: [{
                        gridLines: {
                            color: 'rgba(139, 0, 0, .3)'
                        },

                    }],
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy'
                        },
                        zoom: {
                            enabled: true,
                            mode: 'xy',
                        }
                    }
                },
            }
        })
    }

    doughnutChart = (id, cars) => {

        let arrCount = [];
        let arrCars = [];
        let arrColors = [];

        for (let car of cars) {
            arrCount.push(car.car_count);
            arrCars.push(car.car_name);
            arrColors.push(car.car_color);
        }

        let ctx = document.getElementById(id).getContext('2d');
        new cjs(ctx, {
            type: 'doughnut',
            data: {
                labels: arrCars,
                datasets: [
                    {
                        data: arrCount,
                        backgroundColor: arrColors,
                        borderColor: "#15151e",
                        fillColor: "rgba(210,27,71,0)",
                        borderWidth: 2
                    },
                ]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
            }
        })
    }
}


export default new Chart();