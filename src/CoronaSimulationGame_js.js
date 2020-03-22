 let gesund = 1;
 let infiziert = 2;
 let geheilt = 3;
 let tod = 4;

 let Level = 10;
 let LevelEnde = false;
 let volk;
 let statistik;


function setup() {
  createCanvas(1024, 720);
  volk = new Volk();
  statistik = new Statistikdaten();
  volk.initVolk(Level);
}

function keyPressed() {
  if (key == CODED) {
    if (keyCode == UP) {
      volk.userUp();
    } else if (keyCode == DOWN) {
      volk.userDown();
    } else if (keyCode == LEFT) {
      volk.userLeft();
    } else if (keyCode == RIGHT) {
      volk.userRight();
    } else if (keyCode == CONTROL) {
      if (LevelEnde && !volk.lebtUser()) {
        Level = 10;
        volk.initVolk(Level);
        loop();
      }
   }
 } else {
     if (LevelEnde) {
       if (volk.lebtUser()) {
          Level = Level + 2;
          volk.initVolk(Level);
          loop();
        }
      }
   }
}


function draw() {
  background(255,255,255);
  
  volk.draw();
  
  if (volk.istEnde()) {
    LevelEnde = true;
    
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
    noLoop();
  }

}


class Statistikdaten {
    
  constructor() {
    this.AnzahlPersonenGesamt = 0;
    this.AnzahlGesundGesamt = 0;
    this.AnzahlInfiziertGesamt = 0;
    this.AnzahlGeheiltGesamt = 0;
    this.AnzahlTodGesamt = 0;
    this.AnzahlUserTodGesamt = 0;
    this.AnzahlUserInfiziertGesamt = 0;
    }
    
    addLeveldata(Volk volk) {
      
      AnzahlPersonenGesamt += volk.AnzahlPersonen;
      AnzahlGesundGesamt += volk.AnzahlGesund;
      AnzahlInfiziertGesamt += volk.AnzahlInfiziert;
      AnzahlGeheiltGesamt += volk.AnzahlGeheilt;
      AnzahlTodGesamt += volk.AnzahlTod;
      AnzahlUserTodGesamt += volk.AnzahlUserTod;
      AnzahlUserInfiziertGesamt += volk.AnzahlUserInfiziert;
    }
}

class Volk {

  constructor() {
  this.AnzahlPersonen = 10;

  this.AnzahlGesund=0;
  this.AnzahlTod=0;
  this.AnzahlUserTod=0;
  this.AnzahlGeheilt=0;
  this.AnzahlInfiziert=0;
  this.AnzahlUserInfiziert=0;
 
  let Personen = [];
  
  }
 

  initVolk(maxPersonen) {
    AnzahlPersonen = maxPersonen;
    
    Personen[0] = new Person((1024/2), (720/2), 10, gesund, true, AnzahlPersonen);
   
    for (let i=1;i<AnzahlPersonen;i++) {
  
      Personen[i] = new Person(random(1000)+10, random(700)+10, 10, gesund, false, AnzahlPersonen);
    }
    
    checkCollision();
    
    Personen[1].setInfiziert(false);  
  }

  userUp() {
    Personen[0].updateVelocity(0,-2);
  }
  
  userDown() {
    Personen[0].updateVelocity(0, 2);
  }
  
   userLeft() {
    Personen[0].updateVelocity(-1.5, 0);
  }
  userRight() {
    Personen[0].updateVelocity(1.5, 0);
  }
  
  lebtUser() {
    if (Personen[0].status == tod) {
      return false;
    }
    return true;
  }
  
  draw() {
  for (let i=1;i<AnzahlPersonen;i++) {
  
      Personen[i].update();
      Personen[i].display();
      Personen[i].checkBoundaryCollision();
    }
    
    checkCollision();
    
  }
  
  checkCollision() {
    for (let i=0;i<AnzahlPersonen;i++) {
      for (let j=i;j<AnzahlPersonen;j++) {
        Personen[i].checkCollision(Personen[j]);
      }
    }
 
  }

  istEnde() {
    let ende = true;
    AnzahlGesund=0;
    AnzahlTod=0;
    AnzahlUserTod=0;
    AnzahlGeheilt=0;
    AnzahlInfiziert=0;
    AnzahlUserInfiziert=0;
    for (let i=0;i<AnzahlPersonen;i++) {
      if (Personen[i].status == gesund) {
          AnzahlGesund++;
      }
      if (Personen[i].status == tod) {
          AnzahlTod++;
          if (Personen[i].user) {
            AnzahlUserInfiziert++;
            AnzahlUserTod++;
          }
      }
      if (Personen[i].status == geheilt) {
        AnzahlGeheilt++;
         if (Personen[i].user) {
            AnzahlUserInfiziert++;
          }
      }
      if (Personen[i].status == infiziert) {
        ende = false;
        AnzahlInfiziert++;
      }
    }
    return ende;
  }
  

}


class Person {
  
  constructor() {
    let position;
    let velocity;
  
    let radius, m;
  
    let status;
    
    let level=0;
    
    let neuerStatus=0;
    
    let infektedByUser = false;
    let user = false;
  }
  
  Person( x, y, r_, s_, u_, l_) {
    this.position = new PVector(x, y);
    this.velocity = PVector.random2D();
    this.velocity.mult(3);
    this.radius = r_;
    this.m = radius*0.1;
    this.status = s_;
    this.user = u_;
    this.level = l_;
  }

  update() {
    position.add(velocity);
  }

  checkBoundaryCollision() {
    if (position.x > width-radius) {
      position.x = width-radius;
      velocity.x *= -1;
    } else if (position.x < radius) {
      position.x = radius;
      velocity.x *= -1;
    } else if (position.y > height-radius) {
      position.y = height-radius;
      velocity.y *= -1;
    } else if (position.y < radius) {
      position.y = radius;
      velocity.y *= -1;
    }
  }
  
  setInfiziert(byUser) {
    if (this.status == gesund) {
      this.status = infiziert;
      infektedByUser = byUser;
      neuerStatus = minute()*100+second() + 10;
      display();
    }
  }

 setTod() {
   this.status = tod;
   velocity.mult(0);
 }

  updateStatus() {
    if (status == infiziert) {
        let statusZeit = minute()*100+second();
        if (statusZeit >= neuerStatus) {
          let schwellWert = 10;
            schwellWert = schwellWert - level / 8;
          if (random(10) < schwellWert) {
            this.status = geheilt;
          } else {
            setTod();
          }
        }
    }
    display();
  }
  
  checkCollision(Person other) {

    // Get distances between the Personen components
    let distanceVect = PVector.sub(other.position, position);

    // Calculate magnitude of the vector separating the Personen
    let distanceVectMag = distanceVect.mag();

    // Minimum distance before they are touching
    let minDistance = radius + other.radius;
  
    updateStatus();
    
    if (distanceVectMag < minDistance) {
      let distanceCorrection = (minDistance-distanceVectMag)/2.0;
      let d = distanceVect.copy();
      let correctionVector = d.normalize().mult(distanceCorrection);
      other.addPosition(correctionVector);
      
      subPosition(correctionVector);

      // get angle of distanceVect
      let theta  = distanceVect.heading();
      // precalculate trig values
      let sine = sin(theta);
      let cosine = cos(theta);

      /* bTemp will hold rotated Person positions. You 
       just need to worry about bTemp[1] position*/
      let bTemp = [];
      bTemp[0] = new PVector();
      bTemp[1] = new PVector();

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
      vTemp[0] = new PVector();
      vTemp[1] = new PVector();
   
      vTemp[0].x  = cosine * velocity.x + sine * velocity.y;
      vTemp[0].y  = cosine * velocity.y - sine * velocity.x;
      vTemp[1].x  = cosine * other.velocity.x + sine * other.velocity.y;
      vTemp[1].y  = cosine * other.velocity.y - sine * other.velocity.x;

      /* Now that velocities are rotated, you can use 1D
       conservation of momentum equations to calculate 
       the final velocity along the x-axis. */
       let vFinal = [];
      vFinal[0] = new PVector();
      vFinal[1] = new PVector();
   

      // final rotated velocity for b[0]
      vFinal[0].x = ((m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) / (m + other.m);
      vFinal[0].y = vTemp[0].y;

      // final rotated velocity for b[0]
      vFinal[1].x = ((other.m - m) * vTemp[1].x + 2 * m * vTemp[0].x) / (m + other.m);
      vFinal[1].y = vTemp[1].y;

      // hack to avoid clumping
      bTemp[0].x += vFinal[0].x;
      bTemp[1].x += vFinal[1].x;

      /* Rotate Person positions and velocities back
       Reverse signs in trig expressions to rotate 
       in the opposite direction */
      // rotate Personen
       let bFinal = [];
      bFinal[0] = new PVector();
      bFinal[1] = new PVector();

      bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
      bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
      bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
      bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

      // update Personen to screen position
      other.position.x = position.x + bFinal[1].x;
      other.position.y = position.y + bFinal[1].y;

      position.add(bFinal[0]);

      // update velocities
      updateVelocity(cosine * vFinal[0].x - sine * vFinal[0].y, cosine * vFinal[0].y + sine * vFinal[0].x);
      other.updateVelocity(cosine * vFinal[1].x - sine * vFinal[1].y, cosine * vFinal[1].y + sine * vFinal[1].x);
    
      if (this.status == infiziert) {
        other.setInfiziert(user);
      }
      
      if (other.status == infiziert) {
        this.setInfiziert(other.user);
      }
    }
  }
  
  addPosition( correctionVector) {
        position.add(correctionVector);
    }
  
  subPosition( correctionVector) {
 
       position.sub(correctionVector);
        
    }
    
   updateVelocity(x, y) {
    if (status != tod) {
      velocity.x = x;
      velocity.y = y;
    }
  }
  
   display() {
    noStroke();
     let offset=0;
     
     if (user) {
       
       offset = 100;
  }
     fill(0 + offset, 0 + offset, 255);
     if (status == geheilt) {
      fill(0 + offset, 255 - offset, 0);
    }
   
    if (status == tod) {
      fill(0 + offset, 0 + offset, 0);
    }
    if (status == infiziert) {
      fill(255 + offset, 0 + offset, 0);
    }
   
    ellipse(position.x, position.y, radius*2, radius*2);
  }
}
