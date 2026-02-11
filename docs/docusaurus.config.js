/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Reusable Intelligence & Cloud-Native Mastery',
  tagline: 'Portable AI agent skills with MCP Code Execution pattern',
  url: 'https://learnflow.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'assadsharif',
  projectName: 'Reusable-Intelligence-Cloud-Native-Mastery',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Reusable Intelligence',
        items: [
          { type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs' },
          { href: 'https://github.com/assadsharif/Reusable-Intelligence-Cloud-Native-Mastery', label: 'Skills Library', position: 'right' },
          { href: 'https://github.com/assadsharif/learnflow-app', label: 'LearnFlow App', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              { label: 'Getting Started', to: '/' },
              { label: 'Skills Guide', to: '/skills/what-are-skills' },
              { label: 'Deployment', to: '/deployment/local-dev' },
            ],
          },
          {
            title: 'GitHub',
            items: [
              { label: 'Skills Library', href: 'https://github.com/assadsharif/Reusable-Intelligence-Cloud-Native-Mastery' },
              { label: 'LearnFlow App', href: 'https://github.com/assadsharif/learnflow-app' },
            ],
          },
        ],
        copyright: `Hackathon III — Reusable Intelligence & Cloud-Native Mastery. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
        additionalLanguages: ['bash', 'yaml', 'docker', 'python'],
      },
    }),
};

module.exports = config;
