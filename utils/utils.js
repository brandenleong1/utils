const Utils = {

// ms: number
sleep : function(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
},

// type: string
storageAvailable : function(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            (storage && storage.length !== 0);
    }
},

// e: any, ...class_constructors: [Class]
isClass : function(e, ...class_constructors) {
	if (typeof e == 'object') {
		for (let class_constructor of class_constructors) {
			if (e.constructor == class_constructor) {
				return true;
			}
		}
		return false;
	}
	return false;
},

// e: HTMLDivElement
clearDiv : function(e) {
	while (e.firstChild) {
    	e.removeChild(e.firstChild);
	}
},

// text: string, fileName: string
saveFile : function(text, fileName) {
	let file = new Blob([text], {type: 'text/plain; charset=utf-8,'});
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(file, fileName);
	} else {
		let a = document.createElement('a');
		let url = URL.createObjectURL(file);
		a.href = url;
		document.body.append(a);
		a.setAttribute('download', fileName);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
},

// list: Array[T], item: T, compareFn: function(a: T, b: T): number
binarySearchIdx : function(list, item, compareFn = (a, b) => a - b) {
	let left = 0, right = list.length - 1;

	while (left <= right) {
		let mid = Math.floor((left + right) / 2);
		let compRes = compareFn(list[mid], item);
		if (isNaN(compRes)) {
			break;
		}

		if (compRes > 0) {
			right = mid - 1;
		} else if (compRes < 0) {
			left = mid + 1;
		} else {
			if (mid > 0 && compareFn(list[mid - 1], item) == 0) {
				right = mid - 1;
			} else {
				return mid;
			}
		}
	}

	return -1;
},

// list: Array[T], item: T, compareFn: function(a: T, b: T): number
binaryInsert : function(list, item, compareFn = (a, b) => a - b) {
	let left = 0, right = list.length;
	let mid = 0;
	let compRes = 0;
	
	while (left < right) {
		mid = Math.floor((left + right) / 2);
		compRes = compareFn(list[mid], item);
		if (compRes > 0) {
			right = mid;
		} else if (compRes < 0) {
			left = mid + 1;
		} else {
			return -1;
		}
	}
	if (compRes < 0) mid++;

	list.splice(mid, 0, item);
	return mid;
},

// arr: Array[any]
deepCopyArray : function(arr) {
	return arr.map(e => Array.isArray(e) ? Utils.deepCopyArray(e) : e);
},

// arr: Array[any]
shuffleArray : function(arr) {
	let arrN = Utils.deepCopyArray(arr);
	for (let i = arrN.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arrN[i], arrN[j]] = [arrN[j], arrN[i]];
	}
	return arrN;
},

// arr: Array[Array[any]]
transpose2DArray: function(arr) {
	return arr[0].map((_, i) => arr.map((e) => e[i]));
},

// a: number, b: number, t: number
lerp: function(a, b, t) {
	return a + t * (b - a);
}

};