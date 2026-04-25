import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

const projects = await fetchJSON('./lib/projects.json');

const titleElement = document.querySelector('.projects-title');
if (titleElement) {
  titleElement.textContent = `${projects.length} Project${projects.length !== 1 ? 's' : ''}`;
}


const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');
if (projectsContainer) {
  renderProjects(latestProjects, projectsContainer, 'h2');
}

const githubData = await fetchGithubData('giorgianicolaou');
const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
  profileStats.innerHTML = `
    <dl>
      <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
      <dt>Followers:</dt><dd>${githubData.followers}</dd>
      <dt>Following:</dt><dd>${githubData.following}</dd>
    </dl>
  `;
}