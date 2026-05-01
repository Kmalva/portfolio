import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const titleElement = document.querySelector('.projects-title');
const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1;

let colors = d3.scaleOrdinal(d3.schemeTableau10);

function getFilteredProjects() {
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  if (selectedIndex !== -1) {
    let data = getPieData(filteredProjects);
    let selectedYear = data[selectedIndex]?.label;

    if (selectedYear) {
      filteredProjects = filteredProjects.filter(
        (project) => String(project.year) === String(selectedYear)
      );
    }
  }

  return filteredProjects;
}

function getPieData(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  return rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
}

function renderPieChart(projectsGiven) {
  let data = getPieData(projectsGiven);

  let svg = d3.select('#projects-pie-plot');
  let legend = d3.select('.legend');

  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  let sliceGenerator = d3.pie()
    .value((d) => d.value);

  let arcs = sliceGenerator(data);

  arcs.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arcGenerator(arc))
      .attr('fill', colors(i))
      .attr('style', `--color:${colors(i)}`)
      .attr('class', selectedIndex === i ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updatePage();
      });
  });

  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr('class', `legend-item ${selectedIndex === i ? 'selected' : ''}`)
      .html(`
        <span class="swatch"></span>
        <span class="label">${d.label}</span>
        <span class="value">(${d.value})</span>
      `)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updatePage();
      });
  });
}

function updatePage() {
  let searchedProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  let finalProjects = getFilteredProjects();

  titleElement.textContent = `${finalProjects.length} Project${finalProjects.length !== 1 ? 's' : ''}`;

  renderProjects(finalProjects, projectsContainer, 'h2');

  renderPieChart(searchedProjects);
}

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  selectedIndex = -1;
  updatePage();
});

updatePage();