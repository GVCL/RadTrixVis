const ghpages = require('gh-pages');

console.log('Starting deployment process...');
ghpages.publish(
  'build', // Folder to deploy
  {
    repo: 'git@github.com:GVCL/RadTrixVis.git',
    branch: 'gh-pages',
    message: 'Auto-generated deployment to GitHub Pages',
    user: {
      name: 'Venkat Suprabath Bitra',
      email: 'vsb2127@columbia.edu'
    },
    push: true,
    dotfiles: true,
  },
  function(err) {
    if (err) {
      console.error('Deployment error:', err);
      return;
    }
    console.log('Deployment complete!');
  }
);