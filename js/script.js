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