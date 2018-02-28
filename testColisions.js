var wall, v1, v0, mode;
function setup() {
  createCanvas(800, 500);
  wall = new Vector(width/2, height/2, PI/2, 5000);
  v1 = new Vector(width/2, height/2, 5.2+PI/2, 5000);
  v0 = new Vector(width/2, height/2, PI, 500);
  v0.angle = reflect(v1, wall);
  mode = true;
}

function draw() {
  background(0);
  if(mode) {
    v1.angle = map(mouseX, 0, width, 0, 2*PI);
    
  }else {
    wall.angle = map(mouseX, 0, height, 0, 2*PI);
  }
  v0.angle = reflect(v1, wall);
  
  stroke(255);//parede branca
  drawVector(wall);
  stroke(0, 255, 0);//in verde
  drawVector(v1);
  stroke(0, 0, 255);//out azul
  drawVector(v0);
}

function drawVector(w) {
  line(w.x-cos(w.angle)*w.len, w.y-sin(w.angle)*w.len, w.x+cos(w.angle)*w.len, w.y+sin(w.angle)*w.len);
}

function reflect(v, w) {
  var aIn, aOut, diff;
  aIn = v.angle + PI;
  diff = aIn - w.angle;
  aOut = w.angle + PI -diff;
  print("aIn: "+v.angle);
  print("aOut: "+aOut);
  return aOut;
}

function Vector(px, py, ang, l){
    this.x = px;
    this.y = py;
    this.angle = ang;
    this.len = l;
};

function mousePressed() {
  if(mode) {
    mode = false;
  }else {
    mode = true;
  }
}