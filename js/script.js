/* ❓ SPARQL QUERIES */
function queryWikidata(query) {
	const apiUrl = "https://query.wikidata.org/sparql";

	const url = apiUrl + "?query=" + encodeURIComponent(query) + "";
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
		.then(response => {
			if(response.status === 429) {
				console.log("Timeout")
			}
			return response.json()
		})
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
function clamp(val, lo, hi) {
	 return Math.min(Math.max(lo, val), hi);
}

document.querySelectorAll(".select").forEach(elem => {
	elem.querySelector(".select-list > :first-child").classList.add("selected");
	elem.querySelector(".select-display").textContent = elem.querySelector(".select-list > :first-child").textContent;
	
	elem.onclick = function (e) {
		var select = e.currentTarget;
		var item = e.target;
		
		const header = select.querySelector(".select-display");
		select.classList.toggle("open");

		if (item.tagName === "LI") {
			header.textContent = item.textContent;
			
			select.querySelector("li.selected").classList.remove("selected");
			item.classList.add("selected");
		}
	}
})

document.querySelectorAll(".layer-close").forEach(item => {
	item.onclick = function(e) {
		var elem = e.currentTarget;

		elem.parentElement.parentElement.classList.remove("visible");
	}
})
