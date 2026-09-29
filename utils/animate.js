// Dependencies: utils/math.js, utils/rate_funcs.js, utils/utils.js

class CancellationToken {
	constructor() {
		this.controller = new AbortController();
	}

	get signal() {
		return this.controller.signal;
	}

	get cancelled() {
		return this.signal.aborted;
	}

	cancel() {
		if (!this.cancelled) {
			this.controller.abort();
		}
	}

	onCancel(callback) {
		if (this.cancelled) {
			callback();
			return function() {};
		}

		const onAbort = () => callback();
		this.signal.addEventListener('abort', onAbort, {once: true});
		return () => this.signal.removeEventListener('abort', onAbort);
	}
}

const Animate = {

	/*
	params: {
		scaleFrom: number, scaleTo: number,
		shiftFrom: Vector3, shiftTo: vector3,
		rotateFrom: number, rotateTo: number,
		center: Vector3, runTime: number, rateFunc: function,
		cancelToken: CancellationToken | null
	}
	*/

	DEFAULT_PARAMS: {
		scaleFrom: 1, scaleTo: 1,
		shiftFrom: ORIGIN, shiftTo: ORIGIN,
		rotateFrom: 0, rotateTo: 0,
		center: ORIGIN, runTime: 1000, rateFunc: RateFuncs.easeInOutCubic,
		cancelToken: null
	},

	fillDefault: function(params = {}) {
		for (let key in Animate.DEFAULT_PARAMS) {
			params[key] = params[key] != null ? params[key] : Animate.DEFAULT_PARAMS[key];
		}
	},

	// runTime: number, cancelToken: CancellationToken | null
	wait: function(runTime = 500, cancelToken = null) {
		return new Promise(resolve => {
			if (cancelToken?.cancelled) {
				resolve(true);
				return;
			}

			let settled = false;
			let removeCancelListener = null;
			const timeoutId = setTimeout(() => finish(false), Math.max(0, runTime));

			function finish(cancelled) {
				if (settled) return;
				settled = true;
				clearTimeout(timeoutId);
				removeCancelListener?.();
				resolve(cancelled);
			}

			removeCancelListener = cancelToken?.onCancel?.(() => finish(true));
		});
	},

	// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
	add: async function(e, params = {}) {
		e.opacity = e.opacity || (e.style.opacity || 1);
		e.style.opacity = e.opacity;
	},

	// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
	remove: async function(e, params = {}) {
		e.opacity = e.opacity || (e.style.opacity || 1);
		e.style.opacity = 0;
	},

	// e: HTMLElement, params: {} (see DEFAULT_PARAMS)
	// updateFunc: function(e: HTMLElement, progress: number, params: {}) -> void
	run: function(e, params = {}, updateFunc) {
		Animate.fillDefault(params);

		return new Promise((resolve, reject) => {
			const duration = Math.max(0, params.runTime);
			let startTime = null;
			let frameId = null;
			let progress = 0;
			let settled = false;
			let removeCancelListener = null;

			// cancelled: boolean, progress: number
			function finish(cancelled, progress) {
				if (settled) return;
				settled = true;
				if (frameId != null) cancelAnimationFrame(frameId);
				removeCancelListener?.();
				resolve({cancelled, progress});
			}

			function fail(error) {
				if (settled) return;
				settled = true;
				if (frameId != null) cancelAnimationFrame(frameId);
				removeCancelListener?.();
				reject(error);
			}

			// timestamp: DOMHighResTimeStamp
			function step(timestamp) {
				if (params.cancelToken?.cancelled) {
					finish(true, progress);
					return;
				}

				if (startTime == null) startTime = timestamp;
				progress = (duration == 0) ? 1 : Math.min((timestamp - startTime) / duration, 1);

				try {
					updateFunc(e, params.rateFunc(progress), params);
				} catch (error) {
					fail(error);
					return;
				}

				if (progress >= 1) {
					finish(false, 1);
				} else {
					frameId = requestAnimationFrame(step);
				}
			}

			if (params.cancelToken?.cancelled) {
				finish(true, 0);
				return;
			}

			removeCancelListener = params.cancelToken?.onCancel?.(() => finish(true, progress));
			frameId = requestAnimationFrame(step);
		});
	},

	// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
	fadeIn: function(e, params = {}) {
		Animate.fillDefault(params);

		e.opacity = e.opacity || (e.style.opacity || 1);
		let shift = Vector3.add(params.shiftTo, params.shiftFrom.scale(-1));
		let scale = params.scaleTo - params.scaleFrom;
		let rotate = params.rotateTo - params.rotateFrom;

		return Animate.run(e, params, (element, progress) => {
			element.style.transform =
				'translate(' + ((params.shiftFrom.x + shift.x * progress) * 64) + 'px, ' + (-(params.shiftFrom.y + shift.y * progress) * 64) + 'px) ' +
				'scale(' + (params.scaleFrom + scale * progress) + ') ' +
				'rotate(' + (params.rotateFrom + rotate * progress) + 'rad)';
			element.style.opacity = element.opacity * progress;
		});
	},

	// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
	fadeOut: function(e, params = {}) {
		Animate.fillDefault(params);

		e.opacity = e.opacity || (e.style.opacity || 1);
		let shift = Vector3.add(params.shiftTo, params.shiftFrom.scale(-1));
		let scale = params.scaleTo - params.scaleFrom;
		let rotate = params.rotateTo - params.rotateFrom;

		return Animate.run(e, params, (element, progress) => {
			element.style.transform =
				'translate(' + ((params.shiftFrom.x + shift.x * progress) * 64) + 'px, ' + (-(params.shiftFrom.y + shift.y * progress) * 64) + 'px)' +
				'scale(' + (params.scaleFrom + scale * progress) + ') ' +
				'rotate(' + (params.rotateFrom + rotate * progress) + 'rad)';
			element.style.opacity = element.opacity * (1 - progress);
		});
	},

	// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
	transform: function(e, params = {}) {
		Animate.fillDefault(params);

		let shift = Vector3.add(params.shiftTo, params.shiftFrom.scale(-1));
		let scale = params.scaleTo - params.scaleFrom;
		let rotate = params.rotateTo - params.rotateFrom;
		e.style.transformOrigin = 'calc(' + (params.center.x * 64) + 'px + 50%) calc(' + (-params.center.y * 64) + 'px + 50%)';

		return Animate.run(e, params, (element, progress) => {
			element.style.transform =
				'translate(' + ((params.shiftFrom.x + shift.x * progress) * 64) + 'px, ' + (-(params.shiftFrom.y + shift.y * progress) * 64) + 'px)' +
				'scale(' + (params.scaleFrom + scale * progress) + ') ' +
				'rotate(' + (params.rotateFrom + rotate * progress) + 'rad)';
		});
	},

	// e: HTMLDivElement, params: {anim: function, shift: Vector3, center: Vector3, runTime: number, rateFunc: function, runTimeOffset: number, cancelToken: CancellationToken | null}
	animate: async function(e, params = {}) {
		let offset = params.runTimeOffset || 0;
		if (params.cancelToken?.cancelled || (offset > 0 && await Animate.wait(offset, params.cancelToken))) {
			return {
				cancelled: true,
				progress: 0
			};
		}
		return await params.anim(e, params);
	},

	// group: Array[Array[HTMLDivElement, function, {params}]...], groupCancelToken: CancellationToken | null
	animateGroup: async function(group, groupCancelToken = null) {
		let cumulativeRunTimeOffset = 0;
		return await Promise.all(group.map(anim => {
			cumulativeRunTimeOffset += anim[2].runTimeOffset || 0;
			anim[2].runTimeOffset = cumulativeRunTimeOffset;
			if (groupCancelToken && !anim[2].cancelToken) {
				anim[2].cancelToken = groupCancelToken;
			}
			return Animate.animate(anim[0], {anim: anim[1], ...anim[2]});
		}));
	},

	// group: Array[HTMLDivElement...]
	animateGroupByIndex: async function(group = Array.from(document.querySelectorAll('[data-anim]'))) {
		// If [data-anim-index] is not specified, then it will play as the last index

		function splitAnimationGroup(group, index = 0) {
			let animArr;
			let minVal, maxVal;
			let noIndexArr = [];

			for (let e of group) {
				let indices = e.dataset.animIndex ? e.dataset.animIndex.split(',').map(e => eval(e)) : [];
				if (index < indices.length && indices[index] != null) {
					let i = indices[index];
					minVal = (minVal == null || i < minVal) ? i : minVal;
					maxVal = (maxVal == null || i > maxVal) ? i : maxVal;
				} else {
					noIndexArr.push(e);
				}
			}

			if (minVal != null) {
				maxVal -= minVal;
				animArr = Array.from({length: maxVal + 1}, () => []);

				for (let e of group) {
					let indices = e.dataset.animIndex ? e.dataset.animIndex.split(',').map(e => eval(e)) : [];
					if (index < indices.length) {
						let i = indices[index];
						animArr[i - minVal].push(e);
					}
				}
				if (noIndexArr.length) animArr.push(noIndexArr);

				for (let i in animArr) {
					let temp = splitAnimationGroup(animArr[i], index + 1);
					if (temp) animArr[i] = temp;
				}
				return animArr;
			} else if (noIndexArr.length) {
				return [noIndexArr];
			} else {
				return [];
			}
		}

		async function playAnimationGroup(group) {
			for (let e of group) {
				if (e[0].constructor.name == 'Array') {
					await playAnimationGroup(e);
				} else {
					let cumulativeRunTimeOffset = 0;
					await Promise.all(e.map(e => {
						cumulativeRunTimeOffset += e.dataset.animRunTimeOffset ? eval(e.dataset.animRunTimeOffset) : 0;
						if (e.dataset.anim) {
							return Animate.animate(e, {
								anim: eval(e.dataset.anim),
								scaleFrom: e.dataset.animScaleFrom ? eval(e.dataset.animScaleFrom) : null,
								scaleTo: e.dataset.animScaleTo ? eval(e.dataset.animScaleTo) : null,
								shiftFrom: e.dataset.animShiftFrom ? eval(e.dataset.animShiftFrom) : null,
								shiftTo: e.dataset.animShiftTo ? eval(e.dataset.animShiftTo) : null,
								rotateFrom: e.dataset.animRotateFrom ? eval(e.dataset.animRotateFrom) : null,
								rotateTo : e.dataset.animRotateTo ? eval(e.dataset.animRotateTo) : null,
								center: e.dataset.animCenter ? eval(e.dataset.animCenter) : null,
								runTime: e.dataset.animRunTime ? eval(e.dataset.animRunTime) : null,
								rateFunc: e.dataset.animRateFunc ? eval(e.dataset.animRateFunc) : RateFuncs.easeInOutCubic,
								runTimeOffset: cumulativeRunTimeOffset
							});
						}
					}));
				}
			}
		}

		let animArr = splitAnimationGroup(group.filter(e => e.dataset.anim));
		await playAnimationGroup(animArr);
	}

};
