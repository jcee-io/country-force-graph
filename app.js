const width = 700;
const height = 700;
const padding = 130;
const url ='https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

const flagbox = d3.select('#content')
  .style('width', width + 'px')
  .style('height', height + 'px');
// const linkSelection = d3.selectAll('line');
// const simulation;

d3.json(url, (err, { nodes, links }) => {
	links.forEach(d => {
		d.source = nodes[d.source].country;
		d.target = nodes[d.target].country;
	});


	const nodeSelection = svg.selectAll('circle')
	  .data(nodes)
	  .enter()
	  .append('circle')
	    .attr('r', 9)
	    .attr('fill', 'none');

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
		  .attr('alt', d => d.country);

	const simulation = d3.forceSimulation(nodes)
	  .force('center', d3.forceCenter(width / 2 , height / 2 ))
	  .force("nodes", d3.forceManyBody())
	  .force('links', d3.forceLink(links)
	  	.id(d => d.country)
	  	.distance(50))
	  .on('tick', ticked);


	function ticked() {
	  nodeSelection
	    .attr("cx", d => d.x )
	    .attr("cy", d => d.y );
	  flagSelection
	    .style("left", d => (d.x - 8)  + 'px')
	    .style("top", d => (d.y - 6) + 'px');

	  linkSelection
	    .attr("x1", d => d.source.x)
	    .attr("y1", d => d.source.y)
	    .attr("x2", d => d.target.x)
	    .attr("y2", d => d.target.y);
	}
});