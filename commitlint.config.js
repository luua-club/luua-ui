// Commit types for consistent messages:
// build:    changes to build system or dependencies (e.g., npm, webpack)
// ci:       CI config changes (e.g., GitHub Actions, Travis)
// docs:     documentation-only changes
// chore:    miscellaneous tasks that don't modify source or test files
// feat:     a new feature ✨
// fix:      a bug fix 🐛
// perf:     performance improvements 🚀
// refactor: code changes that don't fix a bug or add a feature 🔧
// revert:   revert a previous commit ⏪
// style:    formatting, white-space, missing semi-colons (no code change) 🎨
// test:     adding or updating tests ✅

// ✅ Example commit messages:

// 🧩 With type and scope:
/**
 * feat(auth): add JWT-based login system
 */

// 📄 With type only:
/**
 * docs: update README with setup instructions
 */

// 🐞 With type, scope, and body:
/**
 * fix(api): handle 500 error for user creation
 *
 * Improve error handling for edge cases where the user email already exists.
 */

// 🚀 With type, scope, body, and footer:
/**
 * perf(db): optimize query for user lookup
 *
 * Reduced response time by indexing the `email` field.
 *
 * Closes #42
 */

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'docs',
        'chore',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
}
