import Stats from 'stats.js';

function setupStats() {
  const statsFPS = new Stats();
  const statsMS = new Stats();
  const statsMB = new Stats();

  statsFPS.showPanel(0);
  statsMS.showPanel(1);
  statsMB.showPanel(2);

  document.body.appendChild(statsFPS.dom);
  document.body.appendChild(statsMS.dom);
  document.body.appendChild(statsMB.dom);

  statsFPS.dom.style.position = 'absolute';
  statsFPS.dom.style.top = '0px';
  statsFPS.dom.style.left = '0px';

  statsMS.dom.style.position = 'absolute';
  statsMS.dom.style.top = '50px';
  statsMS.dom.style.left = '0px';

  statsMB.dom.style.position = 'absolute';
  statsMB.dom.style.top = '100px';
  statsMB.dom.style.left = '0px';

  return {
    begin: () => {
      statsFPS.begin();
      statsMS.begin();
      statsMB.begin();
    },
    end: () => {
      statsFPS.end();
      statsMS.end();
      statsMB.end();
    }
  };
}

export { setupStats };