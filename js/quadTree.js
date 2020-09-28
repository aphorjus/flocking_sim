
class Region {
	constructor(x, y, width, height){
		this.x = x
		this.y = y
		this.height = height
		this.width = width
	}

	contains(x, y){
		return(x >= this.x - this.width  &&
					 x <  this.x + this.width  &&
					 y >= this.y - this.height &&
					 y <  this.y + this.height 	 )
	}

	intersects(region){
		return (region.x+region.width  > this.x-this.width  ||
						region.x-region.width  < this.x+this.width  ||
						region.y+region.height > this.y-this.height ||
						region.y-region.height < this.y+this.height )
	}
}

class DataPoint{
	constructor(x, y, data){
		this.x = x
		this.y = y
		this.data = data
	}
}

class QuadTree {
	constructor(region, capasity){
		this.region = region
		this.capasity = capasity
		this.nw = null
		this.ne = null
		this.sw = null
		this.se = null
		this.points = []
	}

	split(){
		const newWidth = this.region.width/2
		const newHeight = this.region.height/2

		const nw = new Region(this.region.x + newWidth, 
										this.region.y + newHeight,
										newWidth, newHeight )
		this.nw = new QuadTree(nw, this.capasity)

		const ne = new Region(this.region.x - newWidth, 
										this.region.y + newHeight,
										newWidth, newHeight )
		this.ne = new QuadTree(ne, this.capasity)

		const sw = new Region(this.region.x - newWidth, 
										this.region.y - newHeight,
										newWidth, newHeight )
		this.sw = new QuadTree(sw, this.capasity)

		const se = new Region(this.region.x + newWidth, 
										this.region.y - newHeight,
										newWidth, newHeight )
		this.se = new QuadTree(se, this.capasity)

		// this.points.forEach(point => this.insert(point))
	}

	insert(x, y, data){
		// console.log('hello')
		if( !this.region.contains(x, y) ){
			return false
		}
		if( this.points.length < this.capasity ){
			this.points.push(new DataPoint(x, y, data))
			return true
		}
		if( !this.nw ){
			this.split()
		}
		if(this.nw.insert(x, y, data)){ return true }
		if(this.ne.insert(x, y, data)){ return true }
		if(this.sw.insert(x, y, data)){ return true }
		if(this.se.insert(x, y, data)){ return true }
	}

	getPoints(searchRegion){
		return this.recursiveGetPoints(searchRegion, [])
	}

	recursiveGetPoints(searchRegion, found){
		if( !this.region.intersects(searchRegion) ){
			return
		}
		this.points.forEach((p) => {
			if( searchRegion.contains(p.x, p.y) ){
				found.push(p)
			}
		})
		if( this.nw ){
			this.nw.recursiveGetPoints(searchRegion, found)
			this.ne.recursiveGetPoints(searchRegion, found)
			this.sw.recursiveGetPoints(searchRegion, found)
			this.se.recursiveGetPoints(searchRegion, found)
		}
		return found
	}

	show(){
		rectMode(CENTER)
		noFill()
		stroke(0, 255, 255)
		rect(this.region.x, this.region.y, this.region.width*2, this.region.height*2)
		if(this.nw){
			this.nw.show()
			this.ne.show()
			this.sw.show()
			this.se.show()
		}
	}
}