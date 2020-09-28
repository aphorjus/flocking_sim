
class Market {

	constructor(pos, consumption, production){
		
		this.pos = pos
		this.useRadius = 200
		this.size = 30
		
		this.defaultPrice = 100
		this.cash = 1000

		this.production = production
		this.consumption = consumption

		this.inventory = this.initInventory()
		this.stokpile = this.initStokpile()
	}

	show(){
		fill(250)
		stroke(0)
		ellipse(this.pos.x, this.pos.y, this.size, this.size)
		// ellipse(this.pos.x, this.pos.y, this.size, this.size)
		noFill()
		stroke(250)
		ellipse(this.pos.x, this.pos.y, this.useRadius, this.useRadius)
	}

	update(){
		return
	}

	initInventory(){
		let inventory = {}
		for (const item in this.production){
			inventory[item] = {
				'price': this.defaultPrice, 
				'quantity': this.production[item]
			}
		}
		return inventory
	}

	initStokpile(){
		let stokpile = {}
		for (const item in this.consumption){
			stokpile[item] = {
				'price': this.defaultPrice, 
				'quantity': 0
			}
		}
		return stokpile
	}

	produce(){
		for (const item in this.consumption){
			if(this.stokpile[item][quantity] < consumption[item]){ return }
		}
		for (const item in this.consumption){
			this.stokpile[item][quantity] -= consumption[item]
		}
		for (const item in this.production){
			this.inventory[item][quantity] += production[item]
		}
	}




}