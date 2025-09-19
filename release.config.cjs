const isStable = process.env.GITHUB_REF_NAME === 'main';

module.exports = {
  branches: ['main', { name: 'develop', prerelease: 'beta' }, { name: 'rc', prerelease: 'rc' }],
  preset: 'conventionalcommits',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',

    ...(isStable ? [['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }]] : []),
    '@semantic-release/npm',
    ...(isStable
      ? [
          [
            '@semantic-release/git',
            {
              assets: ['CHANGELOG.md', 'package.json'],
              message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
          ],
        ]
      : []),

    '@semantic-release/github',
  ],
};
