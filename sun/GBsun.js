export const Fn = {
	clamp(n, min, max) {
		return Math.max(min, Math.min(max, n))
	}
}

// util Class
export class Vector2 {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}

export class Rect {
	constructor(position, size) {
		this.position = position
		this.size = size
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
						[0, 1, 1, 0],
						[1, 0, 1, 0],
						[1, 0, 1, 0],
						[1, 1, 0, 1]
					],
					-3, 0
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
						[1, 0, 0],
						[1, 0, 0],
						[1, 1, 0],
						[1, 0, 1],
						[1, 0, 1],
						[1, 1, 0]
					],
					-1, 0
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
						[0, 1, 1],
						[1, 0, 0],
						[1, 0, 0],
						[0, 1, 1]
					],
					-3, 0
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
						[0, 0, 1],
						[0, 0, 1],
						[0, 1, 1],
						[1, 0, 1],
						[1, 0, 1],
						[0, 1, 1]
					],
					-1, 0
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
			case 'M':
				return new Char(
					[
						[0, 1, 0, 1, 0],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 1, 0, 1],
						[1, 0, 0, 0, 1]
					],
					0, 0
				)
			case 'N':
				return new Char(
					[
						[0, 1, 1, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1]
					],
					0, 0
				)
			case 'O':
				return new Char(
					[
						[0, 1, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 1, 0]
					],
					0, 0
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
			case '\n':
				return new Char(
					[
						[0, 0, 1],
						[0, 0, 1],
						[1, 1, 1]
					],
					-4, 0
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
	constructor(space = 2) {
		this.charmap = {}
		this.space = space
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

	get_StringRect(string, split = 1) {
		let width = 0
		let height = 0
		string.split('').forEach((id, idx, arr) => {
			if (id === ' ') {
				width += this.space

			}
			else {
				let char = this.get(id)
				height = Math.max(height, char.height)
				width += char.width
			}

			if (idx !== arr.length - 1) {
				width += split
			}
		})
		return Rect.XYWH(0, 0, width, height)
	}

	static DEFAULT() {
		let font = new Font()
		let str = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789\n'
		str.split('').forEach((id) => {
			font.add(id, Char.DEFAULT(id))
		})
		return font
	}
}

//************************************
//           Engine Obj
//************************************
class Renderer {
	constructor(width, height) {
		this.canvas = document.createElement('canvas')
		this.canvas.style.imageRendering = 'pixelated'
		this.canvas.width = width
		this.canvas.height = height
		this.canvas_context = this.canvas.getContext("2d")
		this.size = new Vector2(width, height)
	}

	get_Canvas() {
		return this.canvas
	}

	clear(color = Color.COLOR('BLACK')) {
		this.canvas_context.fillStyle = color.get_Color()
		this.canvas_context.fillRect(0, 0, this.size.x, this.size.y)
	}

	draw_Pixel(x, y, color) {
		this.canvas_context.fillStyle = color.get_Color()
		this.canvas_context.fillRect(x, y, 1, 1)
	}

	draw_Rect(rect, color) {
		this.canvas_context.fillStyle = color.get_Color()
		this.canvas_context.fillRect(rect.position.x, rect.position.y, rect.size.x, rect.size.y)
	}

	draw_Sprite(x, y, sprite) {
		for (let i = 0; i < sprite.height; i++) {
			for (let j = 0; j < sprite.width; j++) {
				this.draw_Pixel(x + j, y + i, sprite.image[i][j])
			}
		}
	}

	draw_Char(x, y, char, color, background = false, backgroundcolor) {
		// console.log(char)
		if (background) {
			this.draw_Rect(Rect.XYWH(x, y, char.width, char.height), backgroundcolor)
		}
		for (let i = 0; i < char.pointarray.length; i++) {
			let row = char.pointarray[i]
			for (let j = 0; j < row.length; j++) {
				if (row[j]) {
					this.draw_Pixel(x + j - char.shiftleft, y + i - char.shiftup, color)
				}
			}
		}
	}

	draw_String(x, y, string, font, color, background = false, backgroundcolor, split = 1, lineheight = 0, border = 0) {
		if (string === '') return
		let lastx = 0
		let rect = font.get_StringRect(string)
		if (background) {
			this.draw_Rect(Rect.XYWH(x, y, rect.size.x + border * 2, rect.size.y + lineheight + border * 2), backgroundcolor)
		}
		string.split('').forEach((id, idx) => {
			if (id === ' ') {
				lastx += font.space + split
				return
			}
			let char = font.get(id)
			this.draw_Char(x + border + lastx, y + border - font.maxheight + rect.size.y + lineheight, font.get(id), color)
			lastx += char.width + split
		})
	}
}

class MouseInput {
	constructor(canvas) {
		this.position = new Vector2(-1, -1)
		this.canvas = canvas

		this.on_mousemove = () => {
			this.mousemove(event)
		}

		this.canvas.get_Canvas().addEventListener('mousemove', this.on_mousemove)
	}

	mousemove(event) {
		let width = this.canvas.get_Canvas().width
		let height = this.canvas.get_Canvas().height
		let screenrect = this.canvas.get_Canvas().getBoundingClientRect()
		// console.log(event)
		this.position.x = Math.floor((event.x - screenrect.x) / screenrect.width * width)
		this.position.y = Math.floor((event.y - screenrect.y) / screenrect.height * height)
	}
}

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
}

const DEFAULT_FONT = Font.DEFAULT()

export class sunConsole {
	constructor(width, height) {
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

	sys(sunconsole, delta) {
		// console.log(JSON.stringify(this.Keyboard.keymap))
		this.Renderer.draw_String(0, 0, "FPS " + Math.round(1000 / delta), DEFAULT_FONT, Color.COLOR('WHITE'), true, Color.PICO(5), 1, 0, 1)
		this.Keyboard.loopend()
	}

	get_ConsoleDOM() {
		return this.Renderer.get_Canvas();
	}

	static GAMELOOP(sunconsole, timestep) {
		let delta = 0
		if (typeof (timestep) === 'number') {
			delta = timestep - sunconsole.lasttimestep
			sunconsole.lasttimestep = timestep

			sunconsole.event()
			sunconsole.action(sunconsole, delta)
			sunconsole.render(sunconsole, delta)
			sunconsole.sys(sunconsole, delta)
		}
		requestAnimationFrame(sunconsole.call_GameLoop)
	}

	run() {
		this.init(this)
		sunConsole.GAMELOOP(this)
	}
}

