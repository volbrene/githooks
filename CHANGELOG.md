## [1.6.0](https://github.com/volbrene/githooks/compare/v1.5.1...v1.6.0) (2025-09-16)

### Features

* **hooks:** support unlimited digits in ticket ID extraction ([91a51f8](https://github.com/volbrene/githooks/commit/91a51f865273e80b43cbc3260a9eee82f09c57bb))

## [1.5.1](https://github.com/volbrene/githooks/compare/v1.5.0...v1.5.1) (2025-09-16)

### Bug Fixes

* remove unnecessary comment from release configuration ([e04118c](https://github.com/volbrene/githooks/commit/e04118c4f67cc66755e5bed89ca53640941da407))

## [1.5.0](https://github.com/volbrene/githooks/compare/v1.4.0...v1.5.0) (2025-09-16)

### Features

* add @semantic-release/github plugin to release configuration ([b447f84](https://github.com/volbrene/githooks/commit/b447f84104ddda8f54812cb6c9cb31ddd4e79dba))

### Bug Fixes

* remove redundant NPM_TOKEN environment variable from release workflow ([1585739](https://github.com/volbrene/githooks/commit/1585739c2218b19f8e980efd134991d144a3e8fb))

## [1.4.0](https://github.com/volbrene/githooks/compare/v1.3.0...v1.4.0) (2025-09-16)

### Features

* add release workflow to automate deployment after CI success ([f7bc3dc](https://github.com/volbrene/githooks/commit/f7bc3dc9cced3ef5048d20080e78290c43f59ab2))
* enable semantic-release in the release workflow ([427c5a4](https://github.com/volbrene/githooks/commit/427c5a46141e05a3d15957aa82ec93d74ae3cc0b))
* update release.yml ([ab147d6](https://github.com/volbrene/githooks/commit/ab147d60ef6c000261cbfe22de6a6b20386dec42))

### Bug Fixes

* add .prettierignore to exclude build output and generated files ([909c249](https://github.com/volbrene/githooks/commit/909c249b4262d97266e27dcfc703d4324913fa54))
* add NODE_AUTH_TOKEN to semantic-release environment variables ([7f70a30](https://github.com/volbrene/githooks/commit/7f70a30cd4d7f8b976c76454841169cd2238ddb5))

## [1.3.0](https://github.com/volbrene/githooks/compare/v1.2.1...v1.3.0) (2025-09-16)

### Features

* check if token is available ([1ac0384](https://github.com/volbrene/githooks/commit/1ac038426eef8d98f2e52e13391021b116429510))
* enhance project setup with semantic release and CI/CD ([194bfed](https://github.com/volbrene/githooks/commit/194bfed01a93b69b737dc39ea4887eeea8a63b88))
* implement commit message builder and enhance ticket ID handling in prepare-commit-msg hook ([4e5c5f8](https://github.com/volbrene/githooks/commit/4e5c5f8375cbf7915a0d83326d56c45deb9a4ab0))
* remove GitHub integration from release configuration and add conventional changelog dependency ([8efdfb1](https://github.com/volbrene/githooks/commit/8efdfb159ba43ac7bc61bd56148d67b4ad1ee2fb))
* remove NPM_TOKEN debug check and streamline release step ([8ac17bf](https://github.com/volbrene/githooks/commit/8ac17bfea72c0473054dff0ddce17c41d4d04c8a))
* test npm token ([ca2f07d](https://github.com/volbrene/githooks/commit/ca2f07df4f16afdbb4b73e97a809bd8c20ef3862))
* update release workflow to trigger on CI completion and add NPM_TOKEN validation ([4cd0a2a](https://github.com/volbrene/githooks/commit/4cd0a2abb331ad2300984fa79aef0b753b58a652))
