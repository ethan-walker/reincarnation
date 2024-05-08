const scrollView = document.querySelector(".scroll-view");
const scrollTree = document.querySelector(".scroll-tree");
const treeRoot = document.querySelector(".tree-root");
const rootMarker = document.querySelector(".root-marker");

const backBtn = document.querySelector(".back-button");
const infoBtn = document.querySelector(".info-button");

// const scrollBg = document.querySelector(".scroll-bg");
// const bgPattern = document.querySelector(".scroll-bg > pattern");

function searchBirth(date, elem) {
	let query = `
		SELECT ?person ?personLabel ?personDescription ?dod ?gender ?genderLabel ?dob ?yod ?yob (SAMPLE(?pics) AS ?image) ?article
		WHERE {
			VALUES ?dob {"${date}"^^xsd:dateTime}
			?person wdt:P31 wd:Q5; # is human
							wdt:P569 ?dob. # date of birth matches
			OPTIONAL {
				?person ^schema:about ?article .
				?article schema:isPartOf <https://en.wikipedia.org/>;
			}

			# set variables 
			OPTIONAL {
				?person wdt:P21 ?gender.
				?gender rdfs:label ?genderlabel FILTER (lang(?genderlabel) = "en").
			}
			OPTIONAL { ?person wdt:P18 ?pics. }
			OPTIONAL {
				?person wdt:P570 ?dod.
				BIND(YEAR(?dod) AS ?yod)
				MINUS {
					?person wdt:P569 ?dod; # remove people born and died on the same day (why exist????)
									p:P570/psv:P570/wikibase:timePrecision "9"^^xsd:integer.
				}
			}
			BIND(YEAR(?dob) AS ?yob)

			MINUS {
				?person p:P569/psv:P569/wikibase:timePrecision "9"^^xsd:integer.
			}
			SERVICE wikibase:label {
				bd:serviceParam wikibase:language "en".
			}
		}
		GROUP BY ?person ?personLabel ?personDescription ?dod ?gender ?genderLabel ?dob ?image ?yob ?yod ?article
		LIMIT 3
	`
	queryWikidata(query)
		.then(data => data.results)
		.then(results => results.bindings)
		.then(bindings => {
			var list = document.createElement("ul");
			list.classList.add("tree-list");

			elem.appendChild(list);


			if (bindings.length === 0) {
				var reincarnationList = weightedRandom(reincarnationOptions, reincarnationWeights);
				var label = randomItem(reincarnationList).split("/");

				var card = createCard({
					"name" : label[1],
					"image" : emojiImage(label[0]),
					"description" : "No recorded human was born on the right date.",
				})
				var item = document.createElement("li");
				item.classList.add("tree-item");
				list.appendChild(item);
				
				item.appendChild(card);
				
				return;
			}
			
			for (var person of bindings) {
				try {
					var description = person.personDescription.value;
				}
				catch {
					var description = "No description available."
				}
				try {
					var img = person.image.value;
				}
				catch {
					var img = "./assets/blank.svg";
				}
				try {
					var yod = person.yod.value;
				}
				catch {
					var yod = "";
				}
				try {
					var gender = person.genderLabel.value;
				}
				catch {
					var gender = "";
				}
				
				var card = createCard({
					"name" : person.personLabel.value,
					"description" : description,
					"image" : img,
					"lifetime" : `(${person.yob.value}-${yod})`,
					"gender" : gender
				})

				var item = document.createElement("li");
				item.classList.add("tree-item");
				list.appendChild(item);
				
				item.appendChild(card);

				if(person.article) {
					card.classList.add("wikipedia");
				}
				try {
					searchBirth(person.dod.value, item);
				}
				catch {
					card.classList.add("person-alive");
				}
			}
		})
}

function createCard(values) {
	var card = document.createElement("card");
	card.classList.add("person-card");

	try {
		if (values.gender === "male") {
			var genderIcon = `<i class="uil uil-mars"></i>`
		}
		else if (values.gender === "female") {
			var genderIcon = `<i class="uil uil-venus"></i>`
		}
	}
	catch {/* nothing */}

	var img = document.createElement("img");
	img.classList.add("person-image")
	img.loading = "lazy";
	img.src = values.image;
	card.appendChild(img);

	var details = document.createElement("card");
	details.classList.add("person-details");

	var name = document.createElement("span");
	name.classList.add("person-name");
	name.innerHTML = `${genderIcon || ""}${values.name} `
	details.appendChild(name)

	try {
		var lifetime = document.createElement("span")
		lifetime.classList.add("lifetime")
		lifetime.textContent = values.lifetime;
		name.appendChild(lifetime);
	}
	catch { /* pass */ }

	var description = document.createElement("div");
	description.classList.add("person-description");
	description.textContent = values.description;
	details.appendChild(description);

	card.appendChild(details);
	
	return card;
}

var counter = 0;

function searchDeath(date, elem) {
	let query = `
		SELECT ?person ?personLabel ?personDescription ?dod ?gender ?genderLabel ?dob ?yod ?yob (SAMPLE(?pics) AS ?image) ?article
		WHERE {
			VALUES ?dod {"${date}"^^xsd:dateTime}
			?person wdt:P31 wd:Q5; # is human
							wdt:P570 ?dod. # date of birth matches
			OPTIONAL {
				?person ^schema:about ?article .
				?article schema:isPartOf <https://en.wikipedia.org/>;
			}

			# set variables 
			OPTIONAL {
				?person wdt:P21 ?gender.
				?gender rdfs:label ?genderlabel FILTER (lang(?genderlabel) = "en").
			}
			OPTIONAL { ?person wdt:P18 ?pics. }
			?person wdt:P569 ?dob.
			BIND(YEAR(?dod) AS ?yod)
			MINUS {
				?person wdt:P569 ?dod; # remove people born and died on the same day (why exist????)
								p:P569/psv:P569/wikibase:timePrecision "9"^^xsd:integer.
			}
			BIND(YEAR(?dob) AS ?yob)

			MINUS {
				?person p:P569/psv:P569/wikibase:timePrecision "9"^^xsd:integer.
			}
			SERVICE wikibase:label {
				bd:serviceParam wikibase:language "en".
			}
		}
		GROUP BY ?person ?personLabel ?personDescription ?dod ?gender ?genderLabel ?dob ?image ?yob ?yod ?article
		LIMIT 2
	`
	queryWikidata(query)
		.then(data => data.results)
		.then(results => results.bindings)
		.then(bindings => {
			var list = document.createElement("ul");
			list.classList.add("tree-list");

			elem.appendChild(list);


			if (bindings.length === 0) {
				var reincarnationList = weightedRandom(reincarnationOptions, reincarnationWeights);
				var label = randomItem(reincarnationList).split("/");

				var card = createCard({
					"name" : label[1],
					"image" : emojiImage(label[0]),
					"description" : "No recorded human died on the right date.",
				})
				var item = document.createElement("li");
				item.classList.add("tree-item");
				list.appendChild(item);

				item.appendChild(card);

				return;
			}

			for (var person of bindings) {
				try {
					var description = person.personDescription.value;
				}
				catch {
					var description = "No description available."
				}
				try {
					var img = person.image.value;
				}
				catch {
					var img = "./assets/blank.svg";
				}
				try {
					var yod = person.yod.value;
				}
				catch {
					var yod = "";
				}
				try {
					var gender = person.genderLabel.value;
				}
				catch {
					var gender = "";
				}

				var card = createCard({
					"name" : person.personLabel.value,
					"description" : description,
					"image" : img,
					"lifetime" : `(${person.yob.value}-${yod})`,
					"gender" : gender
				})

				var item = document.createElement("li");
				item.classList.add("tree-item");
				list.appendChild(item);

				item.appendChild(card);

				if(person.article) {
					card.classList.add("wikipedia");
				}
				if (counter === 10) {
					return
				}
				counter++;
				try {
					searchDeath(person.dob.value, item);
				}
				catch {
					card.classList.add("person-alive");
				}
			}
		})
}

const direction = localStorage.getItem("direction") || "forward";
const startDate = localStorage.getItem("date");

if (direction === "forward") {
	searchBirth(startDate, scrollTree)
}
else if (direction === "backward") {
	searchDeath(startDate, scrollTree)
}
else {
	alert("What on earth");
}

rootMarker.onclick = function returnToRoot() {
	console.log("returning")
}

backBtn.onclick = function() {
	window.location.href = "./"
}

document.querySelector(".info-button").onclick = function(e) {
	document.querySelector(".info-layer").classList.add("visible");
}