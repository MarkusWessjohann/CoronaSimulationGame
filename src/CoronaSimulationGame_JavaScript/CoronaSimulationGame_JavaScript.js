 let gesund = 1;
 let infiziert = 2;
 let geheilt = 3;
 let tod = 4;

 let Level = 10;
 let LevelEnde = "false";
 let volk;
 let statistik;


function setup() {
  var canvas = createCanvas(1024, 720);
  
  volk = new Volk();
  volk.initVolk(Level);
  
  statistik = new Statistikdaten();
}

function keyPressed() {
  print("Levelende :" + LevelEnde);
    if (keyCode == UP_ARROW) {
      print("Userup " );
      volk.userUp();
      print("Userup " );
    } else if (keyCode == DOWN_ARROW) {
      volk.userDown();
    } else if (keyCode == LEFT_ARROW) {
      volk.userLeft();
    } else if (keyCode == RIGHT_ARROW) {
      volk.userRight();
    } else if (keyCode == CONTROL) {
      if (LevelEnde == "true" && !volk.lebtUser()) {
        Level = 10;
        volk.initVolk(Level);
        loop();
      }
   }
}

function keyTyped() {
  print("Levelende :" + LevelEnde);
  if (key === ' ') {
     if (LevelEnde == "true" ) {
       if (volk.lebtUser()) {
          Level = Level + 2;
          volk.initVolk(Level);
          loop();
        }
     }
   }
}


function draw() {
  background(255,255,0);
  print("Start draw");
  volk.draw();
  
  if (volk.istEnde()) {
    LevelEnde = "true";
    
    statistik.addLeveldata(volk);
    textSize(26);
    fill(0);
    text("Level Gesamt   : " + volk.AnzahlPersonen, 10,50);
    text("Level Gesund   : " + volk.AnzahlGesund, 10,100);
    text("Level Infiziert: " + volk.AnzahlInfiziert, 10,150);
    text("Level Geheilt  : " + volk.AnzahlGeheilt, 10,200);
    text("Level Tod      : " + volk.AnzahlTod, 10,250);
    if (! volk.lebtUser()) {
      
      text("Spiel Gesamt   : " + statistik.AnzahlPersonenGesamt, 10,300);
      text("Spiel Gesund   : " + statistik.AnzahlGesundGesamt, 10,350);
      text("Spiel Infiziert: " + statistik.AnzahlInfiziertGesamt, 10,400);
      text("Spiel Geheilt  : " + statistik.AnzahlGeheiltGesamt, 10,450);
      text("Spiel Tod      : " + statistik.AnzahlTodGesamt, 10,500);
      fill(255,0,0);
      text("Durch User infiziert: " + statistik.AnzahlUserInfiziertGesamt, 300,400);
      text("Durch User gestorben: " + statistik.AnzahlUserTodGesamt, 300,500);
      textSize(52);  
      text("#wirbleibenzuhause", 120, 600);
  }
    print("Ende keine Verarbeitung");
    noLoop();
  }
}


function Statistikdaten() {
    
  this.AnzahlPersonenGesamt = 0;
  this.AnzahlGesundGesamt = 0;
  this.AnzahlInfiziertGesamt = 0;
  this.AnzahlGeheiltGesamt = 0;
  this.AnzahlTodGesamt = 0;
  this.AnzahlUserTodGesamt = 0;
  this.AnzahlUserInfiziertGesamt = 0;
    
  this.addLeveldata = function(volk) {
    
    this.AnzahlPersonenGesamt += volk.AnzahlPersonen;
    this.AnzahlGesundGesamt += volk.AnzahlGesund;
    this.AnzahlInfiziertGesamt += volk.AnzahlInfiziert;
    this.AnzahlGeheiltGesamt += volk.AnzahlGeheilt;
    this.AnzahlTodGesamt += volk.AnzahlTod;
    this.AnzahlUserTodGesamt += volk.AnzahlUserTod;
    this.AnzahlUserInfiziertGesamt += volk.AnzahlUserInfiziert;
  };
}

function Volk() {

  this.AnzahlPersonen = 10;

  this.AnzahlGesund=0;
  this.AnzahlTod=0;
  this.AnzahlUserTod=0;
  this.AnzahlGeheilt=0;
  this.AnzahlInfiziert=0;
  this.AnzahlUserInfiziert=0;
 
  this.Personen = [];
  
  this.initVolk = function(maxPersonen) {
    LevelEnde = "false";
    this.AnzahlPersonen = maxPersonen;
    
    this.Personen[0] = new Person((1024/2), (720/2), 10, gesund, "true", this.AnzahlPersonen);
   
    for (let i=1;i<this.AnzahlPersonen;i++) {
  
      this.Personen[i] = new Person(random(1000)+10, random(700)+10, 10, gesund, "false", this.AnzahlPersonen);
    }
    
    this.checkCollisionVolk();
       
    this.Personen[1].setInfiziert("false");  
  };

  this.userUp = function() {
    this.Personen[0].updateVelocity(0, -1);
  };
  
  this.userDown = function() {
    this.Personen[0].updateVelocity(0, 1);
  };
  
   this.userLeft = function() {
    this.Personen[0].updateVelocity(-1, 0);
  };
  
  this.userRight = function() {
    this.Personen[0].updateVelocity(1, 0);
  };
  
  this.lebtUser = function() {
    if (this.Personen[0].status == tod) {
      return false;
    }
    return true;
  };
  
  this.draw = function() {
  for (let i=0;i<this.AnzahlPersonen;i++) {
  
      this.Personen[i].update();
      this.Personen[i].display();
      this.Personen[i].checkBoundaryCollision();
    }
    
    this.checkCollisionVolk();
    
  };
  
  this.checkCollisionVolk = function() {
    for (let i=0;i<this.AnzahlPersonen;i++) {
      for (let j=i;j<this.AnzahlPersonen;j++) {      
        this.Personen[i].checkCollision(this.Personen[j]);
      }
    }
 
  };

  this.istEnde = function() {
    let ende = true;
    this.AnzahlGesund=0;
    this.AnzahlTod=0;
    this.AnzahlUserTod=0;
    this.AnzahlGeheilt=0;
    this.AnzahlInfiziert=0;
    this.AnzahlUserInfiziert=0;
    for (let i=0;i<this.AnzahlPersonen;i++) {
      if (this.Personen[i].status == gesund) {
          this.AnzahlGesund++;
      }
      if (this.Personen[i].status == tod) {
          this.AnzahlTod++;
          if (this.Personen[i].user == "true") {
            this.AnzahlUserInfiziert++;
            this.AnzahlUserTod++;
          }
      }
      if (this.Personen[i].status == geheilt) {
        this.AnzahlGeheilt++;
         if (this.Personen[i].user == "true") {
            this.AnzahlUserInfiziert++;
          }
      }
      if (this.Personen[i].status == infiziert) {
        ende = false;
        this.AnzahlInfiziert++;
      }
    }
    return ende;
  };
}


function Person( x, y, r_, s_, u_, l_) {
  
    this.position = new p5.Vector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(3);
    this.radius = r_;
    this.m = this.radius*0.1;
    this.status = s_;
    this.user = u_;
    this.level = l_;
    
    this.neuerStatus=0;
    
    this.infektedByUser = "false";
       
  
  this.update = function() {
    this.position.add(this.velocity);
  };

  this.checkBoundaryCollision = function() {
    if (this.position.x > width-this.radius) {
      this.position.x = width-this.radius;
      this.velocity.x *= -1;
    } 
    else if (this.position.x <this.radius) {
      this.position.x =this.radius;
      this.velocity.x *= -1;
    } 
    else if (this.position.y > height-this.radius) {
      this.position.y = height-this.radius;
      this.velocity.y *= -1;
    } 
    else if (this.position.y <this.radius) {
      this.position.y =this.radius;
      this.velocity.y *= -1;
    }
  };
  
  this.setInfiziert = function(byUser) {
    if (this.status == gesund) {
      this.status = infiziert;
      this.infektedByUser = byUser;
      this.neuerStatus = minute()*100+second() + 10;
      this.display();
    }
  };

 this.setTod = function() {
   this.status = tod;
   this.velocity.mult(0);
 };

  this.updateStatus = function() {
    if (this.status == infiziert) {
        let statusZeit = minute()*100+second();
        if (statusZeit >= this.neuerStatus) {
          let schwellWert = 10;
            schwellWert = schwellWert - this.level / 8;
          if (random(10) < schwellWert) {
            this.status = geheilt;
          } else {
            this.setTod();
          }
        }
    }
    this.display();
  };
  
  this.checkCollision = function(other) {

    // Get distances between the Personen components
    let distanceVect = p5.Vector.sub(other.position, this.position);

    // Calculate magnitude of the vector separating the Personen
    let distanceVectMag = distanceVect.mag();

    // Minimum distance before they are touching
    let minDistance = this.radius + other.radius;
  
    this.updateStatus();
    
    if (distanceVectMag < minDistance) {
      let distanceCorrection = (minDistance-distanceVectMag)/2.0;
      let d = distanceVect.copy();
      let correctionVector = d.normalize().mult(distanceCorrection);
      other.addPosition(correctionVector);
      
      this.subPosition(correctionVector);

      // get angle of distanceVect
      let theta  = distanceVect.heading();
      // precalculate trig values
      let sine = sin(theta);
      let cosine = cos(theta);

      /* bTemp will hold rotated Person positions. You 
       just need to worry about bTemp[1] position*/
      let bTemp = [];
      bTemp[0] = new p5.Vector();
      bTemp[1] = new p5.Vector();

      /* this Person's position is relative to the other
       so you can use the vector between them (bVect) as the 
       reference polet in the rotation expressions.
       bTemp[0].position.x and bTemp[0].position.y will initialize
       automatically to 0.0, which is what you want
       since b[1] will rotate around b[0] */
      bTemp[1].x  = cosine * distanceVect.x + sine * distanceVect.y;
      bTemp[1].y  = cosine * distanceVect.y - sine * distanceVect.x;

      // rotate Temporary velocities
       let vTemp = [];
      vTemp[0] = new p5.Vector();
      vTemp[1] = new p5.Vector();
   
      vTemp[0].x  = cosine * this.velocity.x + sine * this.velocity.y;
      vTemp[0].y  = cosine * this.velocity.y - sine * this.velocity.x;
      vTemp[1].x  = cosine * other.velocity.x + sine * other.velocity.y;
      vTemp[1].y  = cosine * other.velocity.y - sine * other.velocity.x;

      /* Now that velocities are rotated, you can use 1D
       conservation of momentum equations to calculate 
       the final velocity along the x-axis. */
       let vFinal = [];
      vFinal[0] = new p5.Vector();
      vFinal[1] = new p5.Vector();
   

      // final rotated velocity for b[0]
      vFinal[0].x = ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) / (this.m + other.m);
      vFinal[0].y = vTemp[0].y;

      // final rotated velocity for b[0]
      vFinal[1].x = ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) / (this.m + other.m);
      vFinal[1].y = vTemp[1].y;

      // hack to avoid clumping
      bTemp[0].x += vFinal[0].x;
      bTemp[1].x += vFinal[1].x;

      /* Rotate Person positions and velocities back
       Reverse signs in trig expressions to rotate 
       in the opposite direction */
      // rotate Personen
       let bFinal = [];
      bFinal[0] = new p5.Vector();
      bFinal[1] = new p5.Vector();

      bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
      bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
      bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
      bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

      // update Personen to screen position
      other.position.x = this.position.x + bFinal[1].x;
      other.position.y = this.position.y + bFinal[1].y;

      this.position.add(bFinal[0]);

      // update velocities
      this.updateVelocity(cosine * vFinal[0].x - sine * vFinal[0].y, cosine * vFinal[0].y + sine * vFinal[0].x);
      other.updateVelocity(cosine * vFinal[1].x - sine * vFinal[1].y, cosine * vFinal[1].y + sine * vFinal[1].x);
    
      if (this.status == infiziert) {
        other.setInfiziert(this.user);
      }
      
      if (other.status == infiziert) {
        this.setInfiziert(other.user);
      }
    }
  };
  
  this.addPosition = function( correctionVector) {
        this.position.add(correctionVector);
    };
  
  this.subPosition = function( correctionVector) {
 
       this.position.sub(correctionVector);
        
    };
    
   this.updateVelocity = function(x, y) {
    if (this.status != tod) {
      this.velocity.x = x;
      this.velocity.y = y;
    }
  };
  
   this.display = function() {
    noStroke();
     let offset=0;
     
     if (this.user == "true") {
       
       offset = 100;
    }
    
     fill(0 + offset, 0 + offset, 255);
     if (this.status == geheilt) {
      fill(0 + offset, 255 - offset, 0);
    }
   
    if (this.status == tod) {
      fill(0 + offset, 0 + offset, 0);
    }
    if (this.status == infiziert) {
      fill(255 + offset, 0 + offset, 0);
    }
   
    ellipse(this.position.x, this.position.y, this.radius*2, this.radius*2);
  };
}
