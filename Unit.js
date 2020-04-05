class Unit {
	constructor(pos){
		this.pos = pos
		this.size = 4
		this.vel = p5.Vector.random2D()
		this.acc = createVector()
		this.dest = null
		this.maxSpeed = 10
	}
	show(){
		// triangle(pos.x, y1, x2, y2, x3, y3)
		fill(250)
		stroke(0)
		if(this.dest){
			fill(this.dest.x%255, this.dest.y%255, 255)
			// stroke(255)
		}
		ellipse(this.pos.x, this.pos.y, this.size, this.size)
		// noFill()
		// stroke(255)
		// ellipse(this.pos.x, this.pos.y, NEIGHBOUR_RADIUS*2, NEIGHBOUR_RADIUS*2)
		// stroke(255,0,0)
		// ellipse(this.pos.x, this.pos.y, SEPARATION_RADIUS*2, SEPARATION_RADIUS*2)

	}
	update(neighbours){
		let destVec = this.getDestVec()
		this.setVel(this.flock(neighbours))
		this.vel.add(destVec)
		this.vel.limit(this.maxSpeed)

		this.pos.add(this.vel)

		if(this.pos.x > w){
			this.pos.x = 0
		} else if (this.pos.x < 0){
			this.pos.x = w
		}

		if(this.pos.y > h){
			this.pos.y = 0
		} else if (this.pos.y < 0){
			this.pos.y = h
		}
	}

	getDestVec(){ 
		if(this.dest){
			return this.dest.copy().sub(this.pos).limit(1)
		}
		return createVector()
	}

	setDest(dest){
		this.dest = dest
	}

	setVel(vel){
		this.vel = vel
	}

	move(dest){
		this.pos = dest
	}

	flock(neighbours){
		let separation = this.separate(neighbours).mult(5)//.limit(10)
		let alignment = this.align(neighbours).mult(1)
		let cohesion = this.cohere(neighbours).mult(.001)
		return separation.add(alignment).add(cohesion)
	}


	flockHelper(neighbours, funk, distance){
		let force = createVector()
		let count = 0
		neighbours.forEach((n) => {
			let d = dist(n.pos.x, n.pos.y, this.pos.x, this.pos.y)
			if( n != this && d < distance ){
				force = funk(this, n)
				count++
			}
		})
		if( count > 0 ){
			force.div(count)
		}
		return separation
	}

	separate(neighbours){
		let separation = createVector()
		let count = 0
		neighbours.forEach((n) => {
			let d = dist(n.pos.x, n.pos.y, this.pos.x, this.pos.y)
			if(d < SEPARATION_RADIUS && d > 0){
				separation.add( this.pos.copy().sub(n.pos) ).div(d)
				count++
			}
		})
		if(count > 0){
			separation.div(count)	
		}
		return separation
	}

	align(neighbours){
		let alignment = createVector()
		let count = 0
		neighbours.forEach((n) => {
			if(dist(n.pos.x, n.pos.y, this.pos.x, this.pos.y) < NEIGHBOUR_RADIUS){
				alignment.add(n.vel)
				count++
			}
		})
		if (count > 0){
			alignment.div(count)
		}
		return alignment
	}

	cohere(neighbours){
		let cohesion = createVector()
		let count = 0
		neighbours.forEach((n) => {
			if(dist(n.pos.x, n.pos.y, this.pos.x, this.pos.y) < NEIGHBOUR_RADIUS){
				cohesion.add(n.pos)
				count++
			}
		})
		if(count > 0){
			cohesion.div(count)
		}

		return cohesion.sub(this.pos)
	}
}