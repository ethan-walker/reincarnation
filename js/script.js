/* ❓ SPARQL QUERIES */
function queryWikidata(query) {
	const apiUrl = "https://query.wikidata.org/sparql";

	const url = apiUrl + "?query=" + encodeURIComponent(query);
	const headers = {"Accept" : "application/sparql-results+json"}

	return fetch(url, {headers}).then(response => response.json())
}

/* 🔎 ACTION API */
function queryWikidataAction(params) {
	const apiUrl = "https://www.wikidata.org/w/api.php?"
	paramStr = ""
	for (var key of Object.keys(params)) {
		paramStr += `${key}=${encodeURIComponent(params[key])}&`
	}
	return fetch(`${apiUrl}${paramStr}origin=*`)
		.then(response => response.json())
}

/* 🖱️ SCROLL DRAG FUNCTION */
function scrollDrag(container) {
	var start_x, start_y, change_x, change_y

	container.onmousedown = dragStart;

	function dragStart(e) {
		document.onmousemove = dragMove;
		document.onmouseup = dragEnd;

		start_x = e.clientX;
		start_y = e.clientY;

		container.style.cursor = "grabbing";
		container.style.userSelect = "none";
	}

	function dragMove(e) {
		e.preventDefault();

		change_x = e.clientX - start_x;
		change_y = e.clientY - start_y;

		container.scrollTop -= change_y;
		container.scrollLeft -= change_x;

		start_x = e.clientX;
		start_y = e.clientY;
	}

	function dragEnd(e) {
		document.onmousemove = null;
		document.onmouseup = null;
		container.style.removeProperty('user-select');
		container.style.cursor = "grab";
	}
}
function emojiImage(emoji) {
	var scale = window.devicePixelRatio;
	var canvas = document.createElement("canvas");
	var resolution = 128;

	document.body.appendChild(canvas);
	canvas.width = resolution*scale;
	canvas.height = resolution*scale;
	let fontSize = resolution;
	canvas.style.width = `${resolution}px`
	canvas.style.height = `${resolution}px`
	canvas.style.display = "none";
	var ctx = canvas.getContext("2d");
	ctx.scale(scale, scale);

	ctx.font = `${fontSize}px Segoe Ui Emoji`;
	ctx.textAlign = 'center';
	ctx.textBaseline='middle';
	ctx.fontVariantCaps='unicase';

	let center = resolution/2;
	ctx.fillText(emoji, center, center);
	var url = canvas.toDataURL();
	canvas.remove();
	return url;
}
function randomItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}
function randomNum(lo, hi) {
	return lo + Math.floor(Math.random() * (hi - lo + 1));
}

function weightedRandom(arr, weights) {
	let total = weights.reduce((a, b) => a + b, 0); // sum of weights
	
	const weightedIndex = Math.random() * total;

	let cumulativeWeight = 0;
	for (let i = 0; i < arr.length; i++) {
			cumulativeWeight += weights[i];
			if (weightedIndex < cumulativeWeight) {
					return arr[i];
			}
	}
}