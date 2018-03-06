const width = 1250;
const height = 800;
const padding = 130;
const url ='https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';


// ================================
// Initialized here for modularity
// ================================

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

const flagbox = d3.select('#content')
  .style('width', width + 'px')
  .style('height', height + 'px');

const tooltip = d3.select('body')
  .append('div')
  .style('opacity', 0)
  .classed('tooltip', true);


// ========================================
// HTTP Request Begins 
// ========================================
d3.json(url, (err, { nodes, links }) => {

// This is to convert numbers on links, into the country name
	links.forEach(d => {
		d.source = nodes[d.source].country;
		d.target = nodes[d.target].country;
	});



// ============================================
// This is to create our nodes and links
// ============================================


	const linkSelection = svg.selectAll('line')
	  .data(links)
	  .enter()
	  .append('line')
	    .attr('stroke', 'black')
	    .attr('stroke-width', 1);

	const flagSelection = flagbox.selectAll('img')
	  .data(nodes)
		.enter()
		.append('img')
			.attr('src', 'blank.gif')
		  .attr('class', d => `flag flag-${d.code}`)
		  .attr('alt', d => d.country)
      .call(d3.drag()
        .on('start', dragStart)
        .on('drag', drag)
        .on('end', dragEnd));


// ============================================
// Tooltip Configuration
// ============================================


  flagSelection
		.on('mouseover', d => {
	  	tooltip
	  	  .style('left', `${d3.event.x}px`)
	  	  .style('top', `${d3.event.y}px`)
	  	  .html(`
	  	  	<h3>${d.country}</h3>
	  	  `)
	  	  .transition(10)
	  	  .style('opacity', 0.90);
	  })
	  .on('mouseout', () => {
	  	tooltip
	  		.transition(150)
	  		.style('opacity', 0);
	  });	

// ==============================================
// Force simulation data
// ==============================================


	const simulation = d3.forceSimulation(nodes)
	  .force('center', d3.forceCenter(width / 2 , height / 2 ))
	  .force("nodes", d3.forceManyBody().strength(-6))
	  .force('links', d3.forceLink(links)
	  	.id(d => d.country)
	  	.distance(40))
	  .on('tick', ticked);


	function ticked() {
	  flagSelection
	    .style("left", d => (d.x - 8)  + 'px')
	    .style("top", d => (d.y - 6) + 'px');

	  linkSelection
	    .attr("x1", d => d.source.x)
	    .attr("y1", d => d.source.y)
	    .attr("x2", d => d.target.x)
	    .attr("y2", d => d.target.y);
	}


// ===================================
// Drag and drop functions
// ===================================

	function dragStart(d) {
	  simulation.alpha(0.1).restart();
	  d.fx = d.x;
	  d.fy = d.y;
	}

	function drag(d) {
		simulation.alpha(0.1).restart();
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}

	function dragEnd(d) {
	  simulation.alphaTarget(0);
	  d.fx = null;
	  d.fy = null;
	}
});

