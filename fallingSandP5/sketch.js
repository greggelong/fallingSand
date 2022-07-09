
let grid;
let nextGrid;  // needs to be global for checking in other functions
let cols;
let rows;
let  sz;

let SAND = 1
let EMPTY = 0
let WATER =2
let ROCK =3
let sel;

function setup() {
  createCanvas(600, 600);
  sz = 10;
  cols = floor(width/sz)
  rows = floor(height/sz)
  noStroke();
  grid = twoDarr(rows,cols,0);
  
  //let nextGrid = grid.map(inner => inner.slice())
  //print(nextGrid)
  // selector
  sel = createSelect();
  sel.option('sand');
  sel.option('water')
  sel.option('rock')
  sel.option('destroy')
  
  for(let i =0; i<cols;i++){
    grid[rows-2][i] = 3;
  }
  showGrid();
   
}

function draw() {
  
  updateGrid();
  showGrid();
  

}

function mousePressed() {
    // go on mouse clicks only in canvas
    //https://github.com/processing/p5.js/issues/1437 
    if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0){

         mouseDragged();
    }
}




function mouseDragged() {
  let mpx = map(mouseX, 0, width, 0, cols-1);
  let mpy = map(mouseY, 0, height, 0, rows-1);

  mpx = ((mpx+cols)%cols); // makes it on a torus

  mpy =((mpy+rows)%rows);
  if (sel.value() === 'water') {
      grid[int(mpy)][int(mpx)] = 2;
    } else if (sel.value() === 'sand') {
      grid[int(mpy)][int(mpx)] = 1;
    } else if (sel.value() === 'destroy') {
      grid[int(mpy)][int(mpx)] = 0;
    } else if (sel.value() === 'rock') {
      grid[int(mpy)][int(mpx)] = 3;
    }
  
  
  
  
  if (keyIsPressed) {
    if (key == 'w' || key ==  'W') {
      grid[int(mpy)][int(mpx)] = 2;
    } else if (key == 's' || key == 'S') {
      grid[int(mpy)][int(mpx)] = 1;
    } else if (key == 'x' ||key == 'X') {
      grid[int(mpy)][int(mpx)] = 0;
    } else if (key == 'r' ||key == 'R') {
      grid[int(mpy)][int(mpx)] = 3;
    }
  }
}


function updateGrid(){
  // check each cell of grid and update to next grid according to the rules
  //
  nextGrid = twoDarr(rows,cols,0);
  for (let j =0; j <rows-1; j++) {   // scroll through from top seems to work bettter skip the edges
    for (let i =1; i < cols-1; i++) {

      /// sand
      if ( grid[j][i] == 1) {
        sandCase(i, j);   // follows the rules for sand and updates nextGrid
        // water
      } else if ( grid[j][i] == 2) {
        waterCase(i, j);
        //
      } else if ( grid[j][i] == 3) {
        rockCase(i, j);
      }
    }
  }
  grid = nextGrid.map(inner => inner.slice())
}


// ****** sand rules  *****
function  sandCase(i,j) {      // in x y order
  // booleans 
  let down  = isEmpty(i, j + 1); 
  let downW  = isWater(i, j+1);
  let left  = isEmpty(i - 1, j + 1);
  let right = isEmpty(i + 1, j + 1);

  // add random ness if both left and right are true
  if (left && right) {
    let rand = random(1) > 0.5;
    left  = rand ? true  : false;
    right = rand ? false : true;
  }

  // set to nextGrid array

  if (down)  setCell(i, j + 1, 1);
  else if (downW) setCell(i, j+1, 1);    //setCell(i,j,2);   // switch places but adds water
  else if (left)  setCell(i - 1, j + 1, 1);
  else if (right) setCell(i + 1, j + 1, 1);
  else setCell(i, j, 1); // still need to add to the new array

}

// **** water rules **** in "no change" case must also check for sand

function waterCase(i,j){
  //booleans
  let down  = isEmpty(i, j + 1);
  let left  = isEmpty(i - 1, j);
  let right = isEmpty(i + 1, j);

  let isSand = (nextGrid[j][i] == 1);

  // add random ness if both left and right are true
  if (left && right) {
    let rand = random(1) > 0.5;
    left  = rand ? true  : false;
    right = rand ? false : true;
  }

  // set to nextGrid array

  if (down)  setCell(i, j + 1, 2);
  else if (left)  setCell(i - 1, j, 2);
  else if (right) setCell(i + 1, j, 2);
  else if (!isSand) setCell(i, j, 2); // only set to water if next gen is not somthing that floats ie sand
  // this is it
  
  
  
}

/// *** rock case super simple

function rockCase(i,j){
  setCell(i,j,3);
  
}


/// dont need an empty case








  
// *********** checking logic *******
  
function inBounds(x, y) {
  return x >= 1    && y >= 0 && x < cols-1 && y < rows-1;  // rows not height
}

function isEmpty( x,  y) {
  return (inBounds(x, y) && grid[y][x] == 0) && (inBounds(x, y) && nextGrid[y][x] ==0) ; // check in current grid and next empty in both
}


function isWater(x, y) {
  return grid[y][x] == 2 || nextGrid[y][x] == 2; // check in current grid and next in current grid or next either
}


// **** set cell and element *******
function setCell(x, y, element) {
  // set the cell in the array 0 is empty element  is sand set to 1
  // but can be changed to 2 water, 3 rock;

  nextGrid[y][x] = element;  // set in next grid
}
  
  
  


function showGrid(){
  for (let j =0; j < rows; j++) {
    for (let i =0; i < cols; i++) {
      // set color
      if (grid[j][i]==1) {
        fill(255, 150, 50);  // sand
      } else if (grid[j][i] == 2) {
        fill(10, 140, 250); // water
      } else if (grid[j][i] == 3) {
        fill(170, 163, 163); // rock
      } else {
        fill(0);  // empty
      }

      rect(i*sz, j*sz, sz, sz); // whoops!! this is standard x, y
    }
  }
  
  
  
}




/// make two dim arrays

function twoDarr(rows,cols,data){
  // function returns an array  rows by columns
  let myarr =[];
  for(let j =0; j<rows;j++){
    myarr[j] = [];
   for(let i=0; i<cols;i++){
     myarr[j][i] = data;
   }
  }
  return myarr;
  
}

//sandpiles= nextpiles.map(inner => inner.slice()) // https://stackoverflow.com/questions/45949241/why-cant-i-make-a-copy-of-this-2d-array-in-js-how-can-i-make-a-copy

