const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

let mouse = {
    x: null,
    y: null,
    radius: 100
}
window.addEventListener('mousemove', function(event){
    mouse.x = event.x + canvas.clientLeft/2;
    mouse.y = event.y + canvas.clientTop/2;
});

function drawImage(){
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0,0,imageWidth,imageHeight);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    class Particle{
        constructor(x,y,color,size){
            this.x = x+canvas.width/2 - png.width*2,
            this.y = y+canvas.height/2 - png.height*2,
            this.color = color,
            this.size = 2,
            this.baseX = x+canvas.width/2 - png.width*2,
            this.baseY = y+canvas.height/2 - png.height*2,
            this.density = (Math.random() * 10) * 2;
        }
        draw(){
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
            ctx.closePath();
            ctx.fill();
        }
        update(){
            ctx.fillStyle = this.color;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            const maxDistance = 100;
            let force = (maxDistance - distance)/maxDistance;

            if(force < 0 ) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if(distance < mouse.radius + this.size){
                this.x -= directionX;
                this.y -= directionY;
            } else{
                if(this.x !==this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                } if (this.y !==this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }
            this.draw()
        }
    }
    function init(){
        particleArray = [];

        for(let y = 0, y2 = data.height; y<y2;y++){
            for(let x = 0, x2 = data.width; x<x2;x++){
                if(data.data[(y*4*data.width)+(x*4)+3]>128){
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y*4*data.width)+(x*4)] + "," + 
                                        data.data[(y*4*data.width)+(x*4)+1] + "," +
                                        data.data[(y*4*data.width)+(x*4)+2] + ")";
                    particleArray.push(new Particle(positionX*4,positionY*4,color));
                    
                }
            }
        }
    }
    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,.05)';
        ctx.fillRect(0,0,innerWidth,innerHeight);

        for(let i = 0; i<particleArray.length;i++){
            particleArray[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize',function(){
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });

}

const png = new Image();

png.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAA/CAYAAAC/36X0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUIyOUEzQUQyMDhBMTFFQTg0RTg4Njg4NjVBQkQ5ODEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUIyOUEzQUMyMDhBMTFFQTg0RTg4Njg4NjVBQkQ5ODEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjAxOEVFNDUwQjhGMTFFQTgyQUFGOEUzODVDOEQxRDkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjAxOEVFNDYwQjhGMTFFQTgyQUFGOEUzODVDOEQxRDkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz40UvP5AAAEr0lEQVR42uSbZ2gUURDHnzFqNMQSK9aARqMfbB8sQaJiLx9EUbFhQaIoYkWNSrCLUcGuKCgWsBIUK6ioEGJPRINREJToF4mIXYLR8z/uO1iW3dzu7L673cvAjyN3ezMv/519M/v2XY1QKCR8ZL1AX7ArmkFr+EyEy2AQ6ATKohU0wUcCDACjQBJYVV0zoRh01/1Nl8X96pQJcwwCkG2sTpmQAopAB5PPxoPz1SETciwEINssRYprEdqD+VV8ng6WxLsI60D9CMcsAh3jVYQsMMXGcQ1VZ0MsJ0Yqf71tHhuS3eTjeMqEuQ4E+H+ywKZ4yoQmsiS2YXx3IjgbD5mwhClAuIGqFXQROsnukGtUMpcHWQSKlQtSXfpZCNoFVQQqiZM98NMUrA7ixFgTFMoy54VVgj7gSZAyYYaHApAlgvVBygTq+J6D1gp8jwEXg5AJqxQJQLYV1PG7CN3kbK6y5K7wuwhU02srjkG34m39KkI/j0piJGsmtIUZX06MVBL7Rqn6/BDaavVjP2XCbKYANNMfZXwvGWzgXnoqMqEReMaoCNQAdQafwAvQnBF7HMj3QybkMEsiDf61FOEQMzYvGygTPKQDKA85t18gXeenAXgT4tkyp+P2WoRTzIGvNfE1nenrE0iLlQiDwF/GoF+C+hY+bzOFOBYLERJBAXPA2VX4zWT6pJPRO9oiTGUOtgjUiuD7ONN3fjRFoFQuYw50tA3/aczJlmyknf/BixKZy1w4vSC0TRmR7C04wBxbnq2S6TILuoLvjDP0G2SY+KPreJjJ+/XAa2Y2LFZ9OZxhDmyHhb874ClIMPksmxnrA2iqSoSBLgbVwsRff90xsyxiPmDGPKhChLrgHnNA8y18PtKVt3egkckx/Zgxv4EeXosw00VJrGPib57umEr5mmcR+ygz9iUvRUhxURLHmfhrCd6aHFtpcfZoQv3JjD/UKxG2MAdwy8RXgmxqrKwEJHk4hoegptGf0/WEDLl6k+z0ZhX0BE8N71MNnyafKn003NpTjD/gpLy91lsL8Ih5y74A7HXTJ+Qzz8Buj+9WibnMsZQbS6aToEOYd4kfQSsFIrgpmQe4ItxhBlyqSIDwiXFdMlXfJZaCVIUiuOlaL4Y7UzsTI22xKwUtHU5Af4W2O+204f3BQtupGp749Oudv8F2udDq5CnUQxF5K6CZjQTX7Cidx1T6hsEP3Ridk+uJVdlYRjZsZI7xFWgeyXkX8JXh/D1oI1echoPrDhqcUQwRaLYvBhUyjl3IViZGSBfaA5DCuAyOgMbydbDN730Hh+WTK6dWDibJPuaXg96FflvxLdLMW8FcK3gC/jjs67MUT6CWWE2MNGndlFtiVNoroW3SPCFiaFaXwwTFAnwFO8F+8EHE2MwyIVVuiEpTEC8k1xZpXbJE+MTMMmGxIgGK5faaM8JnZsyEdPlEOcnDGJ+F9gsWesj6RfjQjJmw02MBDgrth54vhY9NL8II2UZ6YXfBNnBFBMASda9rPPBHD0r2yf4/MBYWgW50Ml34oV0mx2SHWSYCZjQxdsFrgdxmw7GrsuEpFAE1yoRhQtuAXeRg+07d/z23EHtkyasQAbZ/AgwAzcY6kiRMNkQAAAAASUVORK5CYII=";
window.addEventListener('load', (event) => {
    console.log('page has loaded');
    ctx.drawImage(png,0,0);
    drawImage();
});