import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `${projects.length} Project${projects.length !== 1 ? 's' : ''}`;

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');