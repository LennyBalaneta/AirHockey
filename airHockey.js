var p1, pCpu, disk, pause, scoreP1, scoreCPU;

PlayerP1.prototype = new Player();
PlayerCPU.prototype = new Player();
 
function setup() {
  createCanvas(800, 500);
  p1 = new PlayerP1();
  pCpu = new PlayerCPU();
  disk = new Disk();
  pause = false;
  scoreP1 = 0;
  scoreCPU = 0;
}
 
function draw() {
  drawBoard();
  disk.move();
  p1.update();
  pCpu.update();
  
  
  fill(52, 247, 47);
  p1.show();
 
  fill(255, 44, 38);
  pCpu.show();
  
  fill(255, 127, 39);
  disk.show();
  //debugPrints();
}
 
function Disk() {
  this.x = width/2;
  this.y = height/2;
  this.angle = random(0, 2*PI);
  this.speed = random(3, 7);
  this.radius = 25;
  this.decSpd = 0.001;
  this.bounce = 0.9;
 
  this.move = function() {
    if(this.speed > 0) {
      this.speed -= this.speed*this.decSpd;
    }
    if(this.speed <= 0.05) {
      this.speed = 0;
    }
 
    if(this.x + this.speed * cos(this.angle) < this.radius/2 || this.x + this.speed * cos(this.angle) > width-this.radius/2) {
      if(this.y >= height/3 && this.y <= height*2/3) {
        if(this.x > width/2) {
          scoreP1++;
        }else {
          scoreCPU++;
        }
        resetPositions();
      }
      this.angle = this.reflect(PI/2);
    }
    if(this.y + this.speed * sin(this.angle) < this.radius/2 || this.y + this.speed * sin(this.angle) > height-this.radius/2) {
      this.angle = this.reflect(PI);
    }
    if(collisionP1Disk() || collisionPCpuDisk()) {
      this.collision();
    }
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
 
  this.show = function() {
    stroke(0);
    ellipse(this.x, this.y, this.radius, this.radius);
    //this.showDirection();
  }
 
  this.showDirection = function() {
    stroke(255, 0, 0);
    line(this.x, this.y, this.x+cos(this.angle)*100, this.y+sin(this.angle)*100);
  }
 
  this.reflect = function(wAng){
    var aIn, aOut, diff;
    aIn = this.angle + PI;
    diff = aIn - wAng;
    aOut = wAng + PI - diff;
    return aOut;
  }
 
  this.collision = function() {
    p = p1;
    //colisão com Player1
    if(collisionP1Disk()) {
      this.angle = this.reflect(atan2(p.y - this.y, p.x - this.x) +PI/2);
      this.speed = this.collisionForce() * this.bounce;
    }
    while(collisionP1Disk()) {
      this.x += this.speed * cos(this.angle);
      this.y += this.speed * sin(this.angle);
    }
    p = pCpu;
    //colisão com PlayerCPU
    if(collisionPCpuDisk()) {
      this.angle = this.reflect(atan2(p.y - this.y, p.x - this.x) +PI/2);
      this.speed = this.collisionForce() * this.bounce;
    }
    while(collisionPCpuDisk()) {
      this.x += this.speed * cos(this.angle);
      this.y += this.speed * sin(this.angle);
    }
  }
 
  this.collisionForce = function() {
    var vxP1, vyP1, vxD, vyD;
    vxP1 = cos(p1.getAngle()) * p1.getSpeed();
    vyP1 = sin(p1.getAngle()) * p1.getSpeed();
    vxD = cos(this.angle) * this.speed;
    vyD = sin(this.angle) * this.speed;
    return sqrt((vxP1 - vxD)*(vxP1 - vxD) + (vyP1 - vyD)*(vyP1 - vyD));
  }
};
 
function Player() {
  this.x = 0;
  this.y = 0;
  this.old_x = this.x;
  this.old_y = this.y;
  this.radius = 50;
 
  this.show = function() {
    ellipse(this.x, this.y, this.radius, this.radius);
    //this.showDirection();
  }
 
  this.showDirection = function() {
    stroke(255, 0, 0);
    line(this.x, this.y, this.x+cos(this.getAngle())*100, this.y+sin(this.getAngle())*100);
  }
 
 
  this.getAngle = function() {
    return atan2(this.y - this.old_y, this.x - this.old_x);
 
  }
 
  this.getSpeed = function() {
    return sqrt(((this.x-this.old_x)*(this.x-this.old_x)) + ((this.y-this.old_y)*(this.y-this.old_y)));
  }
};

function PlayerP1() {
  this.x = width*4/5;
  this.y = height/2;
  this.update = function() {
    var pFinx, pIniy;
    pFinx = mouseX;
    pFiny = mouseY;
    
    //limites
    if(pFinx - this.radius/2 < 0) {
      pFinx = this.radius/2;
    }
    if(pFiny - this.radius/2 < 0) {
      pFiny = this.radius/2;
    }
    if(pFinx + this.radius/2 > width/2) {
      pFinx = width/2 - this.radius/2;
    }
    if(pFiny + this.radius/2 > height) {
      pFiny = height - this.radius/2;
    }
    
    var iniSpd = this.getSpeed2();
    var dist = sqrt(((this.x-pFinx)*(this.x-pFinx)) + ((this.y-pFiny)*(this.y-pFiny)));
    var angl = atan2(this.x-pFinx, this.y-pFiny);
    if(dist > 2) {
      var dx, dy, qtd;
      dx = pFinx - this.x;
      dy = pFiny - this.y;
      qtd = dist/2;
      for(var i=0 ; i<qtd ; i++) {
        this.old_x = this.x;
        this.old_y = this.y;
        this.x += dx/qtd;
        this.y += dy/qtd;
        while(collisionP1Disk()) {
          disk.angle = atan2(disk.y-this.y, disk.x-this.x);
          disk.speed = (iniSpd/2)*disk.bounce;
          disk.x = this.x+cos(disk.angle)*((disk.radius + this.radius)/2+1);
          disk.y = this.y+sin(disk.angle)*((disk.radius + this.radius)/2+1);
        }
      }
    }else {
      this.old_x = this.x;
      this.old_y = this.y;
      this.x = pFinx;
      this.y = pFiny;
    }
  }
  
  this.getSpeed2 = function() {
    return sqrt(((mouseX-this.x)*(mouseX-this.x)) + ((mouseY-this.y)*(mouseY-this.y)));
  }
};

function PlayerCPU() {
  this.x = width*4/5;
  this.y = height/2;
  this.speed = 3;
  
  this.update = function() {
    var pFinx, pIniy;
    
    pFinx = this.x;
    //pFinx = this.x + cos(atan2(disk.y-this.y, disk.x-this.x)) * this.speed;
    pFiny = this.y + sin(atan2(disk.y-this.y, disk.x-this.x)) * this.speed;
    //limites
    if(pFinx - this.radius/2 < width/2) {
      pFinx = width/2 + this.radius/2;
    }
    if(pFiny - this.radius/2 < 0) {
      pFiny = this.radius/2;
    }
    if(pFinx + this.radius/2 > width) {
      pFinx = width - this.radius/2;
    }
    if(pFiny + this.radius/2 > height) {
      pFiny = height - this.radius/2;
    }
    
    var iniSpd = this.getSpeed2();
    var dist = sqrt(((this.x-pFinx)*(this.x-pFinx)) + ((this.y-pFiny)*(this.y-pFiny)));
    var angl = atan2(this.x-pFinx, this.y-pFiny);
    if(dist > 2) {
      var dx, dy, qtd;
      dx = pFinx - this.x;
      dy = pFiny - this.y;
      qtd = dist/2;
      for(var i=0 ; i<qtd ; i++) {
        this.old_x = this.x;
        this.old_y = this.y;
        this.x += dx/qtd;
        this.y += dy/qtd;
        while(collisionPCpuDisk()) {
          disk.angle = atan2(disk.y-this.y, disk.x-this.x);
          disk.speed = (iniSpd/2)*disk.bounce;
          disk.x = this.x+cos(disk.angle)*((disk.radius + this.radius)/2+1);
          disk.y = this.y+sin(disk.angle)*((disk.radius + this.radius)/2+1);
        }
      }
    }else {
      this.old_x = this.x;
      this.old_y = this.y;
      this.x = pFinx;
      this.y = pFiny;
    }
  }
  
  this.getSpeed2 = function() {
    return sqrt(((this.old_x-this.x)*(this.old_x-this.x)) + ((this.old_y-this.y)*(this.old_y-this.y)));
  }
};
 
function collisionP1Disk() {
  if(sqrt(((disk.x-p1.x)*(disk.x-p1.x)) + ((disk.y-p1.y)*(disk.y-p1.y))) < (disk.radius + p1.radius)/2) {
    return true;
  }else {
    return false;
  }
}

function collisionPCpuDisk() {
  if(sqrt(((disk.x-pCpu.x)*(disk.x-pCpu.x)) + ((disk.y-pCpu.y)*(disk.y-pCpu.y))) < (disk.radius + pCpu.radius)/2) {
    return true;
  }else {
    return false;
  }
}
 
function drawBoard() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(10);
  rect(0, 0, width, height);
  fill(0);
  rect(0, height*1/3, 10, height*1/3);
  rect(width-10, height*1/3, 10, height*1/3);
  noFill();
  stroke(0, 0, 255);
  strokeWeight(3);
  ellipse(width/2, height/2, 75, 75);
  ellipse(width*1/5, height*2/7, 50, 50);
  ellipse(width*4/5, height*2/7, 50, 50);
  ellipse(width*1/5, height*5/7, 50, 50);
  ellipse(width*4/5, height*5/7, 50, 50);
  line(width/2, 0, width/2, height/2-37.5);
  line(width/2, height/2+37.5, width/2, height);
 
  //placar
  textSize(30);
  stroke(0);
  fill(0);
  textAlign(CENTER);
  text(scoreP1 + " x " + scoreCPU, width/2+1, 50);
  textAlign(LEFT);
  strokeWeight(1);
}
 
function resetPositions() {
  disk.x = width/2;
  disk.y = height/2;
  disk.angle = random(0, 2*PI);
  disk.speed = random(3, 7);
  p1.x = mouseX;
  p1.y = mouseY;
  pCpu.x = width*4/5;
  pCpu.y = height/2;
}
 
function debugPrints() {
  textSize(12);
  stroke(0);
  fill(0);
  text("Sin:"+sin(disk.angle), 10, 15);
  text("Cos:"+cos(disk.angle), 10, 35);
  text("velY:"+sin(disk.angle)*disk.speed, 10, 55);
  text("velX:"+cos(disk.angle)*disk.speed, 10, 75);
  text("spd:"+disk.speed, 10, 95);
  text("angle:"+disk.angle, 10, 115);
  text("playerAngle:"+p1.getAngle(), 10, 135);
  text("playerSpeed:"+p1.getSpeed(), 10, 155);
  fill(255);
}
 
function mousePressed() {
  if(pause) {
    pause = false;
    loop();
  }else {
    pause = true;
    noLoop();
  }
}