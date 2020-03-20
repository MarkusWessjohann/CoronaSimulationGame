
 int gesund = 1;
 int infiziert = 2;
 int geheilt = 3;
 int tod = 4;

 int Level = 10;
 boolean LevelEnde = false;
 Volk volk = new Volk();
 Statistikdaten statistik = new Statistikdaten();
 
  void setup() {
    size(1024, 720);
    volk.initVolk(Level);
  }


void keyPressed() {
  if (key == CODED) {
    if (keyCode == UP) {
      volk.userUp();
    } else if (keyCode == DOWN) {
      volk.userDown();
    } else if (keyCode == LEFT) {
      volk.userLeft();
    } else if (keyCode == RIGHT) {
      volk.userRight();
    }
  } else if (LevelEnde) {
    if (volk.lebtUser()) {
    Level = Level + 2;
    volk.initVolk(Level);
    loop();
    }
  }
  
}

void draw() {
 
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
      text("Durch User infiziert: " + statistik.AnzahlUserInfiziertGesamt, 300,400);
      text("Durch User gestorben: " + statistik.AnzahlUserTodGesamt, 300,500);
    }
    noLoop();
  }
  
}

class Statistikdaten {
    int AnzahlPersonenGesamt = 0;
    int AnzahlGesundGesamt = 0;
    int AnzahlInfiziertGesamt = 0;
    int AnzahlGeheiltGesamt = 0;
    int AnzahlTodGesamt = 0;
    int AnzahlUserTodGesamt = 0;
    int AnzahlUserInfiziertGesamt = 0;
    
    void addLeveldata(Volk volk) {
      
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

  int AnzahlPersonen = 10;

  int AnzahlGesund=0;
  int AnzahlTod=0;
  int AnzahlUserTod=0;
  int AnzahlGeheilt=0;
  int AnzahlInfiziert=0;
  int AnzahlUserInfiziert=0;
 
  Person[] Personen;
  
  void Volk(int anzahlPersonen) {
    this.AnzahlPersonen = anzahlPersonen;
  }

  void initVolk(int maxPersonen) {
    AnzahlPersonen = maxPersonen;
    Personen = new Person[AnzahlPersonen];
   
    Personen[0] = new Person((1024/2), (720/2), 10, gesund, true, AnzahlPersonen);
   
    for (int i=1;i<AnzahlPersonen;i++) {
  
      Personen[i] = new Person(random(1000)+10, random(700)+10, 10, gesund, false, AnzahlPersonen);
    }
    
    checkCollision();
    
    Personen[1].setInfiziert(false);  
  }

  void userUp() {
    Personen[0].updateVelocity(0,-2);
  }
  
  void userDown() {
    Personen[0].updateVelocity(0, 2);
  }
  
   void userLeft() {
    Personen[0].updateVelocity(-1.5, 0);
  }
  void userRight() {
    Personen[0].updateVelocity(1.5, 0);
  }
  
  boolean lebtUser() {
    if (Personen[0].status == tod) {
      return false;
    }
    return true;
  }
  
  void draw() {
  
    for (Person pers : Personen) {
      pers.update();
      pers.display();
      pers.checkBoundaryCollision();
    }
    
    checkCollision();
    
  }
  
  void checkCollision() {
    for (int i=0;i<AnzahlPersonen;i++) {
      for (int j=i;j<AnzahlPersonen;j++) {
        Personen[i].checkCollision(Personen[j]);
      }
    }
 
  }

  boolean istEnde() {
    boolean ende = true;
    AnzahlGesund=0;
    AnzahlTod=0;
    AnzahlUserTod=0;
    AnzahlGeheilt=0;
    AnzahlInfiziert=0;
    AnzahlUserInfiziert=0;
    for (int i=0;i<AnzahlPersonen;i++) {
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
  PVector position;
  PVector velocity;

  float radius, m;

  int status;
  
  int level=0;
  
  int neuerStatus=0;
  
  boolean infektedByUser = false;
  boolean user = false;
 
  Person(float x, float y, float r_, int s_, boolean u_, int l_) {
    this.position = new PVector(x, y);
    this.velocity = PVector.random2D();
    this.velocity.mult(3);
    this.radius = r_;
    this.m = radius*.1;
    this.status = s_;
    this.user = u_;
    this.level = l_;
  }

  void update() {
    position.add(velocity);
  }

  void checkBoundaryCollision() {
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
  
  void setInfiziert(boolean byUser) {
    if (status == gesund) {
      status = infiziert;
      infektedByUser = byUser;
      neuerStatus = minute()*100+second() + 10;
      display();
    }
  }

 void setTod() {
   status = tod;
   velocity.mult(0);
 }

  void updateStatus() {
    if (status == infiziert) {
        int statusZeit = minute()*100+second();
        if (statusZeit >= neuerStatus) {
          int schwellWert = 10;
            schwellWert = schwellWert - level / 8;
          if (random(10) < 9) {
            status = geheilt;
          } else {
            setTod();
          }
        }
    }
    display();
  }
  
  void checkCollision(Person other) {

    // Get distances between the Personen components
    PVector distanceVect = PVector.sub(other.position, position);

    // Calculate magnitude of the vector separating the Personen
    float distanceVectMag = distanceVect.mag();

    // Minimum distance before they are touching
    float minDistance = radius + other.radius;
  
    updateStatus();
    
    if (distanceVectMag < minDistance) {
      float distanceCorrection = (minDistance-distanceVectMag)/2.0;
      PVector d = distanceVect.copy();
      PVector correctionVector = d.normalize().mult(distanceCorrection);
      other.addPosition(correctionVector);
      
      subPosition(correctionVector);

      // get angle of distanceVect
      float theta  = distanceVect.heading();
      // precalculate trig values
      float sine = sin(theta);
      float cosine = cos(theta);

      /* bTemp will hold rotated Person positions. You 
       just need to worry about bTemp[1] position*/
      PVector[] bTemp = {
        new PVector(), new PVector()
      };

      /* this Person's position is relative to the other
       so you can use the vector between them (bVect) as the 
       reference point in the rotation expressions.
       bTemp[0].position.x and bTemp[0].position.y will initialize
       automatically to 0.0, which is what you want
       since b[1] will rotate around b[0] */
      bTemp[1].x  = cosine * distanceVect.x + sine * distanceVect.y;
      bTemp[1].y  = cosine * distanceVect.y - sine * distanceVect.x;

      // rotate Temporary velocities
      PVector[] vTemp = {
        new PVector(), new PVector()
      };

      vTemp[0].x  = cosine * velocity.x + sine * velocity.y;
      vTemp[0].y  = cosine * velocity.y - sine * velocity.x;
      vTemp[1].x  = cosine * other.velocity.x + sine * other.velocity.y;
      vTemp[1].y  = cosine * other.velocity.y - sine * other.velocity.x;

      /* Now that velocities are rotated, you can use 1D
       conservation of momentum equations to calculate 
       the final velocity along the x-axis. */
      PVector[] vFinal = {  
        new PVector(), new PVector()
      };

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
      PVector[] bFinal = { 
        new PVector(), new PVector()
      };

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
  
  void addPosition(PVector correctionVector) {
        position.add(correctionVector);
    }
  
  void subPosition(PVector correctionVector) {
 
       position.sub(correctionVector);
        
    }
    
  void updateVelocity(float x, float y) {
    if (status != tod) {
      velocity.x = x;
      velocity.y = y;
    }
  }
  
  void display() {
    noStroke();
     int offset=0;
     
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
