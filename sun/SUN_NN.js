import * as SUN from './GBsun.js'

const Font = SUN.Font.DEFAULT()

const WHITE = SUN.Color.COLOR('white')
const HIGHLIGHT = SUN.Color.PICO(10)
const FUNCTION = SUN.Color.PICO(14)
const TESTCOLOR = SUN.Color.RGB8(255, 255, 0, 20)

class Formula {
	constructor(args) {

	}

	get_Size(scale = 1) {
		return new SUN.Vector2(0, 0)
	}

	get_Align(scale = 1) {
		return new SUN.Vector2(0, 0)
	}

	draw(render, x, y, color = WHITE, scale = 1) {
		render.draw_Pixel(10, 10, color)
	}
}

export class FM_Text extends Formula {
	constructor(args, color) {
		super()
		this.text = args
		this.color = color
	}

	get_Size(scale = 1) {
		let size = Font.get_StringRect(this.text).size
		size.x *= scale
		size.y *= scale
		return size
	}

	draw(render, x, y, color = WHITE, scale = 1) {
		// let size = this.get_Size(scale)
		// render.draw_Rect(SUN.Rect.XYWH(Math.round(x), Math.round(y), size.x, size.y), TESTCOLOR)
		render.draw_String(x, y, this.text, Font, this.color || color)
	}
}

export class FM_DIV extends Formula {
	constructor(args) {
		super()
		this.top = args[0]
		this.bottom = args[1]
	}

	get_Size(scale = 1) {
		let size = new SUN.Vector2()
		let top = this.top.get_Size(scale)
		let bottom = this.bottom.get_Size(scale)
		size.x = Math.max(top.x, bottom.x) + 4
		size.y = top.y + bottom.y + 5
		return size
	}

	get_Align(scale = 1) {
		let size = new SUN.Vector2()
		let top = this.top.get_Size(scale)
		let bottom = this.bottom.get_Size(scale)
		size.y = top.y - bottom.y
		return size
	}

	draw(render, x, y, color = WHITE, scale = 1) {
		x = Math.round(x)
		y = Math.round(y)
		let size = new SUN.Vector2(0, 0)
		let top = this.top.get_Size(scale)
		let bottom = this.bottom.get_Size(scale)
		size.x = Math.max(top.x, bottom.x) + 4
		size.y = top.y + bottom.y + 5
		// render.draw_Rect(SUN.Rect.XYWH(x, y, size.x, size.y), SUN.Color.RGB8(255, 0, 0, 20))
		this.top.draw(render, x + Math.round((size.x - top.x) / 2), y, color, scale)
		render.draw_Line_DDA(x, y + top.y + 2, x + size.x - 1, y + top.y + 2, color)
		this.bottom.draw(render, x + (size.x - bottom.x) / 2, y + top.y + 5, color, scale)
	}
}

export class FM_BRACE extends Formula {
	constructor(args) {
		super()
		this.center = args
	}

	get_Size(scale = 1) {
		let size = new SUN.Vector2(0, 0)
		let center = this.center.get_Size(scale)
		size.x = (center.x + 8) * scale
		size.y = (center.y + 2) * scale
		return size
	}

	draw(render, x, y, color = WHITE, scale = 1) {
		x = Math.round(x)
		y = Math.round(y)
		let size = new SUN.Vector2(0, 0)
		let center = this.center.get_Size(scale)
		size.x = center.x + 8
		size.y = center.y + 2
		// render.draw_Rect(SUN.Rect.XYWH(x, y, size.x, size.y), SUN.Color.RGB8(255, 0, 0, 20))
		this.center.draw(render, x + 4, y + 1, color, scale)
		render.draw_Line_DDA(x, y + 2, x, y + size.y - 3, color)
		render.draw_Line_DDA(x + size.x - 1, y + 2, x + size.x - 1, y + size.y - 3, color)
		render.draw_Pixel(x + 1, y + 1, color)
		render.draw_Pixel(x + 2, y, color)
		render.draw_Pixel(x + size.x - 2, y + 1, color)
		render.draw_Pixel(x + size.x - 3, y, color)
		render.draw_Pixel(x + 1, y + size.y - 2, color)
		render.draw_Pixel(x + 2, y + size.y - 1, color)
		render.draw_Pixel(x + size.x - 2, y + size.y - 2, color)
		render.draw_Pixel(x + size.x - 3, y + size.y - 1, color)
	}
}

export class FM_List extends Formula {
	constructor(args, ypos = 1, split = 2) {
		super()
		let arr = [];
		args.forEach((i) => {
			if (i instanceof FM_List) {
				// console.log(i)
				arr = arr.concat(i.list)
			}
			else {
				arr.push(i)
			}
		})
		this.list = arr
		this.split = split
		this.ypos = ypos
	}

	get_Size(scale = 1) {
		let size = new SUN.Vector2(0, 0)
		let maxaligny = 0
		let start = 0
		let end = 0
		this.list.forEach((f) => {
			let fsize = f.get_Size(scale)
			let align = f.get_Align(scale)
			if (align.y / 2 - fsize.y / 2 < start) {
				start = align.y / 2 - fsize.y / 2
			}
			if (align.y / 2 + fsize.y / 2 > end) {
				end = align.y / 2 + fsize.y / 2
			}
			size.x += fsize.x + this.split
		})
		if (this.list.length > 0) {
			size.x -= this.split
		}
		size.y = Math.round(end - start)
		return size
	}

	// get_Align(scale) {
	// 	let size = new SUN.Vector2();
	// 	let maxaligny = 0
	// 	this.list.forEach((f) => {
	// 		let align = f.get_Align(scale)
	// 		maxaligny = Math.min(maxaligny, align.y)
	// 	})
	// 	size.y = maxaligny;
	// 	return size;
	// }

	draw(render, x, y, color = WHITE, scale = 1) {
		x = Math.round(x)
		y = Math.round(y)
		let size = this.get_Size(scale)
		{
			let start = 0
			let end = 0
			this.list.forEach((f) => {
				let fsize = f.get_Size(scale)
				let align = f.get_Align(scale)
				if (align.y / 2 - fsize.y / 2 < start) {
					start = align.y / 2 - fsize.y / 2
				}
				if (align.y / 2 + fsize.y / 2 > end) {
					end = align.y / 2 + fsize.y / 2
				}
				size.x += fsize.x + this.split
			})
			y += Math.round(start + size.y / 2)
			// render.draw_Rect(SUN.Rect.XYWH(Math.round(x), Math.round(y) + Math.round(start + size.y / 2), Math.round(size.x), Math.round(size.y)), TESTCOLOR)
		}
		let i = 0
		this.list.forEach((f) => {
			let fsize = f.get_Size(scale)
			let align = f.get_Align(scale)
			f.draw(render, x + i, Math.round((y + (size.y - fsize.y) / 2 - align.y / 2)), color, scale)
			i += this.split + fsize.x
		})
	}
}

export class FM_SQR extends Formula {
	constructor(args) {
		super()
		this.top = args[1]
		this.bottom = args[0]
	}

	get_Size(scale = 1) {
	}

	draw(render, x, y, color = WHITE, scale = 1) {
		let size = new SUN.Vector2(0, 0)
		let bottom = this.bottom.get_Size(scale)
		if (this.top) {
			let top = this.top.get_Size(scale)
			if (top.y < bottom.y / 2)
				this.top.draw(render, x - top.x - 3, y, color, scale)
			else {
				this.top.draw(render, x - top.x - 3, y + bottom.y / 2 - top.y, color, scale)
			}
		}

		size.x = bottom.x + 2
		// size.y = top.y + bottom.y + 5
		// render.draw_Rect(SUN.Rect.XYWH(x, y, size.x, size.y), TESTCOLOR)
		render.draw_Line_DDA(x, y, x + size.x, y, color)
		render.draw_Line_DDA(x, y, x - 3, y + bottom.y + 3, color)
		render.draw_Line_DDA(x - 3, y + bottom.y + 3, x - 6, y + bottom.y - 3, color)
		this.bottom.draw(render, x + (size.x - bottom.x) / 2 + 1, y + 3, color, scale)
	}
}

export class FM_POW extends Formula {
	constructor(args) {
		super()
		this.top = args[1]
		this.bottom = args[0]
	}

	get_Size(scale = 1) {
		let size = new SUN.Vector2(0, 0)
		let bottom = this.bottom.get_Size(scale)

		let top = this.top.get_Size(scale)

		size.x = bottom.x + top.x + 1
		size.y = top.y + bottom.y
		return size
	}

	get_Align(scale = 1) {
		let size = new SUN.Vector2()
		let top = this.top.get_Size(scale)
		let bottom = this.bottom.get_Size(scale)
		size.y = top.y
		return size
	}

	draw(render, x, y, color = WHITE, scale = 1) {
		let size = new SUN.Vector2(0, 0)
		let bottom = this.bottom.get_Size(scale)

		let top = this.top.get_Size(scale)

		size.x = bottom.x + top.x + 1
		size.y = top.y + bottom.y
		// render.draw_Rect(SUN.Rect.XYWH(x, y, size.x, size.y), TESTCOLOR)
		this.bottom.draw(render, x, y + top.y, color, scale)
		this.top.draw(render, x + bottom.x + 1, y, color, scale)
	}
}

let uid = 0;

export class NeuralLink {
	constructor(a, b, w, draw = true) {
		this.uid = uid++;
		this.from = a;
		this.to = b;
		this.w = w;
		this.dW = 0;
		this.draw = draw;
	}

	get_Value() {
		let val = this.from.get_Value();
		return this.w * val;
	}

	get_Function(once = false, expand = true) {
		if (once) {
			return new FM_List([new FM_Text(this.from.name ? this.from.name : ('N' + this.from.uid), HIGHLIGHT), new FM_Text('*'), new FM_Text('W', SUN.Color.PICO(8))])
		}
		let val = this.from.get_Function(false, expand);
		return new FM_List([val, new FM_Text('*'), new FM_Text('W' + this.uid, SUN.Color.PICO(8))]);
	}
}

export const SIGMOID = {
	f: (x) => {
		return 1 / (1 + Math.exp(-x));
	},
	dF: (x) => {
		let sigmoid = 1 / (1 + Math.exp(-x));
		return sigmoid * (1 - sigmoid);
	},
	func: (x, e) => {
		if (e) {
			return new FM_DIV([
				new FM_Text('1'),
				new FM_List([
					new FM_Text('1'),
					new FM_Text('+'),
					new FM_POW([
						new FM_Text('e'),
						new FM_List([new FM_Text('-'), new FM_BRACE(x)])
					])
				])
			])
		}
		else {
			return new FM_List([
				new FM_Text('Sigmoid', FUNCTION),
				new FM_BRACE(x)
			])
		}
	}
}

export const LINEAR = {
	f: (x) => {
		return x;
	},
	dF: (x) => {
		return 1;
	},
	func: (x, e) => {
		return x
	}
}

export const STEP = {
	f: (x) => {
		return x > 0 ? 1 : 0;
	},
	dF: (x) => {
		return 0;
	},
	func: (x, e) => {
		return new FM_List([
			new FM_Text('STEP', FUNCTION),
			new FM_BRACE(x)
		])
	}
}

export const RELU = {
	f: (x) => {
		return Math.max(0, x);
	},
	dF: (x) => {
		return x < 0 ? 0 : 1;
	},
	func: (x) => {
		return new FM_List([
			new FM_Text('max', FUNCTION),
			new FM_BRACE(new FM_List([
				new FM_Text('0,'),
				x
			]))
		])
	}
}

export const LEAKRELU = {
	f: (x) => {
		if (x < 0) return x / 2;
		return x;
	},
	dF: (x) => {
		return x < 0 ? 0.5 : 1;
	},
	func: (x) => {
		return new FM_List([
			new FM_Text('max', FUNCTION),
			new FM_BRACE(new FM_List([
				new FM_Text('0,'),
				x
			]))
		])
	}
}

export const TANH = {
	f: (x) => {
		return Math.tanh(x);
	},
	dF: (x) => {
		let e = Math.exp(x);
		let e1 = Math.exp(-x);
		return (e - e1) / (e + e1);
	},
	func: (x, e) => {
		return new FM_List([
			new FM_Text('tanh', FUNCTION),
			new FM_BRACE(x)
		])
	}
}

export class Neuron {
	constructor(name = undefined, layer = 0, activefunc = RELU, bias = 0) {
		this.uid = uid++;
		this.name = name;
		this.layer = layer;
		this.activefunc = activefunc.f;
		this.dActiveFunc = activefunc.dF;
		this.b = bias;
		this.activefuncFunc = activefunc.func;
		this.fromlist = [];
		this.tolist = [];
		this.value = 0;
		this.pos = [0, 0];
		this.forwarded = false;
		this.loss = null;
		this.dB = 0;
	}

	has_LinkTo(n) {
		for (let i = 0; i < this.tolist.length; i++) {
			let l = this.tolist[i];
			if (l.b === n) return true;
		}
		return false;
	}

	link(n, w = Math.random() > 0.5 ? 0.1 : -0.1, draw = true) {
		if (this.has_LinkTo(n)) return;
		let l = new NeuralLink(this, n, w, draw);
		this.tolist.push(l);
		n.fromlist.push(l);
	}

	get_Value() {
		if (this.forwarded) return this.value;
		// console.log(this.name, "calcu!!")
		if (this.layer === 0) {
			this.forwarded = true;
			return this.value;
		}
		else {
			let val = 0;
			this.fromlist.forEach((link) => {
				val += link.get_Value();
			})
			this.forwarded = true;
			return this.value = this.activefunc(val + this.b);
		}
	}

	get_Function(once = false, expand = true) {
		if (this.fromlist.length === 0) {
			return new FM_Text(this.name ? this.name : ('N' + this.uid), HIGHLIGHT);
		}
		else {
			let val = [];
			this.fromlist.forEach((link, idx, arr) => {
				val.push(link.get_Function(once, expand));
				val.push(new FM_Text('+'));
			})
			val.push(new FM_Text('B' + this.uid, SUN.Color.PICO(11)))
			return this.activefuncFunc(new FM_List(val), expand);
		}
	}

	set_Value(val) {
		this.value = val;
	}
}

export class MoreNeuron {
	constructor(text = ".", layer) {
		this.value = text;
		this.uid = uid++;
		this.name = text;
		this.layer = layer;
		this.tolist = [];
	}
}

export function forward(ns, input = {}) {
	ns.forEach((nl) => {
		nl.forEach((n) => {
			n.forwarded = false;
		})
	})
	if (ns[0]) {
		ns[0].forEach((n, i) => {
			if (input[n.name] !== undefined) {
				n.set_Value(input[n.name])
			}
		})
	}
	let out = {}
	ns[ns.length - 1].forEach((n) => {
		out[n.name] = n.get_Value();
	})
	return out;
}

export class Optimizer {
	constructor() {

	}

	init(ns) {

	}

	next(ns) {

	}
}

export class GradientDescent extends Optimizer {
	constructor(learning_rate = 0.001) {
		super();
		this.learning_rate = learning_rate;
		// this.a = a;
		// this.last = {};
	}

	next(ns) {
		ns.forEach((nl) => {
			nl.forEach((n) => {
				n.b -= n.dB * this.learning_rate;
				n.tolist.forEach((l) => {
					l.w -= l.dW * this.learning_rate;
				})
			})
		})
	}
}

export class Momentum extends Optimizer {
	constructor(learning_rate = 0.001, a = 0.8) {
		super();
		this.learning_rate = learning_rate;
		this.a = a;
		this.last = {};
	}

	init(ns) {
		ns.forEach((nl) => {
			nl.forEach((n) => {
				this.last[n.uid] = 0;
				n.tolist.forEach((l) => {
					this.last[l.uid] = 0;
				})
			})
		})
		// console.log(this)
	}

	next(ns) {
		ns.forEach((nl) => {
			nl.forEach((n) => {
				// console.log(n.dB)
				let dB = this.last[n.uid] * this.a + n.dB * this.learning_rate;
				// console.log(this.last[n.uid], this.a, n.dB, this.learning_rate)
				n.b -= dB;
				this.last[n.uid] = dB;
				n.tolist.forEach((l) => {
					let dW = this.last[l.uid] * this.a + l.dW * this.learning_rate;
					l.w -= dW;
					this.last[l.uid] = dW;
				})
			})
		})
	}
}

export class BatchMomentum extends Optimizer {
	constructor(learning_rate = 0.001, a = 0.8, patchsize = 20) {
		super();
		this.learning_rate = learning_rate;
		this.a = a;
		this.last = {};
		this.sum = {};
		this.patchsize = patchsize;
		this.current = 0;
	}

	init(ns) {
		ns.forEach((nl) => {
			nl.forEach((n) => {
				this.last[n.uid] = 0;
				this.sum[n.uid] = 0;
				n.tolist.forEach((l) => {
					this.last[l.uid] = 0;
					this.sum[l.uid] = 0;
				})
			})
		})
		// console.log(this)
	}

	next(ns) {
		this.current++;
		if (this.current < this.patchsize) {
			ns.forEach((nl) => {
				nl.forEach((n) => {
					let dB = n.dB;
					this.sum[n.uid] += dB;
					n.tolist.forEach((l) => {
						let dW = l.dW;
						this.sum[l.uid] += dW;
					})
				})
			})
		}
		else {
			ns.forEach((nl) => {
				nl.forEach((n) => {
					this.sum[n.uid] += n.dB;
					let dB = this.last[n.uid] * this.a + this.sum[n.uid] / this.patchsize * this.learning_rate;
					this.sum[n.uid] = 0;
					n.b -= dB;
					this.last[n.uid] = dB;
					n.tolist.forEach((l) => {
						this.sum[l.uid] += l.dW;
						let dW = this.last[l.uid] * this.a + this.sum[l.uid] / this.patchsize * this.learning_rate;
						this.sum[l.uid] = 0;
						l.w -= dW;
						this.last[l.uid] = dW;
					})
				})
			})
			this.current = 0;
		}
	}
}

export function backpropagation(ns, input = {}, wanted = {}, optimizer, loss, dloss) {
	if (!optimizer) throw new Error('Optimizer is not defined');
	// forward update the output // get output object

	let out = forward(ns, input);

	if (!loss) {
		// loss = (O1-A1)^2+(O2-A2)^2+...+(On-An)^2
		loss = (out, wanted) => {
			let l = 0;
			for (let key in out) {
				if (wanted[key] === undefined) throw new Error("no wanted val on " + key);
				l += (out[key] - wanted[key]) ** 2;
			}
			return l;
		}
		dloss = (out_n, wanted_n) => {
			return 2 * (out_n - wanted_n)
		}
	}

	// output layer adjust
	ns[ns.length - 1].forEach((n) => {
		let val = n.get_Value();
		let dLoss_N = dloss(n.get_Value(), wanted[n.name]);
		// ActiveFunc(Out) = ActiveFunc(h*w+h*w+...+h*w+b)
		let dN_B = n.dActiveFunc(val);
		n.loss = dLoss_N;
		n.dB = dLoss_N * dN_B;
		n.fromlist.forEach((l) => {
			let dN_W = n.dActiveFunc(val) * l.from.get_Value();
			l.dW = dLoss_N * dN_W;
			// console.log(l.from.name + "-" + l.to.name, 'dW', l.dW);
		})

		for (let i = ns.length - 2; i > 0; i--) {
			let layer = ns[i];
			layer.forEach((n) => {
				let val = n.get_Value();
				// dLoss_N1 N1 = ActiveFunc(N*W + ... + b)
				let dLoss_N = 0;
				n.tolist.forEach((l) => {
					let dLoss_N1 = l.to.loss;
					let dN1_N = l.to.dActiveFunc(l.to.get_Value()) * l.w;
					// console.log(n.name, dN1_N)
					dLoss_N += dLoss_N1 * dN1_N;
				})
				n.loss = dLoss_N;
				let dN_B = n.dActiveFunc(val);
				n.dB = dLoss_N * dN_B;
				n.fromlist.forEach((l) => {
					let dN_W = n.dActiveFunc(val) * l.from.get_Value();
					l.dW = dLoss_N * dN_W;
				})
			})
		}
	})

	// gradient descent
	optimizer.next(ns);

	return [out, loss(out, wanted)];
}

export function draw_NN(x, y, j, i, r, render, ns, maxsize, title = true, b = true, w = true, showb = false, showw = false) {
	x += r
	y += r
	maxsize = (maxsize) * i + 2 * r
	let pos = {}
	ns.forEach((nl, h) => {
		let posx = x
		let thissize = r * 2 + (nl.length - 1) * i
		let posy = y + (maxsize - thissize) / 2
		nl.forEach((n, k) => {
			let tx = posx + h * j
			let ty = posy + k * i

			let str = (n instanceof Neuron) ? (Math.round(n.value * 100) / 100).toString() : n.value;
			let rect = SUN.DEFAULT_FONT.get_StringRect(str)
			// let radius = Math.max(r, Math.round((rect.size.x + 4) / 2))
			let radius = r
			// console.log(rect)
			// console.log(radius)
			if (n instanceof Neuron)
				render.draw_Circle(tx, ty, radius, WHITE)
			render.draw_String(Math.round(tx - rect.size.x / 2), Math.round(ty - rect.size.y / 2), str, SUN.DEFAULT_FONT)
			n.r = radius
			n.pos = [tx, ty]
		})
	})
	r++
	ns.forEach((nl) => {
		nl.forEach((n) => {
			if (!(n instanceof Neuron)) return
			r = n.r
			if (title) {
				let name = n.name ? n.name : 'N' + n.uid
				let rect2 = SUN.DEFAULT_FONT.get_StringRect(name)
				render.draw_String(Math.round(n.pos[0] - rect2.size.x / 2), Math.round(n.pos[1] - r - rect2.size.y - 3), name, SUN.DEFAULT_FONT, HIGHLIGHT)
			}
			if (n.layer !== 0 && (n instanceof Neuron)) {
				let name = showb ? ('B' + n.uid) : (Math.round(n.b * 100) / 100).toString()
				let rect2 = SUN.DEFAULT_FONT.get_StringRect(name)
				if (b)
					render.draw_String(Math.round(n.pos[0] - rect2.size.x / 2), Math.round(n.pos[1] + r + 3), name, SUN.DEFAULT_FONT)
			}
			n.tolist.forEach((l) => {
				if (!l.draw) return;
				let percent = SUN.Fn.clamp(SUN.Fn.percent(-1, 1, l.w), 0, 1)
				let color = SUN.Color.RGB(1 - percent, percent, 0)
				let dir = (new SUN.Vector2(l.to.pos[0] - l.from.pos[0], l.to.pos[1] - l.from.pos[1])).normalize()
				render.draw_Line_DDA(l.from.pos[0] + dir.x * r, l.from.pos[1] + dir.y * r, l.to.pos[0] - dir.x * r, l.to.pos[1] - dir.y * r, color)
				if (w) {
					let str = showw ? ('W' + l.uid) : (Math.round(l.w * 100) / 100).toString()
					let rect = SUN.DEFAULT_FONT.get_StringRect(str)
					let tx = (l.from.pos[0] + dir.x * r) * 2 + (l.to.pos[0] - dir.x * r)
					let ty = (l.from.pos[1] + dir.x * r) * 2 + (l.to.pos[1] - dir.x * r)
					render.draw_String(Math.round(tx / 3 - rect.size.x / 2), Math.round(ty / 3 - rect.size.y / 2), str, SUN.DEFAULT_FONT)
				}
			})
		})
	})
}

export function get_NN(ns) {
	let layer = {};
	ns.forEach((n) => {
		if (layer[n.layer]) {
			layer[n.layer].push(n)
		}
		else
			layer[n.layer] = [n]
	})
	let layerarr = [];
	let maxsize = 0;
	for (let key in layer) {
		maxsize = Math.max(maxsize, (layer[key].length - 1))
		layerarr.push(layer[key])
	}
	layerarr.sort((a, b) => {
		return a[0].layer > b[0].layer ? 1 : 0
	})
	return [layerarr, maxsize]
}

export function save_NN(nn) {
	let ans = [];
	for (let i = 1; i < nn.length; i++) {
		let layer = nn[i];
		ans.push(layer.map((n) => {
			let data = {
				b: n.b,
				fromw: n.fromlist.map((l) => l.w)
			}
			return data
		}))
	}
	return ans;
}

export function load_NN(nn, weights) {
	for (let i = 1; i < nn.length; i++) {
		let layer = nn[i];
		layer.forEach((n, j) => {
			n.b = weights[i - 1][j].b
			n.fromlist.forEach((l, k) => {
				l.w = weights[i - 1][j].fromw[k]
			})
		})
	}
}