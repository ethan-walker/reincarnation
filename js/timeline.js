const scrollView = document.querySelector(".scroll-view");
const scrollTree = document.querySelector(".scroll-tree");
const treeRoot = document.querySelector(".tree-list");

const reincarnationWeights = [
	0.1, 1.9, 10, 88
]
const reincarnationOptions = [
	[
		"🦠/Covid 2",
		"💣/Uranium-235",
		"🦊/The Thought Fox",
		" /Nothing"
	],
	[
		"📖/A bible",
		"🪅/A piñata?",
		"🧻/Toilet paper",
		"🦆/A rubber duck",
		"👾/A space invader",
		"⚡/Lightning",
		"❄️/A snowflake"
	],
	[
		"🍕/A slice of pizza?",
		"🎄/A christmas tree",
		"🍣/A piece of sushi",
		"🍌/A banana",
		"🌮/A taco"
	],
	[
		"🧑‍⚕️/A doctor",
		"🦜/A parrot",
		"🐛/A caterpillar",
		"🪨/A rock",
		"🌳/A tree",
		"🌲/A tree",
		"🌱/A seed",
		"🍎/An apple",
		"🐕/A dog",
		"🪸/A piece of coral",
		"☁️/A cloud",
		"🐆/A leopard",
		"🦢/A swan",
		"🐄/A cow",
		"🦔/A hedgehog",
		"🐋/A whale",
		"🦀/A crab",
		"🐩/A poodle",
		"🦒/A giraffe",
		"🦋/A butterfly",
		"🐍/A snake",
		"🦁/A lion",
		"🐓/A rooster",
		"🐇/A rabbit",
		"🐅/A tiger",
		"🐑/A sheep",
		"🐠/A fish",
		"🐿️/A squirrel",
		"🐌/A snail",
		"🐊/A crocodile",
		"🦩/A flamingo",
		"🦊/A fox"
	]
]

function getPeople(date, elem) {
	let query = `
		SELECT ?person ?personLabel ?personDescription ?dod ?gender ?info ?dob ?yod ?yob (SAMPLE(?pics) AS ?image)
		WHERE {
			VALUES ?dob {"${date}"^^xsd:dateTime}
			?person wdt:P31 wd:Q5; # is human
							wdt:P569 ?dob. # date of birth matches

			# set variables 
			OPTIONAL { ?person wdt:P21 ?gender. }
			OPTIONAL { ?person wdt:P18 ?pics. }
			OPTIONAL {
				?person wdt:P570 ?dod.
				BIND(YEAR(?dod) AS ?yod)
				MINUS {
					?person wdt:P569 ?dod; # remove people born and died on the same day (why exist????)
									p:P570/psv:P570/wikibase:timePrecision "9"^^xsd:integer.
				}
			}
			#BIND(?person schema:description AS ?info)
			BIND(YEAR(?dob) AS ?yob)

			MINUS {
				?person p:P569/psv:P569/wikibase:timePrecision "9"^^xsd:integer.
			}
			SERVICE wikibase:label {
				bd:serviceParam wikibase:language "en".
			}
		}
		GROUP BY ?person ?personLabel ?personDescription ?dod ?gender ?info ?dob ?image ?yob ?yod
		LIMIT 4
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
				var item = document.createElement("li");
				item.classList.add("tree-item");
				list.appendChild(item);

				var card = document.createElement("card");
				card.classList.add("person-card");

				var img = document.createElement("img");
				img.classList.add("person-image")
				img.src = emojiImage(label[0]);
				card.appendChild(img);

				var details = document.createElement("card");
				details.classList.add("person-details");

				var name = document.createElement("span");
				name.classList.add("person-name");
				name.textContent = label[1]
				details.appendChild(name)

				// var lifetime = document.createElement("span")
				// lifetime.classList.add("lifetime")

				var description = document.createElement("div");
				description.classList.add("person-description");
				description.textContent = "No recorded human was born on the right date."
				details.appendChild(description);

				card.appendChild(details);

				item.appendChild(card);
				console.log("Path ended");
				return;
			}
			
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
				name.textContent = `${person.personLabel.value} (${person.yob.value}-${(person.yod || {"value" : ""}).value})`
				details.appendChild(name)
				
				// var lifetime = document.createElement("span")
				// lifetime.classList.add("lifetime")

				var description = document.createElement("div");
				description.classList.add("person-description");
				description.textContent = (person.personDescription || {"value" : "No description available"}).value;
				details.appendChild(description);

				card.appendChild(details);
				
				item.appendChild(card);
				try {
					getPeople(person.dod.value, item);
				}
				catch {
					card.classList.add("person-alive");
				}
			}
		})
}
const start = localStorage.getItem("date");

getPeople(start, scrollTree);