class Unit {
	constructor(pos, size, maxForce, maxSpeed){
		this.pos = pos
		this.size = size || 12
		this.vel = p5.Vector.random2D()
		this.acc = createVector()
		this.dest = null
		this.maxSpeed = maxSpeed || 4.0
		this.maxForce = maxForce || 1.0
		this.moving = false

		this.destForce = 0.5
	}
	show(){
		fill(250)
		stroke(0)
		if(this.dest){
			fill(this.dest.x%255, this.dest.y%255, 255)
		}
		this.draw_triangle()
		noFill()
	}

	draw_triangle(){
		const size = this.size
		const theta = this.vel.heading() + radians(90);

		const frontX = 0
		const frontY = -size

		const backLeftX = -(size/2)
		const backLeftY = (size/2)

		const backRightX = (size/2)
		const backRightY = (size/2)

		push()
		translate(this.pos.x, this.pos.y)
		rotate(theta)
		triangle( 
			frontX, frontY, 
			backRightX, backRightY, 
			backLeftX, backLeftY
		)
		pop()
	}

	update(neighbours){

		let acc = this.getDestVec()
		acc.add(this.flock(neighbours))
		acc.limit(this.maxForce)


		this.vel.add(acc)
		// this.vel = acc
		this.vel.limit(this.maxSpeed)

		this.pos.add(this.vel)
		this.wrapAround()
	}

	wrapAround(){
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
			return this.dest.copy().sub(this.pos).limit(this.destForce)//.mult(0.01)
		}
		return createVector()
	}

	setDest(dest){
		this.moving = true
		this.dest = dest
	}

	setVel(vel){
		this.vel = vel
	}

	flock(neighbours){
		let separation 	= this.separate(neighbours)
													.mult( SEPARATION_MULT )
		let alignment 	= this.align(neighbours)
													.mult( ALIGNMENT_MULT )
		let cohesion 		= this.cohere(neighbours)
											 		.mult( COHESION_MULT )

		return separation.add(alignment).add(cohesion)
	}


	flockHelper(neighbours, distance, funk){
		let maxFlockForce = 1
		let force = createVector()
		let count = 0
		neighbours.forEach((n) => {
			let d = dist(n.pos.x, n.pos.y, this.pos.x, this.pos.y)
			if( n != this && d < distance && d != 0){
				funk(this, force, n, d)
				count++
			}
		})
		if( count > 0 ){
			force.div(count)
		}
		return force//.limit(maxFlockForce)
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

		// console.log("separation:", newSeparation.equals(separation))
		// console.log("old:", separation, "new:", newSeparation)

		return separation
	}

	align(neighbours){

		let alignment = createVector()
		let count = 0
		neighbours.forEach((n) => {
			let d = dist(n.pos.x, n.pos.y, this.pos.x, this.pos.y)
			if(d < NEIGHBOUR_RADIUS){
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
			const d = dist(n.pos.x, n.pos.y, this.pos.x, this.pos.y)
			if(d < NEIGHBOUR_RADIUS){
				cohesion.add(n.pos)
				count++
			}
		})
		if(count > 0){
			cohesion.div(count)
		}
		let v = createVector(cohesion.x-this.pos.x, cohesion.y-this.pos.y)
		return cohesion.sub(this.pos)
	}
}