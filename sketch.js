let myTable;
let maxLength = 0;
let maxDischarge = 0;
let minTemp = 1000;
let maxTemp = -1000;
//nomi dei continenti (dataset)
let continenti = ["Asia", "Europe", "South America", "North America", "Africa", "Oceania"];
//nomi dei continenti (grafico)
let nomiContinenti = ["Asia", "Europa", "Sud America", "Nord America", "Africa", "Oceania"];
//numero di fiumi di ogni continente 
let numFiumi = [0, 0, 0, 0, 0, 0];
//posto di ogni fiume lungo il cerchio e continente di ogni fiume
let postoFiume = [];
let continenteFiume = [];
//posto da cui inizia ogni continente
let inizioContinente = [0, 0, 0, 0, 0, 0];
//posti vuoti tra continenti
let spazioTraContinenti = 3;
let totalePosti = 0;
//colori temperatura
let coloreFreddo;
let coloreMedio;
let coloreCaldo;

async function setup() { 
  createCanvas(windowWidth, windowHeight);
  myTable = await loadTable("assets/rivers.csv", ",", "header");
  coloreFreddo = color(45, 95, 235);
  coloreMedio = color(0, 205, 225);
  coloreCaldo = color(120, 245, 90);
  
  for(let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++){
    //carico valore lunghezza
    let length = myTable.getNum(numRiga, "length");
    if(length > maxLength){
      maxLength = length
    }
    //carico valore portata
    let discharge = myTable.getNum(numRiga, "discharge");
    if(discharge > maxDischarge){
      maxDischarge = discharge
    }
    //carico valore temperatura
    let temp = myTable.getNum(numRiga, "avg_temp");
    if(temp > maxTemp){
      maxTemp = temp
    }
    if(temp < minTemp){
      minTemp = temp
    }
  }
  
  //posto lungo il cerchio per ogni fiume
  let posto = 0;
  for(let numContinente = 0; numContinente < continenti.length; numContinente++){
    //posti vuoti prima di ogni continente
    posto = posto + spazioTraContinenti;
    inizioContinente[numContinente] = posto;
    for(let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++){
      //carico valore continente
      let continente = myTable.getString(numRiga, "continent");
      //Australia = Oceania
      if(continente == "Australia"){
        continente = "Oceania"
      }
      //se il fiume è di questo continente gli assegno il prossimo posto
      if(continente == continenti[numContinente]){
        postoFiume[numRiga] = posto;
        continenteFiume[numRiga] = numContinente;
        numFiumi[numContinente]++;
        posto++;
      }
    }
  }
  totalePosti = posto;
}

function draw() {
  background(7, 31, 38);
  //titolo
  noStroke();
  fill(216, 243, 234);
  textAlign(LEFT, TOP);
  textSize(26);
  text("I fiumi del mondo in cerchio: lunghezza, portata e temperatura per continente", 40, 30);
  
  //misure del grafico
  let larghezzaLegenda = 300;
  let cx = larghezzaLegenda + (windowWidth - larghezzaLegenda) / 2;
  let cy = 110 + (windowHeight - 110) / 2;
  let raggioEsterno = min((windowWidth - larghezzaLegenda) / 2 - 110, (windowHeight - 110) / 2 - 60);
  let raggioInterno = raggioEsterno * 0.25;
  //angolo occupato da ogni posto
  let passo = TWO_PI / totalePosti;
  
  //anelli 2000, 4000 e 6000 km
  noFill();
  stroke(255, 255, 255, 45);
  strokeWeight(1);
  ellipse(cx, cy, raggioInterno * 2);
  for(let km = 2000; km <= 6000; km = km + 2000){
    let raggio = raggioInterno + map(km, 0, maxLength, 0, raggioEsterno - raggioInterno);
    stroke(255, 255, 255, 45);
    noFill();
    ellipse(cx, cy, raggio * 2);
    //scritta dell'anello, nel vuoto prima del primo continente
    let angoloScritta = -HALF_PI + passo * spazioTraContinenti / 2;
    noStroke();
    fill(216, 243, 234, 170);
    textSize(11);
    textAlign(CENTER, CENTER);
    text(km + " km", cx + cos(angoloScritta) * raggio, cy + sin(angoloScritta) * raggio);
  }
  
  //scritta al centro
  noStroke();
  fill(216, 243, 234);
  textAlign(CENTER, CENTER);
  textSize(38);
  text("100", cx, cy - 30);
  textSize(14);
  textAlign(CENTER, TOP);
  text("fiumi più lunghi al mondo", cx - raggioInterno * 0.75, cy - 2, raggioInterno * 1.5);
  
  //cerco il fiume il cui cerchio è più vicino al mouse 
  let fiumeHover = -1;
  let distanzaMinima = 13;
  for(let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++){
    let angolo = -HALF_PI + (postoFiume[numRiga] + 0.5) * passo;
    let length = myTable.getNum(numRiga, "length");
    let raggio = raggioInterno + map(length, 0, maxLength, 0, raggioEsterno - raggioInterno);
    let distanza = dist(mouseX, mouseY, cx + cos(angolo) * raggio, cy + sin(angolo) * raggio);
    if(distanza < distanzaMinima){
      distanzaMinima = distanza;
      fiumeHover = numRiga;
    }
  }
  
  //testi RollOver 
  let righeHover = [];
  for(let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++){
    //posto del fiume lungo il cerchio
    let angolo = -HALF_PI + (postoFiume[numRiga] + 0.5) * passo;
    //lunghezza del raggio = lunghezza
    let length = myTable.getNum(numRiga, "length");
    let raggio = raggioInterno + map(length, 0, maxLength, 0, raggioEsterno - raggioInterno);
    //punto dove inizia il raggio e punto dove finisce
    let x0 = cx + cos(angolo) * raggioInterno;
    let y0 = cy + sin(angolo) * raggioInterno;
    let x1 = cx + cos(angolo) * raggio;
    let y1 = cy + sin(angolo) * raggio;
    //diametro del cerchio = portata 
    let discharge = myTable.getNum(numRiga, "discharge");
    let diametro = map(sqrt(discharge), 0, sqrt(maxDischarge), 8, 36);
    //colore = temperatura media 
    let temp = myTable.getNum(numRiga, "avg_temp");
    let t = map(temp, minTemp, maxTemp, 0, 1);
    let colore;
    if(t < 0.5){
      colore = lerpColor(coloreFreddo, coloreMedio, t * 2);
    } else {
      colore = lerpColor(coloreMedio, coloreCaldo, (t - 0.5) * 2);
    }
    
    //nome del fiume al RollOver (AGGIORNATO)
    let sopra = (numRiga == fiumeHover);
    if(sopra){
      colore = color(255);
      righeHover = [
        myTable.getString(numRiga, "name"),
        "lunghezza " + length + " km",
        "portata " + discharge + " m³/s"
      ];
    }
    
    //raggi
    stroke(colore);
    if(sopra){
      strokeWeight(3);
    } else {
      strokeWeight(1.5);
    }
    line(x0, y0, x1, y1);
    //cerchi
    stroke(7, 31, 38);
    strokeWeight(1.5);
    fill(colore);
    ellipse(x1, y1, diametro);
  }
  
  //nomi dei continenti fuori dall'arco
  noStroke();
  fill(216, 243, 234);
  for(let numContinente = 0; numContinente < continenti.length; numContinente++){
    //archi esterno
    let angoloInizio = -HALF_PI + inizioContinente[numContinente] * passo;
    let angoloFine = -HALF_PI + (inizioContinente[numContinente] + numFiumi[numContinente]) * passo;
    noFill();
    stroke(216, 243, 234, 140);
    strokeWeight(4);
    arc(cx, cy, (raggioEsterno + 22) * 2, (raggioEsterno + 22) * 2, angoloInizio, angoloFine);
    
    noStroke();
    fill(216, 243, 234);
    let postoCentrale = inizioContinente[numContinente] + numFiumi[numContinente] / 2;
    let angolo = -HALF_PI + postoCentrale * passo;
    let x = cx + cos(angolo) * (raggioEsterno + 45);
    let y = cy + sin(angolo) * (raggioEsterno + 45);
    
    //a destra scrivo verso destra, a sinistra verso sinistra, in alto e in basso al centro
    if(cos(angolo) > 0.3){
      textAlign(LEFT, CENTER);
    } else if(cos(angolo) < -0.3){
      textAlign(RIGHT, CENTER);
    } else {
      textAlign(CENTER, CENTER);
    }
    
    textSize(15);
    // Testo continentale centrato senza il numero dei fiumi (AGGIORNATO)
    text(nomiContinenti[numContinente], x, y);
  }
  
  //legenda: come leggere il grafico
  textAlign(LEFT, TOP);
  fill(216, 243, 234);
  textSize(15);
  text("LEGENDA", 40, 130);
  textSize(13);
  text("Ogni raggio è un fiume. I fiumi sono raggruppati per continente: l'arco esterno mostra dove inizia e finisce ciascuno.", 40, 158, 230);
  text("Lunghezza del raggio = lunghezza del fiume (km)", 40, 238, 230);
  text("Dimensione del cerchio = portata (m³/s)", 40, 318, 230);
  
  //cerchi di esempio per la portata
  let portateEsempio = [1000, 10000, 100000];
  for(let i = 0; i < portateEsempio.length; i++){
    let dEsempio = map(sqrt(portateEsempio[i]), 0, sqrt(maxDischarge), 8, 36);
    fill(216, 243, 234);
    ellipse(60 + i * 85, 392, dEsempio);
    fill(216, 243, 234);
    textAlign(CENTER, TOP);
    text(portateEsempio[i], 60 + i * 85, 412);
  }
  
  textAlign(LEFT, TOP);
  text("Colore del cerchio = temperatura media in gradi centigradi", 40, 445, 230);
  //scala dei colori
  for(let i = 0; i < 220; i++){
    if(i < 110){
      fill(lerpColor(coloreFreddo, coloreMedio, i / 110));
    } else {
      fill(lerpColor(coloreMedio, coloreCaldo, (i - 110) / 110));
    }
    rect(40 + i, 490, 1, 14);
  }
  
  fill(216, 243, 234);
  textSize(12);
  text(minTemp, 40, 510);
  textAlign(RIGHT, TOP);
  text(maxTemp, 260, 510);
  
  //riquadro con i dettagli del fiume al RollOver
  if(righeHover.length > 0){
    textSize(14);
    //larghezza del riquadro = riga più lunga + un po' di margine
    let larghezzaBox = max(textWidth(righeHover[0]), textWidth(righeHover[1]), textWidth(righeHover[2])) + 28;
    //di solito il riquadro sta a destra del mouse...
    let boxX = mouseX + 15;
    //...ma nella metà destra della finestra sta a sinistra, così non esce
    if(mouseX > windowWidth / 2){
      boxX = mouseX - larghezzaBox - 15;
    }
    let boxY = min(mouseY + 15, windowHeight - 90);
    
    //riquadro scuro con un bordo verde
    fill(7, 31, 38);
    stroke(61, 220, 151);
    strokeWeight(1);
    rect(boxX, boxY, larghezzaBox, 76, 8);
    
    //testo dentro al riquadro
    noStroke();
    fill(216, 243, 234);
    textAlign(LEFT, CENTER);
    for(let i = 0; i < righeHover.length; i++){
      text(righeHover[i], boxX + 14, boxY + 16 + i * 22);
    }
  }
}