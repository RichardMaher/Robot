let robot;

document.addEventListener("DOMContentLoaded", async () =>
	{
		const axisY = document.getElementById("axisY")
		const axisX = document.getElementById("axisX")
		const contentDiv = document.getElementById("content")
		const root = document.querySelector(':root');
		
		const robotView = document.createElement("div")
		
		const arrow = document.createElement("object")
		arrow.id = "arrow"
		arrow.alt = "Arrow pointing direction"
		arrow.data = "arrow-line-left.svg"
		arrow.type = "image/svg+xml"

		let arrowRoot
		let maxX = axisX.max
		let maxY = axisY.max
		
		for (let i=0; i<= maxY; i++) {
			let row = document.createElement("div")
			contentDiv.appendChild(row)
			for (let j=0; j<= maxX; j++) {
				let cellOuter = document.createElement("div")
				row.appendChild(cellOuter)
				let cellInner = document.createElement("div")
				cellInner.id = "X" + j + "_" + "Y" + i
				cellOuter.appendChild(cellInner)
				cellInner.addEventListener("click", (e) => {
					robot.cellClick(e)
				})
			}
		}

		robot = new
			function() {		
				
				root.style.setProperty('--arrow-heading', '180deg')
				
				let facing = 2 
				let pos = [0, 0]
				let axis = [
					{name: "x", min: 0, max: 0},
					{name: "y", min: 0, max: 0}
				]
				axis[0].max = maxX
				axis[1].max = maxY
				
				let heading = [
					{name: "east",  axis: 0, crementer:  1, rotate: 180},
					{name: "north", axis: 1, crementer: -1, rotate:  90},
					{name: "west",  axis: 0, crementer: -1, rotate:   0},
					{name: "south", axis: 1, crementer:  1, rotate: 270}
				]
				
				const place =
						function(x, y, f) {
							pos[0] = x
							pos[1] = y
							facing = f
							let newDiv = document.getElementById("X" + pos[0] + "_Y" + pos[1])
							newDiv.appendChild(arrow)
							root.style.setProperty('--arrow-heading', heading[facing].rotate + 'deg')
							return true;
						}
				
				const move =
						function() {
							if (onEdge()) {
								return 0
							}
							let moveAxis = heading[facing]
							let direction = heading[facing].crementer
							pos[moveAxis.axis] += direction
							let newDiv = document.getElementById("X" + pos[0] + "_Y" + pos[1])
							newDiv.appendChild(arrow)
							return 1	
						}
						
				const rotate =
						function(dir) {
							arrowRoot.style.setProperty('--end-color', 'none');
							if (facing + dir < 0) {
								facing = 3
							} else {
								if (facing + dir > 3) {
									facing = 0
								} else {
									facing += dir
								}
							}
							let newDeg = heading[facing].rotate
							root.style.setProperty('--arrow-heading', heading[facing].rotate + 'deg')
							deadEnd()
						}
						
				const report =
						function() {
							alert("I am at cell ( " + pos[0] + " , " + pos[1] +" ) facing " + heading[facing].name)
						}
						
				const cellClick =
						function(e) {
							let coords = e.target.id.split("_")
							let X = coords[0].substring(1)
							let Y = coords[1].substring(1)
							let newDiv = document.getElementById("X" + X + "_Y" + Y)
							pos[0] = Number(X)
							pos[1] = Number(Y)
							newDiv.appendChild(arrow)
						}
						
				const deadEnd = 
						function() {
							let imageDOM = document.getElementById("arrow").contentDocument;
							arrowRoot = imageDOM.querySelector(':root');
							if (onEdge()) {
								arrowRoot.style.setProperty('--end-color', 'red');
							}
						}
						
				function onEdge() {
					let moveAxis = heading[facing]
					let direction = heading[facing].crementer
					if (pos[moveAxis.axis] + direction < axis[moveAxis.axis].min ||
						pos[moveAxis.axis] + direction > axis[moveAxis.axis].max) {
							return true;
					}
					return false
				}
				
				let result = {
						 place: place,
						 move: move,
						 rotate: rotate,
						 report: report,
						 cellClick: cellClick,
						 deadEnd: deadEnd}     
						 
				return result
			}
					
			
		const modalWait = document.getElementById("modalWait")
		document.getElementById("continue").addEventListener("click", 
			(e) => {
						modalWait.style.display = "none";
					});
		
		const valueX = document.getElementById("valueX");
		axisX.addEventListener("input", (e) => {
				valueX.innerText = e.target.value; 
			})
		axisX.value = axisX.max;
		valueX.innerText = axisX.value;
		
		const valueY = document.getElementById("valueY");
		axisY.addEventListener("input", (e) => {
				valueY.innerText = e.target.value; 
			})
		axisY.value = axisY.max;
		valueY.innerText = axisY.value;
		
		document.getElementById("place").addEventListener("click", 
			(e) => {
						modalWait.style.display = "flex";
					});
					
		document.getElementById("report").addEventListener("click", 
			(e) => {
						robot.report();
					});
					
		document.getElementById("left").addEventListener("click", 
			(e) => {
						robot.rotate(1);
					});
					
		document.getElementById("right").addEventListener("click", 
			(e) => {
						robot.rotate(-1);
					});
					
		document.getElementById("move").addEventListener("click", 
			(e) => {
						let result = robot.move();
						if (!result) {
							alert("No go")
							return
						}
					});
		
		const coords = document.getElementById("coords");
		document.getElementById("continue").addEventListener("click", 
			(e) => {
						robot.place(Number(axisX.value), Number(axisY.value), coords.selectedIndex);
					});
		
		let loaded;
		let loadPromise = new Promise(resolve => loaded = resolve)
		arrow.addEventListener("load", loaded, {once: true})
		
		
		let cellZero = document.getElementById("X0_Y0")
		cellZero.appendChild(arrow)
		
		await loadPromise;
		
		arrow.addEventListener("load", (e) => {
			robot.deadEnd()
		})
		
		arrow.addEventListener("transitionstart", (e) => {
			arrowRoot.style.setProperty('--end-color', 'none');
		})
		
		arrow.addEventListener("transitionend", (e) => {
			robot.deadEnd()
		})

// Ready to Rock 'n' Roll		
		document.getElementById("placement").style.visibility = "visible"
	})
