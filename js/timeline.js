const scrollView = document.querySelector(".scroll-view");
const scrollContainer = document.querySelector(".scroll-container");

function getPeople(date) {
	let query = `
		SELECT ?person ?personLabel ?personDescription ?image ?dod ?sex ?info
		WHERE {
			VALUES ?dob {"${date}"^^xsd:dateTime}
			?person wdt:P31 wd:Q5; # is human
							wdt:P569 ?dob; # date of birth matches

			# set variables 
			OPTIONAL { ?person wdt:P570 ?dod. }
			OPTIONAL { ?person wdt:P21 ?sex. }
			OPTIONAL { ?person wdt:P18 ?image. }
			BIND(YEAR(?dob) AS ?year)
			#BIND(?person schema:description AS ?info)
			SERVICE wikibase:label {
				bd:serviceParam wikibase:language "en".
			}
		} LIMIT 5
	`
	queryWikidata(query)
		.then(data => data.results)
		.then(results => results.bindings)
		.then(bindings => {
			for (var person of bindings) {
				
				var card = document.createElement("card");
				card.classList.add("person-card");
				
				var img = document.createElement("img");
				img.classList.add("person-image")
				img.src = (person.image || {"value" : "/assets/blank.svg"}).value;
				card.appendChild(img);

				var header = document.createElement("div");
				header.classList.add("person-header");
				
				var name = document.createElement("span");
				name.classList.add("person-name");
				name.textContent = person.personLabel.value
				header.appendChild(name)
				
				var lifetime = document.createElement("span")
				lifetime.classList.add("lifetime")
				
				card.appendChild(header);

				var description = document.createElement("div");
				description.classList.add("person-description");
				description.textContent = person.personDescription.value;

				card.appendChild(description)
				scrollContainer.appendChild(card);

				console.log(person.sex.value);
			}
		})
}
getPeople("1889-04-20")

scrollDrag(scrollView);