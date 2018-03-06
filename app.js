const width = 700;
const height = 700;
const padding = 130;
const url ='https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);




// const linkSelection = d3.selectAll('line');
// const simulation;

d3.json(url, (err, { nodes, links }) => {
	links.forEach(d => {
		d.source = nodes[d.source].country;
		d.target = nodes[d.target].country;
	});

	console.log(links);
	const nodeSelection = d3.selectAll('img')
	  .data(nodes)
		.enter()
		.append('img')
			.attr('width', '1px')
			.attr('height', '1px')
		  .attr('class', d => `flag flag-${d.code}`)
		  .attr('src', 'blank.gif')
		  .attr('alt', d => d.country);
});