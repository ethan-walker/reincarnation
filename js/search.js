const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const results = document.querySelector(".result-list");

const inputToggle = document.querySelector(".input-toggle");
const directionSelect = document.querySelector(".direction-select");

directionSelect.addEventListener("click", e => {
	var direction = directionSelect.querySelector(".select-display").textContent;
	localStorage.setItem("direction", direction);
})


searchInput.onkeyup = function(e) {
	if (e.key === "Enter") {
		if (inputToggle.style.getPropertyValue("--input-mode") === "date") {
			const dateList = [
				//Non-Leap, Leap
				[31, 31],
				[28, 29],
				[31, 31],
				[30, 30],
				[31, 31],
				[30, 30],
				[31, 31],
				[31, 31],
				[30, 30],
				[31, 31],
				[30, 30],
				[31, 31],
			]
			var date = searchInput.value.split("/");
			var dateString = date.toReversed().join("-");
			var date = date.map(item => Number(item));
			console.log(date);
			if (
				date[1] > 12 ||
				(date[2] % 4 === 0 && date[0] > dateList[date[1] - 1][1]) ||
				(date[2] % 4 !== 0 && date[0] > dateList[date[1] - 1][0])
			) {
				return console.log("Invalid Date");
			}
			localStorage.setItem("date", dateString);
			window.location.href = "./timeline.html";
		}
		else {
			searchName();
		}
	}
	else if (inputToggle.style.getPropertyValue("--input-mode") === "date") {
		console.log(new Date(searchInput.value));
	}
}

function formatResults(data) {
	results.innerHTML = "";
	if (data.results.bindings.length === 0) {
		results.textContent = "Nothing found."
		return;
	}
	var counter = 1;
	for (var person of data.results.bindings) {
		let entry = document.createElement("li");
		entry.classList.add("result");


		let img = document.createElement("img");
		img.classList.add("result-image")
		img.src = (person.image || {"value" : "./assets/blank.svg"}).value;
		entry.appendChild(img);

		let content = document.createElement("div");
		content.classList.add("result-content");
		entry.appendChild(content);

		let name = document.createElement("div");
		name.classList.add("result-name")
		name.textContent = person.itemLabel.value;
		content.appendChild(name);

		let description = document.createElement("div");
		description.classList.add("result-description")
		try {
			description.textContent = person.itemDescription.value;
		}
		catch {
			description.textContent = "No description available.";
		}
		content.appendChild(description);

		results.appendChild(entry);
		entry.onclick = nameFunction;

		entry.style.setProperty("--death", person.dod.value);
		entry.style.setProperty("--birth", person.dob.value);
		entry.style.setProperty("--delay", counter);
		counter++;
	}
}

function searchName() {
	queryWikidata(`
	SELECT ?item ?itemLabel ?dob ?dod ?itemDescription (SAMPLE(?images) AS ?image) WHERE {
	  SERVICE wikibase:mwapi {
	      bd:serviceParam wikibase:endpoint "www.wikidata.org";
	                      wikibase:api "EntitySearch";
	                      mwapi:search "${searchInput.value}";
	                      mwapi:language "en".
	      ?item wikibase:apiOutputItem mwapi:item.
				OPTIONAL {?title wikibase:apiOutput mwapi:description.}
	  }
	  ?item wdt:P31 wd:Q5;
	  			wdt:P569 ?dob;
					wdt:P570 ?dod.
		OPTIONAL {?item wdt:P18 ?images}
		SERVICE wikibase:label {
			bd:serviceParam wikibase:language "en".
			# DON'T REMOVE this fixes it i have no idea why
			?item rdfs:label ?itemLabel.
			?item schema:description ?itemDescription .
		}
	}
	GROUP BY ?item ?itemLabel ?dob ?dod ?itemDescription ?image
	LIMIT 5
`)
	.then(data => formatResults(data));
}

function nameFunction(e) {
	entry = e.currentTarget;
	death = getComputedStyle(entry)
		.getPropertyValue('--death');
	birth = getComputedStyle(entry)
	.getPropertyValue('--birth');
	var direction = localStorage.getItem("direction");
	if (direction === "forward") {
		localStorage.setItem("date", death);
	}
	else {
		localStorage.setItem("date", birth);
	}
	window.location.href = "./timeline.html"
}

inputToggle.onclick = function() {
	if (inputToggle.style.getPropertyValue("--input-mode") === "date") {
		inputToggle.style.setProperty("--input-mode", "text")
		inputToggle.innerHTML = `<i class="uil uil-calender"></i>`;

		searchInput.placeholder = "Search by name";
		searchInput.removeAttribute("pattern");
	}
	else {
		inputToggle.style.setProperty("--input-mode", "date")
		inputToggle.innerHTML = `<i class="uil uil-text-fields"></i>`;

		searchInput.pattern = "[0-9]{2}/[0-9]{2}/[0-9]{4}";
		searchInput.placeholder = "dd/mm/yyyy";
		
	}
}