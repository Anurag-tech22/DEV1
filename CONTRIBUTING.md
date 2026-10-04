# Contributing to OmniGuard AI

First off, thank you for considering contributing to OmniGuard AI! It's people like you that make OmniGuard AI such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](https://github.com/Anurag-tech22/DEV1/issues) to see if someone else has already created a ticket. If not, go ahead and [make one](../../issues/new)!

## Fork & create a branch

If this is something you think you can fix, then fork OmniGuard AI and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-new-fraud-vector
```

## Local Development Setup

Please refer to the `README.md` for local development setup steps (Python backend, Node.js frontend).

### Running Tests

Make sure all tests pass before submitting a pull request:
```sh
pytest
```
For the frontend:
```sh
cd web
npm run build
```

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, if applicable.
3. You may merge the Pull Request in once you have the sign-off of at least one other developer, or if you do not have permission to do that, you may request the reviewer to merge it for you.

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).
