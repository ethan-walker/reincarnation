const nameInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const results = document.querySelector(".result-list");

searchButton.onclick = searchName;

function searchName() {
	queryWikidata(`
	SELECT ?item ?itemLabel ?dob ?dod ?info ?img WHERE {
	  SERVICE wikibase:mwapi {
	      bd:serviceParam wikibase:endpoint "www.wikidata.org";
	                      wikibase:api "EntitySearch";
	                      mwapi:search "${nameInput.value}";
	                      mwapi:language "en".
	      ?item wikibase:apiOutputItem mwapi:item.
				OPTIONAL {?title wikibase:apiOutput mwapi:description.}
	  }
	  ?item wdt:P31 wd:Q5;
	  			wdt:P569 ?dob.
		OPTIONAL {?item wdt:P18 ?img}
		SERVICE wikibase:label {
			bd:serviceParam wikibase:language "en".
			# DON'T REMOVE this fixes it i have no idea why
			?item rdfs:label ?itemLabel.
			?item schema:description ?info .
		}
	} LIMIT 5
`)
	.then(data => {
		results.innerHTML = "";
		if (data.results.bindings.length === 0) {
			results.textContent = "Nothing found."
			return;
		}
		for (var person of data.results.bindings) {
			let entry = document.createElement("li");
			entry.classList.add("result");
			
			let name = document.createElement("div");
			name.classList.add("result-name")
			name.textContent = person.itemLabel.value;
			entry.appendChild(name);
			
			let description = document.createElement("div");
			description.classList.add("result-description")
			description.textContent = person.info.value;
			entry.appendChild(description);
			
			results.appendChild(entry);
		}
	});
}
