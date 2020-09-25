export const Fn = {
	clamp(n, min, max) {
		return Math.max(min, Math.min(max, n))
	},

	is_ASCII(id) {
		// console.log(id)
		if (id === 'Enter' || id === 'Tab')
			return true
		else
			return ASCII_CHAR.includes(id)
	},

	get_Char(id) {
		switch (id) {
			case 'Enter':
				return '\n'
			case 'Tab':
				return '\t'
			default:
				if (this.is_ASCII(id)) {
					return id
				}
				break;
		}
	},

	load(path) {
		let xhr = new XMLHttpRequest()
		let okStatus = document.location.protocol === "file:" ? 0 : 200
		xhr.open('GET', path, false)
		xhr.overrideMimeType("text/html;charset=utf-8")
		xhr.send(null)
		return xhr.status === okStatus ? xhr.responseText : null
	},

	swap(a, b) {
		// console.log(a, b)
		let c = a
		a = b
		b = c
		// console.log(a, b)
	}
}

// util Class
export class Vector2 {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}
}

export class Vector3 {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z
	}

	x_mat4(mat) {
		let i = this
		let m = mat.mat
		let x = i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + m[3][0]
		let y = i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + m[3][1]
		let z = i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + m[3][2]
		let w = i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + m[3][3]

		if (w !== 0) {
			return new Vector3(x / w, y / w, z / w)
		}
		return new Vector3(x, y, z)
	}

	dot(vec) {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z
	}

	minus(vec) {
		return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z)
	}

	cross(vec) {
		return new Vector3(this.y * vec.z - this.z * vec.y,
			this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x)
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}

	normalize() {
		let length = this.length()
		return new Vector3(this.x / length, this.y / length, this.z / length)
	}
}

export class Matrix4 {
	constructor(elem) {
		this.mat = elem
	}
}

export class TriFace {
	constructor(p1, p2, p3) {
		this.p1 = p1
		this.p2 = p2
		this.p3 = p3
		let line1 = this.p2.minus(this.p1)
		let line2 = this.p3.minus(this.p1)
		// console.log(line1, line2)
		this.normal = line1.cross(line2).normalize()
	}
}

export class Mesh {
	constructor(faces) {
		this.faces = faces
	}

	static CUBE(size = 1) {
		return new Mesh([new TriFace(new Vector3(0, 0, 0), new Vector3(0, size, 0), new Vector3(size, size, 0)),
		new TriFace(new Vector3(0, 0, 0), new Vector3(size, size, 0), new Vector3(size, 0, 0)),
		new TriFace(new Vector3(size, 0, 0), new Vector3(size, size, 0), new Vector3(size, size, size)),
		new TriFace(new Vector3(size, 0, 0), new Vector3(size, size, size), new Vector3(size, 0, size)),
		new TriFace(new Vector3(size, 0, size), new Vector3(size, size, size), new Vector3(0, size, size)),
		new TriFace(new Vector3(size, 0, size), new Vector3(0, size, size), new Vector3(0, 0, size)),
		new TriFace(new Vector3(0, 0, size), new Vector3(0, size, size), new Vector3(0, size, 0)),
		new TriFace(new Vector3(0, 0, size), new Vector3(0, size, 0), new Vector3(0, 0, 0)),
		new TriFace(new Vector3(0, size, 0), new Vector3(0, size, size), new Vector3(size, size, size)),
		new TriFace(new Vector3(0, size, 0), new Vector3(size, size, size), new Vector3(size, size, 0)),
		new TriFace(new Vector3(size, 0, size), new Vector3(0, 0, size), new Vector3(0, 0, 0)),
		new TriFace(new Vector3(size, 0, size), new Vector3(0, 0, 0), new Vector3(size, 0, 0))])
	}

	static LOAD_OBJ(path) {
		let lines = Fn.load(path).split('\n')
		let points = []
		let faces = []
		lines.forEach((line) => {
			let items = line.split(' ')
			if (items[0] === 'v') {
				points.push(new Vector3(parseFloat(items[1]), parseFloat(items[2]), parseFloat(items[3])))
			}
			else if (items[0] === 'f') {
				faces.push(new TriFace(points[parseInt(items[1]) - 1], points[parseInt(items[2]) - 1], points[parseInt(items[3]) - 1]))
			}
		})
		return new Mesh(faces)
	}
}

export class Rect {
	constructor(position, size) {
		this.position = position
		this.size = size
	}

	inside(vector2) {
		return (this.position.x <= vector2.x && vector2.x < this.position.x + this.size.x && this.position.y <= vector2.y && vector2.y < this.position.y + this.size.y)
	}

	static XYWH(x, y, width, height) {
		let position = new Vector2(x, y)
		let size = new Vector2(Math.max(0, width), Math.max(0, height))
		return new Rect(position, size)
	}
}

export class Color {
	constructor(r = 255, g = 255, b = 255, a = 100) {
		this.r = Fn.clamp(r, 0, 255)
		this.g = Fn.clamp(g, 0, 255)
		this.b = Fn.clamp(b, 0, 255)
		this.a = Fn.clamp(a / 100, 0, 1)
	}

	get_Color() {
		return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')'
	}

	get_R() {
		return this.r
	}

	get_G() {
		return this.g
	}

	get_B() {
		return this.b
	}

	get_A() {
		return this.a * 100
	}

	get_Invert() {
		return Color.RGB8(255 - this.r, 255 - this.g, 255 - this.b, this.a * 100)
	}

	static RGB8(r, g, b, a = 100) {
		let color = new Color(r, g, b, a)
		return color
	}

	static RGB(r, g, b, a = 1) {
		let color = new Color(r * 255, g * 255, b * 255, a * 100)
		return color
	}

	static PICO(id) {
		id = Fn.clamp(id, 0, 15)
		switch (id) {
			case 0:
				return Color.RGB8(0, 0, 0)
			case 1:
				return Color.RGB8(29, 43, 83)
			case 2:
				return Color.RGB8(126, 37, 83)
			case 3:
				return Color.RGB8(0, 135, 81)
			case 4:
				return Color.RGB8(171, 82, 54)
			case 5:
				return Color.RGB8(95, 87, 79)
			case 6:
				return Color.RGB8(194, 195, 199)
			case 7:
				return Color.RGB8(255, 241, 232)
			case 8:
				return Color.RGB8(255, 0, 77)
			case 9:
				return Color.RGB8(255, 163, 0)
			case 10:
				return Color.RGB8(255, 240, 36)
			case 11:
				return Color.RGB8(0, 231, 86)
			case 12:
				return Color.RGB8(41, 173, 255)
			case 13:
				return Color.RGB8(131, 118, 156)
			case 14:
				return Color.RGB8(255, 119, 168)
			case 15:
				return Color.RGB8(255, 204, 170)
		}
	}

	static COLOR(name) {
		if (typeof (name) !== 'string' || name === undefined) {
			return Color.RGB8(0, 0, 0, 0)
		}
		name = name.toLowerCase()
		switch (name) {
			default:
				return Color.RGB8(0, 0, 0, 0)
			case 'black':
				return Color.RGB8(0, 0, 0, 100)
			case 'white':
				return Color.RGB8(255, 255, 255, 100)
			case 'red':
				return Color.RGB8(255, 0, 0, 100)
		}
	}

	static ADD(color1, color2) {
		let ans = new Color(color1.r + color2.r, color1.g + color2.g, color1.b + color2.b)
		return ans
	}
}


//************************************
//           Render Obj
//************************************
export class Sprite {
	constructor(colorarray) {
		this.width = colorarray[0].length
		this.height = colorarray.length
		this.image = []
		for (let i = 0; i < this.height; i++) {
			let row = colorarray[i]
			let newrow = []
			for (let j = 0; j < this.width; j++) {
				if (j < row.length) {
					newrow.push(row[j])
				}
				else {
					newrow.push(Color.RGB8(0, 0, 0, 0))
				}
			}
			this.image.push(newrow)
		}
	}

	set_Pixel(x, y, color) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) return
		this.image[y][x] = color
	}


	get_Rect(scale = 1) {
		return Rect.XYWH(0, 0, this.width * scale, this.height * scale)
	}

	static PICO(colorarray) {
		let array = colorarray
	}

	static COLOR_PALETTE_PICO() {
		return new Sprite(
			[[Color.PICO(0), Color.PICO(1), Color.PICO(2), Color.PICO(3)],
			[Color.PICO(4), Color.PICO(5), Color.PICO(6), Color.PICO(7)],
			[Color.PICO(8), Color.PICO(9), Color.PICO(10), Color.PICO(11)],
			[Color.PICO(12), Color.PICO(13), Color.PICO(14), Color.PICO(15)]])
	}
}

export class Char {
	constructor(pointarray, shiftup = 0, shiftleft = 0) {
		this.pointarray = pointarray
		this.shiftup = shiftup
		this.shiftleft = shiftleft
		this.height = pointarray.length
		this.width = 0
		for (let i = 0; i < pointarray.length; i++) {
			this.width = Math.max(this.width, pointarray[i].length)
		}
	}

	get_Rect() {
		return Rect.XYWH(0, 0, this.width, this.height)
	}

	static DEFAULT(id) {
		// console.log(id)
		switch (id) {
			case 'A':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 1, 1, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1]
					],
					0, 0
				)
			case 'a':
				return new Char(
					[
						[0, 1, 1, 0, 0],
						[1, 0, 0, 1, 0],
						[1, 0, 0, 1, 0],
						[1, 0, 0, 1, 0],
						[0, 1, 1, 0, 1]
					],
					-2, 0
				)
			case 'B':
				return new Char(
					[
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 1, 1, 0]
					],
					0, 0
				)
			case 'b':
				return new Char(
					[
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 1, 1, 0]
					],
					0, 0
				)
			case 'C':
				return new Char(
					[
						[0, 1, 1, 1],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[0, 1, 1, 1]
					],
					0, 0
				)
			case 'c':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[0, 1, 1, 1]
					],
					-2, 0
				)
			case 'D':
				return new Char(
					[
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 1, 1, 0]
					],
					0, 0
				)
			case 'd':
				return new Char(
					[
						[0, 0, 0, 1],
						[0, 0, 0, 1],
						[0, 1, 1, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 1]
					],
					0, 0
				)
			case 'E':
				return new Char(
					[
						[0, 1, 1, 1],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 1, 1, 1],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[0, 1, 1, 1]
					],
					0, 0
				)
			case 'e':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 1, 1, 1],
						[1, 0, 0, 0],
						[0, 1, 1, 1]
					],
					-2, 0
				)
			case 'F':
				return new Char(
					[
						[0, 1, 1, 1],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 1, 1, 1],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 0, 0, 0]
					],
					0, 0
				)
			case 'f':
				return new Char(
					[
						[0, 0, 1],
						[0, 1, 0],
						[1, 1, 1],
						[0, 1, 0],
						[0, 1, 0],
						[0, 1, 0],
						[0, 1, 0]
					],
					0, 0
				)
			case 'G':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 0],
						[1, 0, 1, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
				)
			case 'g':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 1],
						[0, 0, 0, 1],
						[0, 1, 1, 0]
					],
					-2, 0
				)
			case 'H':
				return new Char(
					[
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 1, 1, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1]
					],
					0, 0
				)
			case 'h':
				return new Char(
					[
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1]
					],
					0, 0
				)
			case 'I':
				return new Char(
					[
						[1],
						[1],
						[1],
						[1],
						[1],
						[1],
						[1]
					],
					0, 0
				)
			case 'i':
				return new Char(
					[
						[0, 1],
						[0, 0],
						[1, 1],
						[0, 1],
						[0, 1],
						[0, 1],
						[0, 1]
					],
					0, 0
				)
			case 'J':
				return new Char(
					[
						[1, 1, 1, 1],
						[0, 0, 1, 0],
						[0, 0, 1, 0],
						[0, 0, 1, 0],
						[0, 0, 1, 0],
						[0, 0, 1, 0],
						[1, 1, 0, 0]
					],
					0, 0
				)
			case 'j':
				return new Char(
					[
						[0, 1],
						[0, 0],
						[1, 1],
						[0, 1],
						[0, 1],
						[0, 1],
						[0, 1],
						[0, 1],
						[1, 0]
					],
					-0, 0
				)
			case 'K':
				return new Char(
					[
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 1, 0],
						[1, 1, 0, 0],
						[1, 0, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1]
					],
					0, 0
				)
			case 'k':
				return new Char(
					[
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 0, 0, 1],
						[1, 0, 1, 0],
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1]
					],
					0, 0
				)
			case 'L':
				return new Char(
					[
						[1, 0, 0],
						[1, 0, 0],
						[1, 0, 0],
						[1, 0, 0],
						[1, 0, 0],
						[1, 0, 0],
						[0, 1, 1, 1]
					],
					0, 0
				)
			case 'l':
				return new Char(
					[
						[1, 0],
						[1, 0],
						[1, 0],
						[1, 0],
						[1, 0],
						[1, 0],
						[0, 1]
					],
					0, 0
				)
			case 'M':
				return new Char(
					[
						[1, 1, 1, 1, 0],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 0, 0, 1]
					],
					0, 0
				)
			case 'm':
				return new Char(
					[
						[1, 1, 1, 1, 0],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1]
					],
					-2, 0
				)
			case 'N':
				return new Char(
					[
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1]
					],
					0, 0
				)
			case 'n':
				return new Char(
					[
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1]
					],
					-2, 0
				)
			case 'O':
				return new Char(
					[
						[0, 1, 1, 1, 0],
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[0, 1, 1, 1, 0]
					],
					0, 0
				)
			case 'o':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					-2, 0
				)
			case 'P':
				return new Char(
					[
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 1, 1, 0],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 0, 0, 0]
					],
					0, 0
				)
			case 'p':
				return new Char(
					[
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 1, 1, 0],
						[1, 0, 0, 0],
						[1, 0, 0, 0]
					],
					-2, 0
				)
			case 'Q':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 1, 0],
						[0, 1, 0, 1]
					],
					0, 0
				)
			case 'q':
				return new Char(
					[
						[0, 1, 1, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 1],
						[0, 0, 0, 1],
						[0, 0, 0, 1]
					],
					-2, 0
				)
			case 'R':
				return new Char(
					[
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 1, 1, 0],
						[1, 0, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1]
					],
					0, 0
				)
			case 'r':
				return new Char(
					[
						[1, 0, 1],
						[1, 1, 0],
						[1, 0, 0],
						[1, 0, 0],
						[1, 0, 0]
					],
					-2, 0
				)
			case 'S':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 0],
						[0, 1, 1, 0],
						[0, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
				)
			case 's':
				return new Char(
					[
						[0, 1, 1, 1],
						[1, 0, 0, 0],
						[0, 1, 1, 0],
						[0, 0, 0, 1],
						[1, 1, 1, 0]
					],
					-2, 0
				)
			case 'T':
				return new Char(
					[
						[1, 1, 1, 1, 1],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0]
					],
					0, 0
				)
			case 't':
				return new Char(
					[
						[0, 1, 0],
						[0, 1, 0],
						[1, 1, 1],
						[0, 1, 0],
						[0, 1, 0],
						[0, 1, 0],
						[0, 0, 1]
					],
					0, 0
				)
			case 'U':
				return new Char(
					[
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
				)
			case 'u':
				return new Char(
					[
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					-2, 0
				)
			case 'V':
				return new Char(
					[
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[0, 1, 0, 1, 0],
						[0, 0, 1, 0, 0]
					],
					0, 0
				)
			case 'v':
				return new Char(
					[
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0],
						[0, 1, 1, 0]
					],
					-2, 0
				)
			case 'W':
				return new Char(
					[
						[1, 0, 0, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[0, 1, 0, 1, 0]
					],
					0, 0
				)
			case 'w':
				return new Char(
					[
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[0, 1, 0, 1, 0]
					],
					-2, 0
				)
			case 'X':
				return new Char(
					[
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[0, 1, 0, 1, 0],
						[0, 0, 1, 0, 0],
						[0, 1, 0, 1, 0],
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1]
					],
					0, 0
				)
			case 'x':
				return new Char(
					[
						[1, 0, 0, 0, 1],
						[0, 1, 0, 1, 0],
						[0, 0, 1, 0, 0],
						[0, 1, 0, 1, 0],
						[1, 0, 0, 0, 1]
					],
					-2, 0
				)
			case 'Y':
				return new Char(
					[
						[1, 0, 0, 0, 1],
						[1, 0, 0, 0, 1],
						[0, 1, 0, 1, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0]
					],
					0, 0
				)
			case 'y':
				return new Char(
					[
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 1],
						[0, 0, 0, 1],
						[0, 1, 1, 0]
					],
					-2, 0
				)
			case 'Z':
				return new Char(
					[
						[1, 1, 1, 1],
						[0, 0, 0, 1],
						[0, 0, 1, 0],
						[0, 1, 0, 0],
						[0, 1, 0, 0],
						[1, 0, 0, 0],
						[1, 1, 1, 1]
					],
					0, 0
				)
			case 'z':
				return new Char(
					[
						[1, 1, 1, 1],
						[0, 0, 0, 1],
						[0, 1, 1, 0],
						[1, 0, 0, 0],
						[1, 1, 1, 1]
					],
					-2, 0
				)

			case '0':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 1, 1],
						[1, 1, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
				)
			case '1':
				return new Char(
					[
						[0, 1],
						[1, 1],
						[0, 1],
						[0, 1],
						[0, 1],
						[0, 1],
						[0, 1]
					],
					0, 0
				)
			case '2':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[0, 0, 0, 1],
						[0, 0, 1, 0],
						[0, 1, 0, 0],
						[1, 0, 0, 0],
						[1, 1, 1, 1]
					],
					0, 0
				)
			case '3':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[0, 0, 0, 1],
						[0, 1, 1, 0],
						[0, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
				)
			case '4':
				return new Char(
					[
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 1],
						[0, 0, 0, 1],
						[0, 0, 0, 1],
						[0, 0, 0, 1]
					],
					0, 0
				)
			case '5':
				return new Char(
					[
						[1, 1, 1, 1],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 1, 1, 0],
						[0, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
				)
			case '6':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 0],
						[1, 0, 0, 0],
						[1, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
				)
			case '7':
				return new Char(
					[
						[1, 1, 1, 1],
						[0, 0, 0, 1],
						[0, 0, 1, 0],
						[0, 0, 1, 0],
						[0, 1, 0, 0],
						[0, 1, 0, 0],
						[0, 1, 0, 0]
					],
					0, 0
				)
			case '8':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
				)
			case '9':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 1],
						[0, 0, 0, 1],
						[0, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
				)

			case '.':
				return new Char(
					[
						[1]
					],
					-6, 0
				)
			case ',':
				return new Char(
					[
						[0, 0, 1, 0],
						[0, 1, 0, 0]
					],
					-6, 0
				)
			case '<':
				return new Char(
					[
						[0, 0, 0, 0],
						[0, 0, 1, 0],
						[0, 1, 0, 0],
						[1, 0, 0, 0],
						[0, 1, 0, 0],
						[0, 0, 1, 0],
						[0, 0, 0, 0]
					],
					0, 0
				)
			case '>':
				return new Char(
					[
						[0, 0, 0, 0],
						[0, 1, 0, 0],
						[0, 0, 1, 0],
						[0, 0, 0, 1],
						[0, 0, 1, 0],
						[0, 1, 0, 0],
						[0, 0, 0, 0]
					],
					0, 0
				)
			case '(':
				return new Char(
					[
						[0, 1, 0],
						[1, 0, 0],
						[1, 0, 0],
						[1, 0, 0],
						[1, 0, 0],
						[1, 0, 0],
						[0, 1, 0]
					],
					0, 0
				)
			case ')':
				return new Char(
					[
						[0, 1, 0],
						[0, 0, 1],
						[0, 0, 1],
						[0, 0, 1],
						[0, 0, 1],
						[0, 0, 1],
						[0, 1, 0]
					],
					0, 0
				)
			case '[':
				return new Char(
					[
						[1, 1],
						[1, 0],
						[1, 0],
						[1, 0],
						[1, 0],
						[1, 0],
						[1, 1]
					],
					0, 0
				)
			case ']':
				return new Char(
					[
						[1, 1],
						[0, 1],
						[0, 1],
						[0, 1],
						[0, 1],
						[0, 1],
						[1, 1]
					],
					0, 0
				)
			case '{':
				return new Char(
					[
						[0, 0, 1],
						[0, 1, 0],
						[0, 1, 0],
						[1, 0, 0],
						[0, 1, 0],
						[0, 1, 0],
						[0, 0, 1]
					],
					0, 0
				)
			case '}':
				return new Char(
					[
						[1, 0, 0],
						[0, 1, 0],
						[0, 1, 0],
						[0, 0, 1],
						[0, 1, 0],
						[0, 1, 0],
						[1, 0, 0]
					],
					0, 0
				)
			case '+':
				return new Char(
					[
						[0, 0, 0, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[1, 1, 1, 1, 1],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 0, 0, 0]
					],
					0, 0
				)
			case '-':
				return new Char(
					[
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[1, 1, 1, 1],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					0, 0
				)
			case '=':
				return new Char(
					[
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[1, 1, 1, 1],
						[0, 0, 0, 0],
						[1, 1, 1, 1],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					0, 0
				)
			case '*':
				return new Char(
					[
						[0, 0, 0, 0, 0],
						[1, 0, 0, 0, 1],
						[0, 1, 0, 1, 0],
						[0, 0, 1, 0, 0],
						[0, 1, 0, 1, 0],
						[1, 0, 0, 0, 1],
						[0, 0, 0, 0, 0]
					],
					0, 0
				)
			case '/':
				return new Char(
					[
						[0, 0, 0, 1, 0],
						[0, 0, 0, 1, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 1, 0, 0, 0],
						[0, 1, 0, 0, 0]
					],
					0, 0
				)
			case '!':
				return new Char(
					[
						[1],
						[1],
						[1],
						[1],
						[1],
						[0],
						[1]
					],
					0, 0
				)
			case '?':
				return new Char(
					[
						[0, 1, 0],
						[1, 0, 1],
						[0, 0, 1],
						[0, 1, 0],
						[0, 1, 0],
						[0, 0, 0],
						[0, 1, 0]
					],
					0, 0
				)
			case '\'':
				return new Char(
					[
						[1],
						[1],
						[0],
						[0],
						[0],
						[0],
						[0]
					],
					0, 0
				)
			case '\"':
				return new Char(
					[
						[1, 0, 1],
						[1, 0, 1],
						[0, 0, 0],
						[0, 0, 0],
						[0, 0, 0],
						[0, 0, 0],
						[0, 0, 0]
					],
					0, 0
				)
			case ':':
				return new Char(
					[
						[0],
						[0],
						[1],
						[0],
						[0],
						[1],
						[0]
					],
					0, 0
				)
			case ';':
				return new Char(
					[
						[0, 0],
						[0, 0],
						[0, 1],
						[0, 0],
						[0, 0],
						[0, 1],
						[1, 0]
					],
					-1, 0
				)
			case '\n':
				return new Char(
					[
						[0, 0, 1],
						[0, 0, 1],
						[1, 1, 1]
					],
					-4, 0
				)
			case '_':
				return new Char(
					[
						[1, 1, 1, 1]
					],
					-6, 0
				)


			case '→':
				return new Char(
					[
						[0, 0, 0, 0, 0, 0],
						[0, 0, 0, 1, 0, 0],
						[0, 0, 0, 0, 1, 0],
						[1, 1, 1, 1, 1, 1],
						[0, 0, 0, 0, 1, 0],
						[0, 0, 0, 1, 0, 0],
						[0, 0, 0, 0, 0, 0]
					],
					0, 0
				)


			case '◼':
				return new Char(
					[
						[1, 1, 1, 1],
						[1, 1, 1, 1],
						[1, 1, 1, 1],
						[1, 1, 1, 1],
						[1, 1, 1, 1],
						[1, 1, 1, 1],
						[1, 1, 1, 1]
					],
					0, 0
				)
			case '◻':
				return new Char(
					[
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					0, 0
				)
			default:
				return new Char(
					[
						[1, 0, 1, 0, 1],
						[0, 1, 0, 1, 0],
						[1, 0, 1, 0, 1],
						[0, 1, 0, 1, 0],
						[1, 0, 1, 0, 1],
						[0, 1, 0, 1, 0],
						[1, 0, 1, 0, 1]
					],
					0, 0
				)
		}
	}

	static CODE(id) {
		switch (id) {
			case 'func':
				return new Char(
					[
						[0, 0, 1, 1],
						[0, 1, 1, 0],
						[0, 1, 1, 0],
						[0, 1, 1, 1],
						[1, 1, 1, 0],
						[0, 1, 1, 0],
						[0, 1, 1, 0],
						[0, 1, 1, 0],
						[0, 1, 0, 0],
						[1, 0, 0, 0]
					],
					1, 0
				)
			default:
				return new Char(
					[
						[1, 0, 1, 0, 1],
						[0, 1, 0, 1, 0],
						[1, 0, 1, 0, 1],
						[0, 1, 0, 1, 0],
						[1, 0, 1, 0, 1],
						[0, 1, 0, 1, 0],
						[1, 0, 1, 0, 1]
					],
					0, 0
				)
		}
	}
}

export class Font {
	constructor(space = 2, returnheight = 7, tab = 4) {
		this.charmap = {}
		this.space = space
		this.tab = tab
		this.returnheight = returnheight
		this.maxheight = 0
	}

	add(id, char) {
		// console.log(id, char)
		this.charmap[id] = char
		this.maxheight = Math.max(this.maxheight, char.height)
	}

	get(id) {
		return this.charmap[id] === undefined ? new Char(
			[
				[1, 0, 1, 0, 1],
				[0, 1, 0, 1, 0],
				[1, 0, 1, 0, 1],
				[0, 1, 0, 1, 0],
				[1, 0, 1, 0, 1],
				[0, 1, 0, 1, 0],
				[1, 0, 1, 0, 1]
			],
			0, 0
		) : this.charmap[id]
	}

	get_StringRect(string, split = 1, lineheight = 0) {
		let width = 0
		let height = 0
		string.split('').forEach((id, idx, arr) => {
			if (id === ' ') {
				width += this.space
				height = Math.max(height, this.returnheight)
			}
			else if (id === '\t') {
				let nearx = 0
				if (width % (this.space * this.tab) === 0) {
					nearx = (Math.ceil(width / this.space / this.tab) + 1) * this.space * this.tab
				}
				else {
					nearx = Math.ceil(width / this.space / this.tab) * this.space * this.tab
				}
				width = nearx
				height = Math.max(height, this.returnheight)
			}
			else {
				let char = this.get(id)
				height = Math.max(height, char.height - char.shiftup)
				width += char.width - char.shiftleft
			}
			width += split
		})
		return Rect.XYWH(0, 0, width - split, string === '' ? height : height + lineheight)
	}

	get_MultiStringRect(string, split = 1, lineheight = 0, linesplit = 1) {
		let lines = string.split('\n')
		let width = 0
		let height = 0
		lines.forEach((line) => {
			if (line === '') {
				height += this.returnheight + lineheight + linesplit
				return
			}
			let size = this.get_StringRect(line).size
			width = Math.max(width, size.x)
			height += size.y + lineheight + linesplit
		})
		return Rect.XYWH(0, 0, width, height - linesplit - lineheight)
	}

	static DEFAULT() {
		let font = new Font()
		let str = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789.,<=>◼◻+-*/()\n[]{}~\'\"?:;_!@#$%^&→'
		str.split('').forEach((id) => {
			font.add(id, Char.DEFAULT(id))
		})
		return font
	}
}

export function get_RichTextRect(array, split = 1, lineheight = 0, linesplit = 1) {
	let startx = 0
	let starty = 0
	let width = 0
	let height = 0
	array.forEach((item) => {
		let content = item[0]
		let style = item[1]
		let rect = Rect.XYWH(0, 0, 0, 0)
		if (content === undefined) {
			startx = 0
			starty += height + linesplit + lineheight
			height = 0
			return
		}
		if (typeof (content) === 'string') {
			let font = DEFAULT_FONT
			let split = 1
			let lineheight = 0
			let linesplit = 1
			let border = 0
			if (style !== undefined) {
				if (style.font !== undefined) font = style.font
				if (style.split !== undefined) split = style.split
				if (style.lineheight !== undefined) lineheight = style.lineheight
				if (style.linesplit !== undefined) linesplit = style.linesplit
				if (style.border !== undefined) border = style.border
			}
			rect = font.get_MultiStringRect(content, split, lineheight, linesplit)
			rect.size.x += border * 2
			rect.size.y += border * 2
		}
		else if (content instanceof Array) {
			// console.log(content)
			rect = get_RichTextRect(content)
		}
		else if (content instanceof Sprite) {
			let scale = 1
			if (style !== undefined) {
				if (style.scale !== undefined) scale = style.scale
			}
			rect = content.get_Rect(scale)
		}
		if (item[3] !== undefined && item[3] !== null) {
			startx += item[3] + split
		}
		else {
			startx += rect.size.x + split
		}
		if (item[4] !== undefined && item[4] !== null) {
			height = Math.max(item[4], height)
		}
		else {
			height = Math.max(rect.size.y, height)
		}
		width = Math.max(startx - split, width)
	})
	return Rect.XYWH(0, 0, width, starty + height + lineheight)
}

export class Buffer {
	constructor(width, height, transparent = false) {
		this.width = width
		this.height = height
		this.buffer = new ImageData(this.width, this.height)
		this.blendstyle = 0
		if (!transparent) {
			for (let i = 0; i < width; i++) {
				for (let j = 0; j < height; j++) {
					let id = (j * width + i) * 4
					this.buffer.data[id + 3] = 255
				}
			}
		}
	}

	fill(color) {
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				this.set_Pixel(i, j, color, 1)
			}
		}
	}

	fill_Rect(x, y, width, height, color) {
		for (let i = x; i < x + width; i++) {
			for (let j = y; j < y + height; j++) {
				this.set_Pixel(i, j, color)
			}
		}
	}

	get_Pixel(x, y) {
		let id = (y * this.width + x) * 4
		return new Color(this.buffer.data[id + 0], this.buffer.data[id + 1], this.buffer.data[id + 2], this.buffer.data[id + 3] / 255 * 100)
	}

	set_Pixel(x, y, color, blendstyle) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) return
		let r = 0
		let g = 0
		let b = 0
		let id = (y * this.width + x) * 4
		if (blendstyle === undefined) blendstyle = this.blendstyle
		switch (blendstyle) {
			case 1:
				r = color.r
				g = color.g
				b = color.b
				this.buffer.data[id + 3] = color.a * 255
				break
			default:
				let one_a = 1 - color.a
				r = this.buffer.data[id + 0] * one_a + color.r * color.a
				g = this.buffer.data[id + 1] * one_a + color.g * color.a
				b = this.buffer.data[id + 2] * one_a + color.b * color.a
				break
		}

		this.buffer.data[id + 0] = r
		this.buffer.data[id + 1] = g
		this.buffer.data[id + 2] = b
		// console.log(">>")
	}
}

// 3d
export class Camera {
	constructor(position = new Vector3()) {
		this.position = position
	}
}
//************************************
//           Engine Obj
//************************************
class Renderer {
	constructor(width, height) {
		this.canvas = document.createElement('canvas')
		this.canvas.style.imageRendering = 'pixelated'
		this.canvas.style.cursor = 'none'
		this.canvas.width = width
		this.canvas.height = height
		this.canvas_context = this.canvas.getContext("2d")
		this.size = new Vector2(width, height)
		this.buffer = new Buffer(this.size.x, this.size.y)
		this.time = 0
		this.render_target = this.buffer

		// 3d
		this.near = 0.1
		this.far = 10000
		this.fov = 90
		this.aspect_ratio = height / width
		this.fov_rad = 1 / Math.tan(this.fov / 2 / 180 * Math.PI)
		this.projection_matrix = new Matrix4([
			[this.aspect_ratio * this.fov_rad, 0, 0, 0],
			[0, this.fov_rad, 0, 0],
			[0, 0, this.far / (this.far - this.near), 1],
			[0, 0, (-this.far * this.near) / (this.far - this.near), 0]])
	}

	put_Buffer() {
		this.canvas_context.putImageData(this.buffer.buffer, 0, 0)
	}

	set_RenderTarget(buffer) {
		if (buffer instanceof Buffer) {
			this.render_target = buffer
		}
		else {
			throw new Error("set_RenderTarget needs a Buffer Instance")
		}
	}

	draw_Buffer(x, y, buffer) {
		for (let i = 0; i < buffer.width; i++) {
			for (let j = 0; j < buffer.height; j++) {
				// console.log(buffer.get_Pixel(i, j))
				this.draw_Pixel(i + x, j + y, buffer.get_Pixel(i, j))
			}
		}
	}

	get_Canvas() {
		return this.canvas
	}

	clear(color = Color.COLOR('BLACK')) {
		this.buffer.fill(color)
	}

	draw_Pixel(x, y, color) {
		x = Math.round(x)
		y = Math.round(y)
		this.render_target.set_Pixel(x, y, color)
		return Rect.XYWH(x, y, 1, 1)
	}

	draw_Line(start, end, color) {
		// this.canvas_context.beginPath()
		// this.canvas_context.moveTo(start.x, start.y)
		// this.canvas_context.lineTo(end.x, end.y)
		// this.canvas_context.lineWidth = width
		// this.canvas_context.strokeStyle = color.get_Color()
		// this.canvas_context.stroke()
		start = new Vector2(Math.round(start.x), Math.round(start.y))
		end = new Vector2(Math.round(end.x), Math.round(end.y))

		let x, y, dx, dy, dx1, dy1, px, py, xe, ye
		dx = end.x - start.x
		dy = end.y - start.y
		dx1 = Math.abs(dx)
		dy1 = Math.abs(dy)
		px = 2 * dy1 - dx1
		py = 2 * dx1 - dy1
		if (dy1 <= dx1) {
			if (dx >= 0) {
				x = start.x
				y = start.y
				xe = end.x
			}
			else {
				x = end.x
				y = end.y
				xe = start.x
			}

			this.draw_Pixel(x, y, color);

			for (let i = 0; x < xe; i++) {
				x = x + 1;
				if (px < 0)
					px = px + 2 * dy1;
				else {
					if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) y = y + 1; else y = y - 1;
					px = px + 2 * (dy1 - dx1);
				}
				this.draw_Pixel(x, y, color);
			}
		}
		else {
			if (dy >= 0) {
				x = start.x
				y = start.y
				ye = end.y
			}
			else {
				x = end.x
				y = end.y
				ye = start.y
			}

			this.draw_Pixel(x, y, color);

			for (let i = 0; y < ye; i++) {
				y = y + 1;
				if (py <= 0)
					py = py + 2 * dx1;
				else {
					if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) x = x + 1; else x = x - 1;
					py = py + 2 * (dx1 - dy1);
				}
				this.draw_Pixel(x, y, color);
			}
		}
	}

	draw_Line_MidPoint(start, end, color) {
		if (start.x >= end.x) {
			let tempx = start.x
			let tempy = start.y
			start.x = end.x
			end.x = tempx
			start.y = end.y
			end.y = tempy
		}
		let a = start.y - end.y
		let b = end.x - start.x
		let d = a + a + b
		let delta1 = a + a
		let delta2 = a + a + b + b
		let x = start.x
		let y = start.y
		this.draw_Pixel(x, y, color)
		while (x <= end.x) {
			if (d < 0) {
				x++
				y++
				d += delta2
			}
			else {
				x++
				d += delta1
			}
			this.draw_Pixel(x, y, color)
		}
	}

	draw_TriFace(face, color = Color.COLOR('WHITE')) {
		this.draw_Line(face.p1, face.p2, color)
		this.draw_Line(face.p2, face.p3, color)
		this.draw_Line(face.p1, face.p3, color)
	}

	fill_TriFace(faces, color = Color.COLOR('WHITE')) {
		// 先按 y 排序
		let t0 = faces.p1
		let t1 = faces.p2
		let t2 = faces.p3

		if (t0.y > t1.y) {
			let c = t0
			t0 = t1
			t1 = c
		}
		if (t0.y > t2.y) {
			let c = t0
			t0 = t2
			t2 = c
		}
		if (t1.y > t2.y) {
			let c = t1
			t1 = t2
			t2 = c
		}

		// std::cout<< t0.y << t1.y << t2.y << std::endl;
		// 递增 y 画点
		let total_height = t2.y - t0.y

		for (let y = (t0.y); y <= (t1.y); y++) {
			// 两条直线一起画
			// 由于 segment_height 可能为 0 所以我们加 1
			let segment_height = t1.y - t0.y
			if (segment_height === 0) {
				break
			}
			let alpha = (y - t0.y) / segment_height
			let beta = (y - t0.y) / total_height
			let A = t0.x + (t1.x - t0.x) * alpha
			let B = t0.x + (t2.x - t0.x) * beta

			if (A > B) {
				let c = A
				A = B
				B = c
			}

			A = Math.floor(A)
			B = Math.ceil(B)
			// console.log(A, B)
			// 连接两个点
			for (let x = A; x <= B; x++) {
				// console.log(A, B)
				this.draw_Pixel(x, y, color)
				// console.log(x,)
			}

		}
		// 画第二部分
		for (let y = (t1.y); y <= (t2.y); y++) {
			// 两条直线一起画
			let segment_height = t2.y - t1.y
			if (segment_height === 0) {
				break
			}
			let alpha = (y - t1.y) / segment_height
			let beta = (y - t0.y) / total_height
			let A = t1.x + (t2.x - t1.x) * alpha
			let B = t0.x + (t2.x - t0.x) * beta

			if (A > B) {
				let c = A
				A = B
				B = c
			}
			A = Math.floor(A)
			B = Math.ceil(B)
			// 连接两个点
			for (let x = A; x <= B; x++) {
				this.draw_Pixel(x, y, color)
			}
		}
	}

	draw_Mesh(mesh, camera, shade = true) {
		let angle = this.time * 0.001
		let rx = new Matrix4([
			[1, 0, 0, 0],
			[0, Math.cos(angle), -Math.sin(angle), 0],
			[0, Math.sin(angle), Math.cos(angle), 0],
			[0, 0, 0, 0]])
		let rz = new Matrix4([
			[Math.cos(angle), -Math.sin(angle), 0, 0],
			[Math.sin(angle), Math.cos(angle), 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0]])
		let sortedfaces = mesh.faces.map((face) => {
			// console.log(face.normal)
			// if (face.normal.z <= 0) return
			let rf1 = face.p1.x_mat4(rz).x_mat4(rx)
			let rf2 = face.p2.x_mat4(rz).x_mat4(rx)
			let rf3 = face.p3.x_mat4(rz).x_mat4(rx)

			let f1 = new Vector3(rf1.x, rf1.y, rf1.z + 3)
			let f2 = new Vector3(rf2.x, rf2.y, rf2.z + 3)
			let f3 = new Vector3(rf3.x, rf3.y, rf3.z + 3)


			return new TriFace(f1, f2, f3)
		})
		sortedfaces.sort((a, b) => {
			if ((a.p1.z + a.p2.z + a.p3.z) <= (b.p1.z + b.p2.z + b.p3.z)) {
				return 1
			}
			else {
				return -1
			}
		})
		sortedfaces.forEach((newface) => {

			if (newface.normal.dot(newface.p1.minus(camera.position)) >= 0) return

			let pf1 = newface.p1.x_mat4(this.projection_matrix)
			let pf2 = newface.p2.x_mat4(this.projection_matrix)
			let pf3 = newface.p3.x_mat4(this.projection_matrix)

			pf1.x += 1
			pf1.y += 1
			pf2.x += 1
			pf2.y += 1
			pf3.x += 1
			pf3.y += 1
			pf1.x *= this.size.x / 2
			pf1.y *= this.size.y / 2
			pf2.x *= this.size.x / 2
			pf2.y *= this.size.y / 2
			pf3.x *= this.size.x / 2
			pf3.y *= this.size.y / 2

			let projectface = new TriFace(pf1, pf2, pf3)
			let color
			if (shade) {
				let color1 = Color.RGB8(255, 0, 0)
				let color2 = Color.RGB8(0, 255, 0)
				let color3 = Color.RGB8(0, 0, 255)
				color1.r = Math.round(newface.normal.dot(new Vector3(0, 1, 0)) * color1.r)
				color1.g = Math.round(newface.normal.dot(new Vector3(0, 1, 0)) * color1.g)
				color1.b = Math.round(newface.normal.dot(new Vector3(0, 1, 0)) * color1.b)
				color2.r = Math.round(newface.normal.dot(new Vector3(1, 0, 0)) * color2.r)
				color2.g = Math.round(newface.normal.dot(new Vector3(1, 0, 0)) * color2.g)
				color2.b = Math.round(newface.normal.dot(new Vector3(1, 0, 0)) * color2.b)
				color3.r = Math.round(newface.normal.dot(new Vector3(0, 0, -1)) * color3.r)
				color3.g = Math.round(newface.normal.dot(new Vector3(0, 0, -1)) * color3.g)
				color3.b = Math.round(newface.normal.dot(new Vector3(0, 0, -1)) * color3.b)
				color = Color.ADD(color1, color2)
				color = Color.ADD(color, color3)
			}

			this.fill_TriFace(projectface, color)
			// this.draw_TriFace(projectface, color)
		})
	}

	draw_Rect(rect, color) {
		this.buffer.fill_Rect(rect.position.x, rect.position.y, rect.size.x, rect.size.y, color)
		return rect
	}

	draw_Sprite(x, y, sprite, scale = 1) {
		for (let i = 0; i < sprite.height; i++) {
			for (let j = 0; j < sprite.width; j++) {
				this.draw_Rect(Rect.XYWH(x + j * scale, y + i * scale, scale, scale), sprite.image[i][j])
				// this.draw_Pixel(x + j, y + i, sprite.image[i][j])
			}
		}
		return Rect.XYWH(x, y, sprite.width * scale, sprite.height * scale)
	}

	draw_Char(x, y, char, color) {
		// console.log(char)
		for (let i = 0; i < char.pointarray.length; i++) {
			let row = char.pointarray[i]
			for (let j = 0; j < row.length; j++) {
				if (row[j]) {
					this.draw_Pixel(x + j - char.shiftleft, y + i - char.shiftup, color)
				}
			}
		}
		return Rect.XYWH(x, y, char.width, char.height)
	}

	draw_String(x, y, string, font, color = Color.COLOR('WHITE'), split = 1, lineheight = 0, border = 0, backgroundcolor = null) {
		if (string === '') return
		let lastx = 0
		let rect = font.get_StringRect(string, split, lineheight)
		if (backgroundcolor !== null) {
			this.draw_Rect(Rect.XYWH(x, y, rect.size.x + border * 2, rect.size.y + border * 2), backgroundcolor)
		}
		string.split('').forEach((id, idx) => {
			if (id === ' ') {
				lastx += font.space + split
				return
			}
			if (id === '\t') {
				let nearx = 0
				if (lastx % (font.space * font.tab) === 0) {
					nearx = (Math.ceil(lastx / font.space / font.tab) + 1) * font.space * font.tab
				}
				else {
					nearx = Math.ceil(lastx / font.space / font.tab) * font.space * font.tab
				}
				lastx = nearx + split
				return
			}
			let char = font.get(id)
			this.draw_Char(x + border + lastx, y + lineheight + border, char, color)
			lastx += char.width + split
		})
		return Rect.XYWH(x, y, rect.size.x + border * 2, rect.size.y + border * 2)
	}

	draw_MultiString(x, y, string, font, color = Color.COLOR('WHITE'), split = 1, lineheight = 0, linesplit = 1, border = 0, backgroundcolor = null, linebackgroundcolor = null) {
		let lines = string.split('\n')
		let starty = 0
		let rect = font.get_MultiStringRect(string, split, lineheight, linesplit)
		// if (string === ' ') console.log(rect)
		if (backgroundcolor !== null) {
			this.draw_Rect(Rect.XYWH(x, y, rect.size.x + border * 2, rect.size.y + lineheight + border * 2), backgroundcolor)
			// console.log(">>>>", string, rect)
		}
		lines.forEach((line) => {
			if (line === '') {
				starty += font.returnheight + lineheight + linesplit
				return
			}
			let height = font.get_StringRect(line).size.y
			this.draw_String(x, y + starty, line, font, color, split, lineheight, border, linebackgroundcolor)
			starty += height + lineheight + linesplit
		})
		return Rect.XYWH(x, y, rect.size.x + border * 2, rect.size.y + border * 2 + lineheight)
	}

	draw_Richtext(x, y, array, split = 1, lineheight = 0, linesplit = 1) {
		let startx = 0
		let starty = 0
		let width = 0
		let height = 0
		array.forEach((item) => {
			let content = item[0]
			let style = item[1]
			let rect = Rect.XYWH(0, 0, 0, 0)
			if (item[2] !== undefined) {
				style = Object.assign(style, (item[2])(this.time))
			}
			if (content === undefined) {
				startx = 0
				starty += height + linesplit + lineheight
				height = 0
				return
			}
			if (typeof (content) === 'string') {
				let font = DEFAULT_FONT
				let color = Color.COLOR('white')
				let split = 1
				let lineheight = 0
				let linesplit = 1
				let border = 0
				let backgroundcolor = null
				let linebackgroundcolor = null
				let offest = new Vector2(0, 0)
				if (style !== undefined) {
					if (style.font !== undefined) font = style.font
					if (style.color !== undefined) color = style.color
					if (style.split !== undefined) split = style.split
					if (style.lineheight !== undefined) lineheight = style.lineheight
					if (style.linesplit !== undefined) linesplit = style.linesplit
					if (style.border !== undefined) border = style.border
					if (style.backgroundcolor !== undefined) backgroundcolor = style.backgroundcolor
					if (style.linebackgroundcolor !== undefined) linebackgroundcolor = style.linebackgroundcolor
					if (style.offest !== undefined) offest = style.offest
				}
				rect = this.draw_MultiString(x + startx + offest.x, y + starty + offest.y, content, font, color, split, lineheight, linesplit, border, backgroundcolor, linebackgroundcolor)
				// this.draw_Rect(rect, Color.RGB8(255, 0, 0, 80))
			}
			else if (content instanceof Array) {
				let split = 1
				let lineheight = 0
				let linesplit = 1
				if (style !== undefined) {
					if (style.split !== undefined) split = style.split
					if (style.lineheight !== undefined) lineheight = style.lineheight
					if (style.linesplit !== undefined) linesplit = style.linesplit
				}
				rect = this.draw_Richtext(x + startx, y + starty, content, split, lineheight, linesplit)
				// this.draw_Rect(rect, Color.RGB8(255, 0, 0, 80))
			}
			else if (content instanceof Sprite) {
				rect = this.draw_Sprite(x + startx, y + starty, content, style.scale)
			}
			if (item[3] !== undefined && item[3] !== null) {
				startx += item[3] + split
			}
			else {
				startx += rect.size.x + split
			}
			if (item[4] !== undefined && item[4] !== null) {
				height = Math.max(item[4], height)
			}
			else {
				height = Math.max(rect.size.y, height)
			}
			width = Math.max(startx - split, width)
		})
		return Rect.XYWH(x, y, width, starty + height + lineheight)
	}
}

class MouseInput {
	constructor(canvas) {
		this.keymap = {}
		this.position = new Vector2(-1, -1)
		this.canvas = canvas

		this.on_mousemove = () => {
			this.mousemove(event)
		}

		this.on_mousedown = () => {
			this.mousedown(event)
		}

		this.on_mouseup = () => {
			this.mouseup(event)
		}

		this.on_mouseout = () => {
			this.mouseout(event)
		}


		this.canvas.get_Canvas().addEventListener('mousemove', this.on_mousemove)
		this.canvas.get_Canvas().addEventListener('mousedown', this.on_mousedown)
		this.canvas.get_Canvas().addEventListener('mouseup', this.on_mouseup)
		this.canvas.get_Canvas().addEventListener('mouseout', this.on_mouseout)
		this.canvas.get_Canvas().addEventListener('contextmenu', () => { event.returnValue = false; return false; })
	}

	mousemove(event) {
		let width = this.canvas.get_Canvas().width
		let height = this.canvas.get_Canvas().height
		let screenrect = this.canvas.get_Canvas().getBoundingClientRect()
		// console.log(event)
		this.position.x = Math.floor((event.x - screenrect.x) / screenrect.width * width)
		this.position.y = Math.floor((event.y - screenrect.y) / screenrect.height * height)
	}

	mousedown(event) {
		if (this.keymap[event.button] === undefined) {
			this.keymap[event.button] = {
				once: true
			}
		}
	}

	mouseup(event) {
		if (this.keymap[event.button] !== undefined) {
			delete this.keymap[event.button]
		}
	}

	mouseout(event) {
		this.keymap = {}
	}

	loopend() {
		for (let key in this.keymap) {
			this.keymap[key].once = false
		}
	}
}

const ASCII_CHAR = (' AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789.,<=>◼◻+-*/()[]{}~\'\"?:;_!@#$%^&').split('')

class KeyboardInput {
	constructor() {
		this.keymap = {}
		this.on_keydown = () => {
			this.keydown(event)
		}
		this.on_keyup = () => {
			this.keyup(event)
		}

		window.addEventListener('keydown', this.on_keydown)
		window.addEventListener('keyup', this.on_keyup)
	}

	keydown(event) {
		if (event.key === 'Tab') {
			event.preventDefault()
			event.returnValue = false
		}
		if (this.keymap[event.key] === undefined) {
			this.keymap[event.key] = {
				once: true,
				continue: true
			}
		}
		else {
			this.keymap[event.key].continue = true
		}
	}

	keyup(event) {
		if (this.keymap[event.key] !== undefined) {
			delete this.keymap[event.key]
		}
	}

	loopend() {
		for (let key in this.keymap) {
			this.keymap[key].continue = false
			this.keymap[key].once = false
		}
	}

	on_Once(id) {
		return this.keymap[id] !== undefined && this.keymap[id].once
	}

	on_Continue(id) {
		return this.keymap[id] !== undefined && this.keymap[id].continue
	}

}

export const DEFAULT_FONT = Font.DEFAULT()
const MOUSE_CURSOR = new Sprite([
	[Color.COLOR('black'), Color.COLOR('black'), Color.COLOR('black'), Color.COLOR('black'), Color.COLOR('black'), Color.COLOR('     ')],
	[Color.COLOR('black'), Color.COLOR('white'), Color.COLOR('white'), Color.COLOR('white'), Color.COLOR('black'), Color.COLOR('     ')],
	[Color.COLOR('black'), Color.COLOR('white'), Color.COLOR('white'), Color.COLOR('black'), Color.COLOR('black'), Color.COLOR('     ')],
	[Color.COLOR('black'), Color.COLOR('white'), Color.COLOR('black'), Color.COLOR('white'), Color.COLOR('black'), Color.COLOR('black')],
	[Color.COLOR('black'), Color.COLOR('black'), Color.COLOR('black'), Color.COLOR('black'), Color.COLOR('white'), Color.COLOR('black')],
	[Color.COLOR('     '), Color.COLOR('     '), Color.COLOR('     '), Color.COLOR('black'), Color.COLOR('black'), Color.COLOR('black')],])

export class sunConsole {
	constructor(width, height, clear = false, mouse = true) {
		this.cursor = mouse
		this.clear = clear
		this.Renderer = new Renderer(width, height)
		this.Mouse = new MouseInput(this.Renderer)
		this.Keyboard = new KeyboardInput()
		this.lasttimestep = 0
		this.call_GameLoop = (timestep) => {
			sunConsole.GAMELOOP(this, timestep)
		}
	}

	init(sunconsole) {

	}

	event() {

	}

	action(sunconsole, delta) {
		// console.log(delta)
	}

	render(sunconsole, delta) {
		this.Renderer.clear("#ff0000")
	}

	get_ConsoleDOM() {
		return this.Renderer.get_Canvas();
	}

	static GAMELOOP(sunconsole, timestep) {
		let delta = 0
		if (typeof (timestep) === 'number') {
			delta = timestep - sunconsole.lasttimestep
			sunconsole.lasttimestep = timestep
			sunconsole.Renderer.time = timestep

			sunconsole.event()
			sunconsole.action(sunconsole, delta)
			if (sunconsole.clear) {
				sunconsole.Renderer.clear()
			}
			sunconsole.render(sunconsole, delta)
			if (sunconsole.cursor) sunconsole.Renderer.draw_Sprite(sunconsole.Mouse.position.x - 1, sunconsole.Mouse.position.y - 1, MOUSE_CURSOR)
			sunconsole.Keyboard.loopend()
			sunconsole.Mouse.loopend()
			sunconsole.Renderer.put_Buffer()
		}
		requestAnimationFrame(sunconsole.call_GameLoop)
	}

	run() {
		this.init(this)
		sunConsole.GAMELOOP(this)
	}
}

