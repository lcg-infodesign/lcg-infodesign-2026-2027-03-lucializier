let myTable;
function preload() {
  // put preload code here
  //carico i dati
    myTable = loadTable("assets/rivers.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

}

function draw() {
  // put drawing code here
}