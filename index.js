/* jshint browser: true, esnext: true, devel: true */

var Globe_Spark;
var Globe_Normal;

var Amount_Spark = 0;
var Amount_Normal = 1;

var Stack_Spark = 0;
var Stack_Normal = 0;
var Stack_Max = 100;
var Stack_Height = document.querySelector("#spark > footer").offsetHeight;

function Init_Globe_Spark() {

    var planetaryjs = window.planetaryjs;

    var canvas = document.getElementById('globe_spark');
    var r = parseInt(canvas.getAttribute("height")) / 2;

    Globe_Spark = planetaryjs.planet();

    Globe_Spark.loadPlugin(planetaryjs.plugins.earth({
        topojson: {
            file: 'bower_components/planetary.js/dist/world-110m.json'
        },
        oceans: {
            fill: '#36F'
        },
        land: {
            fill: '#FFF'
        },
        borders: {
            stroke: '#36F'
        }
    }));

    Globe_Spark.loadPlugin(Middleware_Autorotate(30));
    Globe_Spark.loadPlugin(planetaryjs.plugins.pings());
    Globe_Spark.loadPlugin(planetaryjs.plugins.drag({
        onDragStart: function () {
            this.plugins.autorotate.pause();
        },
        onDragEnd: function () {
            this.plugins.autorotate.resume();
        }
    }));

    Globe_Spark.projection.scale(r).translate([r, r]);

    Globe_Spark.draw(canvas);

}

function Init_Globe_Normal() {

    var planetaryjs = window.planetaryjs;

    var canvas = document.getElementById('globe_normal');
    var r = parseInt(canvas.getAttribute("height")) / 2;

    Globe_Normal = planetaryjs.planet();

    Globe_Normal.loadPlugin(planetaryjs.plugins.earth({
        topojson: {
            file: 'bower_components/planetary.js/dist/world-110m.json'
        },
        oceans: {
            fill: '#222'
        },
        land: {
            fill: '#666'
        },
        borders: {
            stroke: '#222'
        }
    }));

    Globe_Normal.loadPlugin(Middleware_Autorotate(10));
    Globe_Normal.loadPlugin(planetaryjs.plugins.pings());
    Globe_Normal.loadPlugin(planetaryjs.plugins.drag({
        onDragStart: function () {
            this.plugins.autorotate.pause();
        },
        onDragEnd: function () {
            this.plugins.autorotate.resume();
        }
    }));

    Globe_Normal.projection.scale(r).translate([r, r]);

    Globe_Normal.draw(canvas);

}

function Middleware_Autorotate(degPerSec) {
    return function (planet) {
        var lastTick = null;
        var paused = false;
        planet.plugins.autorotate = {
            pause: function () {
                paused = true;
            },
            resume: function () {
                paused = false;
            }
        };
        planet.onDraw(function () {
            if (paused || !lastTick) {
                lastTick = new Date();
            } else {
                var now = new Date();
                var delta = now.getTime() - lastTick.getTime();
                var rotation = planet.projection.rotate();
                rotation[0] += degPerSec * delta / 1000;
                if (rotation[0] >= 180) rotation[0] -= 360;
                planet.projection.rotate(rotation);
                lastTick = now;
            }
        });
    };
}

function Dummy_Data_Pump() {

    // Pump Spark data
    setInterval(function () {
        var range = Math.random() * 10 + 5;
        for (var i = 0; i < range; i++) {
            var data = {
                longitute: Math.random() * 170 - 85,
                latitude: Math.random() * 360 - 180
            };
            var color = 'red';
            Globe_Spark.plugins.pings.add(data.longitute, data.latitude, {
                color: color,
                ttl: 500,
                angle: 10
            });
            Amount_Spark++;
            Stack_Spark++;
        }
    }, 100);

    // Pump Normal data
    setInterval(function () {
        var data = {
            longitute: Math.random() * 170 - 85,
            latitude: Math.random() * 360 - 180
        };
        var color = 'red';
        Globe_Normal.plugins.pings.add(data.longitute, data.latitude, {
            color: color,
            ttl: 5000,
            angle: 10
        });
        Amount_Normal++;
        Stack_Normal++;
    }, 200);

    // Render Amount
    setInterval(function () {
        document.querySelector("#spark > .amount").innerHTML = Amount_Spark;
        document.querySelector("#normal > .amount").innerHTML = Amount_Normal;
        document.querySelector("body > footer > div").innerHTML = (Amount_Spark / Amount_Normal).toFixed(0);
    }, 10);

    // Render Stack
    setInterval(function () {
        var TD_Spark = document.createElement("td");
        var DIV_Spark = document.createElement("div");
        TD_Spark.appendChild(DIV_Spark);
        document.querySelector("#spark > footer > table > tbody > tr").appendChild(TD_Spark);
        DIV_Spark.offsetWidth = DIV_Spark.offsetWidth;
        DIV_Spark.style.height = Stack_Spark / Stack_Max * Stack_Height + "px";
        Stack_Spark = 0;

        var TD_Normal = document.createElement("td");
        var DIV_Normal = document.createElement("div");
        TD_Normal.appendChild(DIV_Normal);
        document.querySelector("#normal > footer > table > tbody > tr").insertBefore(TD_Normal, document.querySelector("#normal > footer > table > tbody > tr").firstChild);
        DIV_Normal.offsetWidth = DIV_Normal.offsetWidth;
        DIV_Normal.style.height = Stack_Normal / Stack_Max * Stack_Height + "px";
        Stack_Normal = 0;
    }, 500);

}

Init_Globe_Spark();
Init_Globe_Normal();
Dummy_Data_Pump();