const NEIGHBOUR_RADIUS = 84
const SEPARATION_RADIUS = 36

let SEPARATION_MULT		= 10.0
let ALIGNMENT_MULT		= 1.0
let COHESION_MULT			= 0.001

let w = window.innerWidth - 200;// 1200
let h = window.innerHeight - 200;// 800

let num_units = 200
let units = []

let showQtree = false
let quadTreeCap = 70

let selectedUnits = []
let currentSelectedUnits = []
let selecting = false
let selectionBox = null
let selectStartPoint = null


function setup() {
	createCanvas(w, h)
	
	reset()
	document.dispatchEvent(new Event('p5ready'))
}

function reset() {
	units = createUnitArr(num_units)
}

function createUnitArr(size){
	unitArr = []
	for(let i = 0; i < size; i++){
		unitArr.push( 
			new Unit(createVector(random(w), random(h))) 
		)
	}
	return unitArr
}

function draw() {

	background(0);

	showUnits()
	showSelectedUnitIdicator()
	if(showQtree){
		quadTree.show()
	}
	showFPS()	

	updateUnits()
	selectionHandler()
	keyDownHandler()
}

function showFPS(){
	let fps = frameRate();
	fill(255);
	stroke(0);
	text(`FPS: ${fps.toFixed(2)} --- cap: ${quadTreeCap}`, 10, height - 10);
}

function showSelectedUnitIdicator(){
	noFill()
	stroke(0,255,0)
	selectedUnits.forEach((unit) => {	
		ellipse(unit.pos.x, unit.pos.y, SEPARATION_RADIUS, SEPARATION_RADIUS)
	})
}

function showUnits(){
	units.forEach((unit) => { unit.show() })
}

function updateUnits(){

	quadTree = new QuadTree(new Region(w/2, h/2, w/2, h/2), quadTreeCap)
	units.forEach((unit) => {
		quadTree.insert(unit.pos.x, unit.pos.y, unit)
	})

	units.forEach((unit) => {
		r = new Region( unit.pos.x, unit.pos.y, NEIGHBOUR_RADIUS, NEIGHBOUR_RADIUS )
		dataPoints = quadTree.getPoints(r)
		neighbours = dataPoints.map((dataPoint) => {return dataPoint.data})
		unit.update(neighbours)
	})
}

function getSelectionRegion(spX, spY){
	let x = 0
	let y = 0
	let width = 0
	let height = 0

	if(spX > mouseX){
		width = (spX - mouseX)/2
		x = spX - (width)
	} else {
		width = (mouseX - spX)/2
		x = spX + (width)
	}
	if(spY > mouseY){
		height = (spY - mouseY)/2
		y = spY - (height)
	} else {
		height = (mouseY - spY)/2
		y = spY + (height)
	}

	return new Region(x, y, width, height)
}

function selectionHandler(){
	if( !selecting ){ return }

	noFill()
	stroke(0,255,0)
	rectMode(CORNERS)
	rect(selectStartPoint.x, selectStartPoint.y, mouseX, mouseY)

	selectionBox = getSelectionRegion(selectStartPoint.x, selectStartPoint.y)
	selectionBoxUnits = quadTree.getPoints(selectionBox).map((d) => {return d.data})

	if(keyIsDown(SHIFT)){
		newSelectedUnits = []
		selectionBoxUnits.forEach((unit) => {
			if( !currentSelectedUnits.includes(unit) ){
				newSelectedUnits.push(unit)
			}
		})
		selectedUnits = newSelectedUnits.concat(currentSelectedUnits)
	} else {
		currentSelectedUnits = selectedUnits = selectionBoxUnits
	}
}

function keyDownHandler(){

	if(keyIsDown(UP_ARROW)){
		quadTreeCap++
	}
	if(keyIsDown(DOWN_ARROW)){
		quadTreeCap--
	}
}

function mousePressed() {
	if(mouseButton == RIGHT){
		selectedUnits.forEach(unit => unit.setDest(createVector(mouseX, mouseY)))
	}
	if(mouseButton == LEFT){
		selectStartPoint = createVector(mouseX, mouseY)
		selecting = true
	}
}

function mouseReleased() {
	if(mouseButton == LEFT){
		currentSelectedUnits = selectedUnits
		selecting = false
	}
}

function keyPressed() {
	if(keyCode == 83){ // 83 = s
		showQtree = !showQtree
	}
	// if(keyCode == )
}


function removeDests(){

}

function setNumUnits(num){
	const numNewUnits = num - num_units
	num_units = num

	if(numNewUnits < 0){
		units = units.slice(0, num_units)
		return
	}

	let newUnits = createUnitArr(numNewUnits)
	units = units.concat(newUnits)
}

function setSeparationMult(val){
	SEPARATION_MULT = val
}

function setAlignmentMult(val){
	ALIGNMENT_MULT = val
}

function setCohesionMult(val){
	COHESION_MULT = val
}


document.addEventListener("p5ready", function(){
	let scetch = document.getElementById('defaultCanvas0')
	scetch.addEventListener('contextmenu', function(evt){
		evt.preventDefault();
	})
})

window.addEventListener("resize", function(){
	w = window.innerWidth - 200
	h = window.innerHeight - 200
	resizeCanvas(w, h)
})