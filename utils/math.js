class Vector3 {
	// x: number, y: number, z: number
	constructor(x = 0, y = 0, z = 0) {
		[this.x, this.y, this.z] = [x, y, z];
	}

	// vector: Vector3
	static duplicate(vector) {
		return new Vector3(vector.x, vector.y, vector.z);
	}

	// ...vectors: [Vector3]
	static add(...vectors) {
		let a = new Vector3();
		for (let v of vectors) {
			a.x += v.x;
			a.y += v.y;
			a.z += v.z;
		}
		return a;
	}

	// factor: number
	scale(factor) {
		return new Vector3(this.x * factor, this.y * factor, this.z * factor);
	}

	// e: HTMLDivElement, dir: Vector3
	static getVectToEdge(e, dir) {
		let a = new Vector3();
		let style = window.getComputedStyle(e);
		let val = str => parseFloat(style.getPropertyValue(str));

		if (dir.x) a.x = (dir.x > 0 ? 1 : -1) * (val('width') + val('padding-left') + val('padding-right') + val('border-left-width') + val('border-right-width')) / 2 / 64;
		if (dir.y) a.y = (dir.y > 0 ? 1 : -1) * (val('height') + val('padding-top') + val('padding-bottom') + val('border-top-width') + val('border-bottom-width')) / 2 / 64;
		return a;
	}
}

class Complex {
	// a: number, b: number
	constructor(a = 0, b = 0) {
		[this.Re, this.Im] = [a, b];
	}

	// complex: Complex
	static duplicate(complex) {
		return new Complex(complex.Re, complex.Im);
	}

	// ...complexes: [Complex]
	static add(...complexes) {
		let a = new Complex();
		for (let z of complexes) {
			if (z instanceof Complex) {
				a.Re += z.Re;
				a.Im += z.Im;
			} else if (typeof(z) == 'number') {
				a.Re += z;
			}
		}
		return a;
	}

	// ...complexes: [Complex]
	static multiply(...complexes) {
		let a = new Complex(1);
		for (let z of complexes) {
			if (z instanceof Complex) {
				a.Re = a.Re * z.Re - a.Im * z.Im;
				a.Im = a.Im * z.Re + a.Re * z.Im;
			} else if (typeof(z) == 'number') {
				a.Re *= z;
				a.Im *= z;
			}
		}
		return a;
	}

	get magnitude() {
		return Math.sqrt(this.Re * this.Re + this.Im * this.Im);
	}

	get angle() {
		let t = Math.atan2(this.Im, this.Re);
		if (t < 0) t += 2 * Math.PI;
		return t;
	}

	get conjugate() {
		return new Complex(this.Re, -this.Im);
	}

	get multInverse() {
		let m = this.Re * this.Re + this.Im * this.Im;
		return new Complex(this.Re / m, -this.Im / m);
	}
}

const ORIGIN = new Vector3(0, 0, 0);
const DOWN = new Vector3(0, -1, 0);
const UP = new Vector3(0, 1, 0);
const LEFT = new Vector3(-1, 0, 0);
const RIGHT = new Vector3(1, 0, 0);
