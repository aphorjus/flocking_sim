
const numUnitsSlider = document.getElementById("num-units-range");
numUnitsSlider.oninput = function(){
	console.log(this.value);
	setNumUnits(this.value);
}

const sepMultSlider = document.getElementById("sep-mult-range")
sepMultSlider.oninput = function(){
	console.log(this.value)
	setSeparationMult(this.value)
}

// const sepMultSlider = document.getElementById("sep-mult-range")
// sepMultSlider.oninput = function(){
// 	setSeparationMult(this.value)
// }
