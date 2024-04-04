var start_x, start_y, change_x, change_y

var scale = 1,
	centerX = scrollTree.offsetWidth / 2,
	centerY = scrollTree.offsetHeight / 2,
	origin = {"x" : centerX, "y": centerY},
	newOrigin = {},
	translate = {"x" : 0, "y" : 0};


scrollView.onmousedown = dragStart;

function dragStart(e) {
	document.onmousemove = dragMove;
	document.onmouseup = dragEnd;

	start_x = e.clientX;
	start_y = e.clientY;

	scrollView.style.cursor = "grabbing";
	scrollView.style.userSelect = "none";
}

function dragMove(e) {
	e.preventDefault();

	change_x = e.clientX - start_x;
	change_y = e.clientY - start_y;

	translate.y += change_y;
	translate.x += change_x;

	start_x = e.clientX;
	start_y = e.clientY;

	scrollTree.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;

	isOffscreen();
}

function dragEnd(e) {
	document.onmousemove = null;
	document.onmouseup = null;
	scrollView.style.removeProperty('user-select');
	scrollView.style.cursor = "grab";
}

scrollView.onwheel = (e) => {
	e.preventDefault();

	scale += e.deltaY * -0.005;

	// Restrict scale
	scale = Math.min(Math.max(0.25, scale), 4);

	mousePos(e);

	// Apply scale 
	// scrollTree.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
};

// scrollView.onmousemove = mousePos;

function mousePos(e) {
	let rect = scrollTree.getBoundingClientRect();

	//relative absolute mouse pos
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;

	console.log(rect.left);

	newOrigin.x = (x - translate.x + origin.x * (scale - 1));
	newOrigin.y = (y - translate.y + origin.y * (scale - 1));

	translate.x = translate.x - ((origin.x - newOrigin.x) * (scale - 1));
	translate.y = translate.y - ((origin.y - newOrigin.y) * (scale - 1));

	origin.x = newOrigin.x;
	origin.y = newOrigin.y;

	scrollTree.style.transformOrigin = `${origin.x}px ${origin.y}px`;
	scrollTree.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;

	scrollTree.style.setProperty('--mouse-x', origin.x + "px");
	scrollTree.style.setProperty('--mouse-y', origin.y + "px");

}

function isOffscreen() {
	var markerGap = 20;
	let rect = treeRoot.getBoundingClientRect();

	markerGap = markerGap + (rootMarker.getBoundingClientRect().width / 2);
	
	if (
		rect.x + rect.width < 0 ||
		rect.y + rect.height < 0 ||
		rect.x > window.innerWidth ||
		rect.y > window.innerHeight
	) {
		let x = clamp(rect.x, markerGap, window.innerWidth - markerGap);
		let y = clamp(rect.y, markerGap, window.innerHeight - markerGap);
		
		rootMarker.style.left = x + "px";
		rootMarker.style.top = y + "px";

		dy = x - rect.x
		dx = y - rect.y
		theta = Math.atan2(dy, dx)
		theta *= -180/Math.PI;

		rootMarker.style.rotate = theta + "deg";
		
		rootMarker.classList.add("visible");
	}
	else {
		rootMarker.classList.remove("visible");
	}
}