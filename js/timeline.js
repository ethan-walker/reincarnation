const scrollView = document.querySelector(".scroll-view");
const scrollTree = document.querySelector(".scroll-tree");
const treeRoot = document.querySelector(".tree-list");

function getPeople(date, elem) {
	let query = `
		SELECT ?person ?personLabel ?personDescription ?dod ?sex ?info ?dob ?yod ?yob (SAMPLE(?pics) AS ?image)
		WHERE {
			VALUES ?dob {"${date}"^^xsd:dateTime}
			?person wdt:P31 wd:Q5; # is human
							wdt:P569 ?dob; # date of birth matches
							wdt:P570 ?dod.

			# set variables 
			OPTIONAL { ?person wdt:P21 ?sex. }
			OPTIONAL { ?person wdt:P18 ?pics. }
			#BIND(?person schema:description AS ?info)
			BIND(YEAR(?dob) AS ?yob)
			BIND(YEAR(?dod) AS ?yod)
			
			?person p:P569/psv:P569/wikibase:timePrecision "11"^^xsd:integer;
							p:P570/psv:P570/wikibase:timePrecision "11"^^xsd:integer.

			MINUS {
				?person wdt:P569 ?dod. # remove people born and died on the same day (why exist????)
			}
			SERVICE wikibase:label {
				bd:serviceParam wikibase:language "en".
			}
		}
		GROUP BY ?person ?personLabel ?personDescription ?dod ?sex ?info ?dob ?image ?yob ?yod
		LIMIT 4
	`
	queryWikidata(query)
		.then(data => data.results)
		.then(results => results.bindings)
		.then(bindings => {
			if (bindings.length === 0) {
				// IMPLEMENT CATERPILLAR/ROCK STUFF HERE 🐛
				console.log("Path ended");
				return;
			}
			var list = document.createElement("ul");
			list.classList.add("tree-list");

			elem.appendChild(list);
			
			for (var person of bindings) {
				var item = document.createElement("li");
				item.classList.add("tree-item");
				list.appendChild(item);
				
				var card = document.createElement("card");
				card.classList.add("person-card");
				
				var img = document.createElement("img");
				img.classList.add("person-image")
				img.src = (person.image || {"value" : "./assets/blank.svg"}).value;
				card.appendChild(img);

				var details = document.createElement("card");
				details.classList.add("person-details");
				
				var name = document.createElement("span");
				name.classList.add("person-name");
				name.textContent = `${person.personLabel.value} (${person.yob.value}-${person.yod.value})`
				details.appendChild(name)
				
				// var lifetime = document.createElement("span")
				// lifetime.classList.add("lifetime")

				var description = document.createElement("div");
				description.classList.add("person-description");
				description.textContent = (person.personDescription || {"value" : "No description available"}).value;
				details.appendChild(description);

				card.appendChild(details);
				
				item.appendChild(card);

				getPeople(person.dod.value, item);
			}
		})
}
const start = localStorage.getItem("date");

getPeople(start, scrollTree);

scrollDrag(scrollView);