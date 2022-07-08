// https://blog.winter.dev/2020/falling-sand-games/

// using some of the logic here for checking 
// and using a regular array instead of a pixel array
// for sand that is going to move I will have to make a new
// position variable x1 y1  and set the x and y to 0 to delete the old one
// if I only use one array I run into the problem of teleporting the 
// sand to the bottom
// if I use two arrays I will have to check if it is empty in current

int [][] grid;
int [][] nextGrid;
int cols;
int rows;
int sz;
color _EMPTY = color(0);
color _SAND  = color(255, 150, 50);
color _WATER = color(10,140,250);

void setup() {
  size(800, 800);
  sz = 10;
  cols = int(width/sz);
  rows = int(height/sz);
  noStroke();
  grid = new int [rows][cols];
  grid[40][40] = 1;


  for (int i = 0; i<cols; i++) {
    grid[78][i]=1;
  }

  showGrid();
}

void draw() {
  update();
  showGrid();
}

void mousePressed() {

  grid[0][40] = 2;
}

void mouseDragged() {
  float mpx = map(mouseX, 0, width, 0, cols-1);
  float mpy = map(mouseY, 0, height, 0, rows-1);

  mpx = ((mpx+cols)%cols); // makes it on a torus

  mpy =((mpy+rows)%rows);
  if (keyPressed) {
    if (key == 'w' || key ==  'W') {
    grid[int(mpy)][int(mpx)] = 2;
    }
 else if(key == 's' || key == 'S') {
    grid[int(mpy)][int(mpx)] = 1;
  }
  else if(key == 'x' ||key == 'X'){
    grid[int(mpy)][int(mpx)] = 0;
  }
}
}


void update() {
  // check each 
  nextGrid = new int[rows][cols];
  for (int j =0; j <rows-1; j++) {   // scroll through from top seems to work bettter
    for (int i =1; i < cols-1; i++) {

      /// sand
      if ( grid[j][i] == 1) {
        sandCase(i, j);
      }
      else if ( grid[j][i] == 2){
        waterCase(i,j);
      }
    }
  }


  // arrayCopy(newWorld,world); this does not work  need to manually copy the array

  for (int j=0; j< rows; j++) {  //  
    for (int i=0; i< cols; i++) {
      grid[j][i] = nextGrid[j][i];
    }
  }
}

boolean inBounds(int x, int y) {
  return x >= 1    && y >= 0
    && x < cols-1 && y < rows-1;  // rows not height
}

boolean isEmpty(int x, int y) {
  return inBounds(x, y) && (grid[y][x] == 0 && nextGrid[y][x] == 0); // check in current grid and next
}


boolean isWater(int x, int y) {
  return inBounds(x, y) && (grid[y][x] == 2 || nextGrid[y][x] == 2); // check in current grid and next
}

void setCell(int x, int y, int element) {
  // set the cell in the array 0 is empty element  is sand set to 1
  // but can be changed to 2 water, 3 rock;

  nextGrid[y][x] = element;  // set in next grid
}




void  sandCase(int i, int j) {

  boolean down  = isEmpty(i, j + 1);
  //boolean downW  = isWater(i,j+1);
  boolean left  = isEmpty(i - 1, j + 1);
  boolean right = isEmpty(i + 1, j + 1);

  // add random ness if both left and right are true
  if (left && right) {
    boolean rand = random(1) > .5;
    left  = rand ? true  : false;
    right = rand ? false : true;
  }

  // set to nextGrid array

  if (down)  setCell(i, j + 1, 1);
 // else if (downW){ setCell(i,j,2); setCell(i,j+1,1);}  // switch places
  else if (left)  setCell(i - 1, j + 1, 1);
  else if (right) setCell(i + 1, j + 1, 1);
  else setCell(i, j, 1); // still need to add to the new array
}



void  waterCase(int i, int j) {

  boolean down  = isEmpty(i, j + 1);
  boolean left  = isEmpty(i - 1, j);
  boolean right = isEmpty(i + 1, j);
   
  // add random ness if both left and right are true
  if (left && right) {
    boolean rand = random(1) > .5;
    left  = rand ? true  : false;
    right = rand ? false : true;
  }

  // set to nextGrid array

  if (down)  setCell(i, j + 1, 2);
  else if (left)  setCell(i - 1, j , 2);
  else if (right) setCell(i + 1, j , 2);
  else setCell(i, j, 2); // still need to add to the new array
}

void showGrid() {
  for (int j =0; j < rows; j++) {
    for (int i =0; i < cols; i++) {
      // set color
      if (grid[j][i]==1) {
        fill(_SAND);
      } 
      
      else if(grid[j][i] == 2){
       fill(_WATER); 
      }
      else {
        fill(_EMPTY);
      }

      rect(i*sz, j*sz, sz, sz); // whoops!! this is standard x, y
    }
  }
}
