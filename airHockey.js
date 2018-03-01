var p1, disk, pause;
 
function setup() {
  createCanvas(800, 500);
  p1 = new Player();
  disk = new Disk();
  pause = false;
}
 
function draw() {
  background(0);
  disk.move();
  p1.update();
  fill(0, 255, 0);
  p1.show();
 
  fill(255);
  disk.show();
  debugPrints();
}
 
function Disk() {
  this.x = width/2;
  this.y = height/2;
  this.speed = 5;
  this.angle = 0.5;
  this.radius = 25;
  this.decSpd = 0.001;
  this.bounce = 0.9;
 
  this.move = function() {
    if(this.speed > 0) {
      this.speed -= this.speed*this.decSpd;
    }
    if(this.speed <=0) {
      this.speed = 0;
    }
 
    if(this.x + this.speed * cos(this.angle) < this.radius/2 || this.x + this.speed * cos(this.angle) > width-this.radius/2) {
      this.angle = this.reflect(PI/2);
    }
    if(this.y + this.speed * sin(this.angle) < this.radius/2 || this.y + this.speed * sin(this.angle) > height-this.radius/2) {
      this.angle = this.reflect(PI);
    }
    if(collisionP1Disk()) {
      this.collision();
    }
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
 
  this.show = function() {
    ellipse(this.x, this.y, this.radius, this.radius);
    this.showDirection();
  }
 
  this.showDirection = function() {
    stroke(255, 255, 0);
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
    if(collisionP1Disk()) {
      this.angle = this.reflect(atan2(p.y - this.y, p.x - this.x) +PI/2);
      this.speed = this.collisionForce() * this.bounce;
    }
    while(collisionP1Disk()) {
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
 
  this.update = function() {
    var iniSpd = this.getSpeed2();
    var dist = sqrt(((this.x-mouseX)*(this.x-mouseX)) + ((this.y-mouseY)*(this.y-mouseY)));
    var angl = atan2(this.x-mouseX, this.y-mouseY);
    if(dist > 2) {
      var dx, dy, qtd;
      dx = mouseX - this.x;
      dy = mouseY - this.y;
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
      this.x = mouseX;
      this.y = mouseY;
    }      
  }
 
  this.show = function() {
    ellipse(this.x, this.y, this.radius, this.radius);
    this.showDirection();
  }
 
  this.showDirection = function() {
    stroke(255, 255, 0);
    line(this.x, this.y, this.x+cos(this.getAngle())*100, this.y+sin(this.getAngle())*100);
  }
 
 
  this.getAngle = function() {
    return atan2(this.y - this.old_y, this.x - this.old_x);
 
  }
 
  this.getSpeed = function() {
    return sqrt(((this.x-this.old_x)*(this.x-this.old_x)) + ((this.y-this.old_y)*(this.y-this.old_y)));
  }
  
  this.getSpeed2 = function() {
    return sqrt(((mouseX-this.x)*(mouseX-this.x)) + ((mouseY-this.y)*(mouseY-this.y)));
  }
};
 
function mousePressed() {
  if(pause) {
    pause = false;
    loop();
  }else {
    pause = true;
    noLoop();
  }
}
 
function collisionP1Disk() {
  if(sqrt(((disk.x-p1.x)*(disk.x-p1.x)) + ((disk.y-p1.y)*(disk.y-p1.y))) < (disk.radius + p1.radius)/2) {
    return true;
  }else {
    return false;
  }
}
 
function debugPrints() {
    text("Sin:"+sin(disk.angle), 10, 10);
    text("Cos:"+cos(disk.angle), 10, 30);
    text("velY:"+sin(disk.angle)*disk.speed, 10, 50);
    text("velX:"+cos(disk.angle)*disk.speed, 10, 70);
    text("spd:"+disk.speed, 10, 90);
    text("angle:"+disk.angle, 10, 110);
    text("playerAngle:"+p1.getAngle(), 10, 130);
    text("playerSpeed:"+p1.getSpeed(), 10, 150);
}