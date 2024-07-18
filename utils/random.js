const Random = {

// arr: Array[any], n: number, replace: bool, returnIndices: bool
arrayChoice : function(arr, n = 1, replace = true, returnIndices = false) {
	if (!replace && n > arr.length) {
		throw new RangeError('[n] must not be greater than [arr.length] if [replace = false]');
	}

	let idx = new Array(arr.length).fill(0).map((_, i) => i);

	let a = [], idxs = [];
	for (let i = 0; i < n; i++) {
		let r = Math.floor(Math.random() * idx.length);
		a.push(arr[idx[r]]);
		idxs.push(idx[r]);
		if (!replace) idx.splice(r, 0);
	}

	if (returnIndices) return [a, idxs];
	else return a;
},

// arr: Array[any], probs: Array[number], n: number, returnIndices: bool
arrayChoiceWeighted : function(arr, probs, n = 1, returnIndices = false) {
	if (arr.length != probs.length) {
		throw new RangeError('[arr.length] must equal [probs.length]');
	}

	let cProbs = [0];
	for (let i = 0; i < probs.length; i++) {
		if (probs[i] < 0 || probs[i] > 1) {
			throw new RangeError('Every element in [probs] must be between 0 and 1');
		}

		cProbs.push(cProbs[i] + probs[i]);
	}

	if (Math.abs(cProbs[cProbs.length - 1] - 1) > 1e-5) {
		throw new RangeError('Every element in [probs] must sum to 1');
	}

	let a = [], idxs = [];
	for (let i = 0; i < n; i++) {
		let r = Math.random();

		let left = 1, right = cProbs.length - 1;

		while (left <= right) {
			let mid = Math.floor((left + right) / 2);

			if (cProbs[mid - 1] > r ) {
				right = mid - 1;
			} else if (cProbs[mid] < r) {
				left = mid + 1;
			} else {
				a.push(arr[mid - 1]);
				idxs.push(mid - 1);
				break;
			}
		}

		if (left > right) {
			throw Error('FIX ME');
		}
	}

	if (returnIndices) return [a, idxs];
	else return a;
}

}