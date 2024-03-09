// Dependencies: utils/math.js, utils/rate_funcs.js, utils/utils.js

const Animate = {

/*
params: {
	scaleFrom: number, scaleTo: number,
	shiftFrom: Vector3, shiftTo: vector3,
 	rotateFrom: number, rotateTo: number,
 	center: Vector3, runTime: number, rateFunc: function
}
*/

DEFAULT_PARAMS : {
	scaleFrom: 1, scaleTo: 1,
	shiftFrom: ORIGIN, shiftTo: ORIGIN,
	rotateFrom: 0, rotateTo: 0,
	center: ORIGIN, runTime: 250, rateFunc: RateFuncs.easeInOutCubic
},

fillDefault : function (params = {}) {
	for (let key in Animate.DEFAULT_PARAMS) {
		params[key] = params[key] != null ? params[key] : Animate.DEFAULT_PARAMS[key];
	}
},

// runTime: number
wait : async function(runTime = 500) {
	await Utils.sleep(runTime);
},

// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
add : async function(e, params = {}) {
	e.opacity = e.opacity || (e.style.opacity || 1);
	e.style.opacity = e.opacity;
},

// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
remove : async function(e, params = {}) {
	e.opacity = e.opacity || (e.style.opacity || 1);
	e.style.opacity = 0;
},

// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
fadeIn : async function(e, params = {}) {
	Animate.fillDefault(params);

	e.opacity = e.opacity || (e.style.opacity || 1);
	let shift = Vector3.add(params.shiftTo, params.shiftFrom.scale(-1));
	let scale = params.scaleTo - params.scaleFrom;
	let rotate = params.rotateTo - params.rotateFrom;
	
	for (let i = 0; i <= params.runTime; i++) {
		e.style.transform =
			'translate(' + ((params.shiftFrom.x + shift.x * params.rateFunc(i / params.runTime)) * 64) + 'px, ' + (-(params.shiftFrom.y + shift.y * params.rateFunc(i / params.runTime)) * 64) + 'px) ' + 
			'scale(' + (params.scaleFrom + scale * params.rateFunc(i / params.runTime)) + ') ' + 
			'rotate(' + (params.rotateFrom + rotate * params.rateFunc(i / params.runTime)) + 'rad)';
		e.style.opacity = e.opacity * params.rateFunc(i / params.runTime);
		if (i != params.runTime) await Utils.sleep(1);
	}
},

// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
fadeOut : async function(e, params = {}) {
	Animate.fillDefault(params);
	
	e.opacity = e.opacity || (e.style.opacity || 1);
	let shift = Vector3.add(params.shiftTo, params.shiftFrom.scale(-1));
	let scale = params.scaleTo - params.scaleFrom;
	let rotate = params.rotateTo - params.rotateFrom;
	
	for (let i = 0; i <= params.runTime; i++) {
		e.style.transform =
			'translate(' + ((params.shiftFrom.x + shift.x * params.rateFunc(i / params.runTime)) * 64) + 'px, ' + (-(params.shiftFrom.y + shift.y * params.rateFunc(i / params.runTime)) * 64) + 'px)' + 
			'scale(' + (params.scaleFrom + scale * params.rateFunc(i / params.runTime)) + ') ' + 
			'rotate(' + (params.rotateFrom + rotate * params.rateFunc(i / params.runTime)) + 'rad)';
		e.style.opacity = e.opacity * (1 - params.rateFunc(i / params.runTime));
		if (i != params.runTime) await Utils.sleep(1);
	}
},

// e: HTMLDivElement, params: {} (see DEFAULT_PARAMS)
transform : async function(e, params = {}) {
	Animate.fillDefault(params);
	
	let shift = Vector3.add(params.shiftTo, params.shiftFrom.scale(-1));
	let scale = params.scaleTo - params.scaleFrom;
	let rotate = params.rotateTo - params.rotateFrom;
	e.style.transformOrigin = 'calc(' + (params.center.x * 64) + 'px + 50%) calc(' + (-params.center.y * 64) + 'px + 50%)';
	
	for (let i = 0; i <= params.runTime; i++) {
		e.style.transform =
			'translate(' + ((params.shiftFrom.x + shift.x * params.rateFunc(i / params.runTime)) * 64) + 'px, ' + (-(params.shiftFrom.y + shift.y * params.rateFunc(i / params.runTime)) * 64) + 'px)' + 
			'scale(' + (params.scaleFrom + scale * params.rateFunc(i / params.runTime)) + ') ' + 
			'rotate(' + (params.rotateFrom + rotate * params.rateFunc(i / params.runTime)) + 'rad)';
		if (i != params.runTime) await Utils.sleep(1);
	}
},

// e: HTMLDivElement, params: {anim: function, shift: Vector3, center: Vector3, runTime: number, rateFunc: function, runTimeOffset: number}
animate : async function (e, params = {}) {
	await Animate.wait(params.runTimeOffset || 0);
	await params.anim(e, params);
},

// group: Array[Array[HTMLDivElement, function, {params}]...]
animateGroup : async function (group) {
	let cumulativeRunTimeOffset = 0;
	await Promise.all(group.map(anim => {
		cumulativeRunTimeOffset += anim[2].runTimeOffset || 0;
		anim[2].runTimeOffset = cumulativeRunTimeOffset;
		return Animate.animate(anim[0], {anim: anim[1], ...anim[2]});
	}));
},

// group: Array[HTMLDivElement...]
animateGroupByIndex : async function (group = Array.from(document.querySelectorAll('[data-anim]'))) {
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