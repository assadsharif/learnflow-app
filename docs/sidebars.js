/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Architecture',
      items: ['architecture/overview', 'architecture/agents', 'architecture/cloud-native'],
    },
    {
      type: 'category',
      label: 'Skills Guide',
      items: ['skills/what-are-skills', 'skills/creating-skills', 'skills/skill-inventory'],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: ['deployment/local-dev', 'deployment/kubernetes', 'deployment/gcp-gke', 'deployment/cicd'],
    },
  ],
};

module.exports = sidebars;
