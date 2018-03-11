'use strict';

function gameInit() {

    var rectangleSize = 20;
    var result = 0;
    var rects = [];
    var img_src = "assets/img/img2.jpg";
    var start = "#start";
    var stop = "#stop";
    var pause = "#pause";
    var canvas_selector = "canvas";
    var score = "#score";
    var intervalId = null;
    var isRun = false;
    var isPaused = false;
    var lose = 20;
    var loser = "#loser";


    function randomNumber(min, max) {
        return Math.round(min + Math.random() * (max - min));
    }

    function randomColor() {
        var r = randomNumber(0, 255),
            g = randomNumber(0, 255),
            b = randomNumber(0, 255);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    function counter() {
        result++;
        document.querySelector(score).innerText = result;
    }

    function makeRect() {

        return {
            xCoord: randomNumber(0, 620),
            yCoord: 0,
            color: randomColor(),
            speed: randomNumber(1, 6)

        }
    }

    var canvas = document.querySelector(canvas_selector);
    var ctx = canvas.getContext('2d');
    var pauseButton = document.querySelector(pause);
    var hider = document.querySelector(".hider");
    var loserTitile = document.querySelector(loser);

    // ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth); 
    //да будет отсебятина, если поснимать комменты, то всё будет по ТЗ
    function canvasBG() {
        var pic = new Image();
        pic.src = img_src;
        pic.addEventListener("load", function() {
            ctx.drawImage(pic, 0, 0, canvas.clientWidth, canvas.clientHeight);
        })
    }
    canvasBG();

    function paused() {
        pauseButton.innerText = "Continue";
        pauseButton.style.fontSize = "22px";
    }

    function continued() {
        pauseButton.innerText = "Pause";
        pauseButton.style.fontSize = "30px";
    }


    function hide() {
        hider.style.height = "calc(100% - 5px)";
    }

    function unhide() {
        hider.style.height = "0";
    }

    function loseCounter() {
        lose--;
        document.querySelector("#lose").innerText = lose;
    }

    document.querySelector(start).addEventListener("click", function() {
        // "touchstart"

        if (isPaused) {
            continued();
            unhide();
        }
        isPaused = false;

        if (!isRun) {
            animate();
            lose = 20;
            document.querySelector("#lose").innerText = lose;
            intervalId = setInterval(function() {
                if (randomNumber(1, 3) === 3 && !isPaused) {
                    rects.push(makeRect());
                }
            }, 150);
            loserTitile.style.visibility = "hidden";
        }
        isRun = true;

    });

    document.querySelector(stop).addEventListener("click", function() {
        if (isPaused) {
            unhide();
        }
        isPaused = false
        isRun = false;
        rects = [];
        result = 0;
        clearInterval(intervalId);
        document.querySelector(score).innerText = "0";
    });

    document.querySelector(pause).addEventListener("click", function() {
        isPaused = !isPaused;

        if (isPaused) {
            paused();
            hide();
        } else {
            continued();
            unhide();
        }
    });

    window.addEventListener("blur", function() {
        if (!isPaused) {
            hide();
        }
        isPaused = true;
        paused();
    });

    canvas.addEventListener('mousedown', function(e) {
        var coordinates = {
            x: e.offsetX,
            y: e.offsetY
        }

        rects.forEach(function(item, index, rects) {
            if (!isPaused && item.xCoord <= coordinates.x && item.xCoord + rectangleSize >= coordinates.x && item.yCoord <= coordinates.y && item.yCoord + rectangleSize >= coordinates.y) {
                rects.splice(index, 1);
                counter();
            }
        });
    });

    function animate() {
        canvasBG();

        rects.forEach(function(item, index, rects) {
            ctx.fillStyle = item.color;
            ctx.strokeStyle = item.color;
            ctx.fillRect(item.xCoord, item.yCoord, rectangleSize, rectangleSize);
            if (item.yCoord >= canvas.clientHeight) {
                rects.splice(index, 1);
                loseCounter();
            } else {
                if (!isPaused) {
                    item.yCoord += (item.speed / 2);
                }
            }
        })
        if (lose == 0) {
            isRun = false;
            rects = [];
            clearInterval(intervalId);
            loserTitile.style.visibility = "visible";
        }
        requestAnimationFrame(animate);
    }
}

document.addEventListener("DOMContentLoaded", gameInit);