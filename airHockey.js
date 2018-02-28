var p1, disk;
 
function setup() {
  createCanvas(640, 480);
  p1 = new Player();
  disk = new Disk();
}
 
function draw() {
  /*if(mousePressed()) {
    noLoop();
  }*/
  background(0);
  p1.update();
  disk.move();
  disk.collision();
  fill(0, 255, 0);
  p1.show();
 
  fill(255);
  disk.show();
}
 
 
function Disk() {
  this.x = width/2;
  this.y = height/2;
  this.speed = 5;
  this.angle = 0.5;
  this.radius = 25;
  this.decSpd = 0.001;
 
  this.move = function() {
    text("Sin:"+sin(this.angle), 10,10);
    text("Cos:"+cos(this.angle), 10,30);
    text("velY:"+sin(this.angle)*this.speed, 10,50);
    text("velX:"+cos(this.angle)*this.speed, 10,70);
    text("spd:"+this.speed, 10,90);
    if(this.speed > 0) {
      this.speed -= this.decSpd;
    }
    if(this.speed <=0) {
      this.speed = 0;
    }
    if(this.x + this.speed * cos(this.angle) < this.radius/2 || this.x + this.speed * cos(this.angle) > width-this.radius/2) {
      if(sin(this.angle) > 0 && cos(this.angle) > 0) {//1o quadrante
        this.angle += PI/2;
      }
      else if(sin(this.angle) > 0 && cos(this.angle) < 0) {//2o quadrante
        this.angle -= PI/2;
      }
      else if(sin(this.angle) < 0 && cos(this.angle) < 0) {//3o quadrante
        this.angle += PI/2;
      }
      else if(sin(this.angle) < 0 && cos(this.angle) > 0) {//4o quadrante
        this.angle -= PI/2;
      }
    }
    if(this.y + this.speed * sin(this.angle) < this.radius/2 || this.y + this.speed * sin(this.angle) > height-this.radius/2) {
      if(sin(this.angle) > 0 && cos(this.angle) > 0) {//1o quadrante
        this.angle -= PI/2;
      }
      else if(sin(this.angle) > 0 && cos(this.angle) < 0) {//2o quadrante
        this.angle += PI/2;
      }
      else if(sin(this.angle) < 0 && cos(this.angle) < 0) {//3o quadrante
        this.angle -= PI/2;
      }
      else if(sin(this.angle) < 0 && cos(this.angle) > 0) {//4o quadrante
        this.angle += PI/2;
      }
    }
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
 
  this.show = function() {
    ellipse(this.x, this.y, this.radius, this.radius);
  }
 
  this.collision = function() {
    p = p1;
    if(sqrt(((this.x-p.x)*(this.x-p.x)) + ((this.y-p.y)*(this.y-p.y))) < (this.radius + p.radius)/2) {
      this.angle += PI/2;
      this.speed = 5;
      background(255, 255, 0);
    }
  }
};
 
function Player() {
  this.x = width/2;
  this.y = height/2;
  this.radius = 50;
 
  this.update = function() {
    this.x = mouseX;
    this.y = mouseY;
  }
 
  this.show = function() {
    ellipse(this.x, this.y, this.radius, this.radius);
  }
};