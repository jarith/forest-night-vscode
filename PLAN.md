# Plan: Publish Forest Night to VS Code Marketplace and Open VSX

## Context

Forest Night now has a shared runtime entrypoint:

- `main` -> `build/web/extension.js` (desktop host)
- `browser` -> `build/web/extension.js` (web host)

This means `compile:web` is required for both desktop and web packaging, not just web.

The repo still lacks a complete, reliable release flow for both marketplaces.
Current gaps:

1. No Open VSX publish script/workflow.
2. Workflow draft used direct `vsce`/`ovsx` shell commands instead of script-based invocation.
3. Internal planning docs can still end up in packaged artifacts.
4. Packaging behavior may differ by environment (in this workspace, `@vscode/vsce@3.7.1` secret scan throws `concurrency ... got 0`; your machine reports success), so CI verification is required.

## 1) Update release tooling and scripts

**File:** `package.json`

### Changes

1. Keep `@vscode/vsce` version under explicit control and verify in CI.
   - If the `concurrency ... got 0` secret scan issue appears in CI or on another machine, upgrade to latest stable 3.x (or latest available stable) and re-verify.
2. Add `ovsx` as a devDependency.
3. Add explicit release scripts:

```jsonc
{
  "scripts": {
    "vscode:prepublish": "yarn clean && yarn generate:theme && yarn compile:web",
    "package": "npx @vscode/vsce package --no-dependencies -o build/forest-night-vscode.vsix",
    "release:vsce": "npx @vscode/vsce publish --no-dependencies",
    "publish:ovsx": "npx ovsx publish build/forest-night-vscode.vsix"
  }
}
```

### Notes

- `vscode:prepublish` must keep `compile:web` because both `main` and `browser` point to `build/web/extension.js`.
- `release:vsce` avoids ambiguity with package-manager `publish` behavior.
- `package` and `release:vsce` both use `npx` for predictable CLI resolution in local and CI environments.

## 2) Tighten package contents

**File:** `.vscodeignore`

### Changes

1. Keep `!build/web/**` so runtime artifacts (`extension.js` + imported modules) are included.
2. Exclude internal docs from shipping:
   - add `PLAN.md`

### Goal

Keep published VSIX minimal and avoid accidental packaging of internal planning files.

## 3) Add GitHub Actions release workflow

**File:** `.github/workflows/publish.yml`

Create a manually triggered workflow that bumps version, packages once, publishes to both registries, then tags and pushes.

```yaml
name: Publish Extension

on:
  workflow_dispatch:
    inputs:
      version:
        description: Version bump type
        required: true
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        run: yarn install --immutable

      - name: Lint
        run: yarn lint

      - name: Typecheck
        run: yarn ts:compile

      - name: Bump version
        run: |
          npm version "${{ inputs.version }}" --no-git-tag-version
          echo "VERSION=$(node -p "require('./package.json').version")" >> "$GITHUB_ENV"

      - name: Package VSIX
        run: yarn run package

      - name: Publish to VS Code Marketplace
        run: yarn run release:vsce --packagePath build/forest-night-vscode.vsix --skip-duplicate
        env:
          VSCE_PAT: ${{ secrets.VSCE_PAT }}

      - name: Publish to Open VSX
        run: yarn run publish:ovsx
        env:
          OVSX_PAT: ${{ secrets.OVSX_PAT }}

      - name: Commit and tag release
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add package.json
          git commit -m "v${VERSION}"
          git tag "v${VERSION}"
          git push origin HEAD:${{ github.ref_name }} --tags
```

### Design decisions

1. Package once, publish the same VSIX to both marketplaces.
2. Use `yarn run` scripts in CI for stable command resolution.
3. Use `--skip-duplicate` for VS Marketplace to reduce noisy rerun failures.
4. Keep version bump as explicit Git action in workflow.

## 4) One-time marketplace setup

### VS Code Marketplace (Microsoft)

1. Create PAT in Azure DevOps with Marketplace publish/manage scope.
2. Add GitHub Actions secret `VSCE_PAT`.

### Open VSX

1. Ensure Open VSX namespace `jarith` exists and your account can publish to it.
2. Create Open VSX token.
3. Add GitHub Actions secret `OVSX_PAT`.

## 5) Local release/verification flow

1. Install deps and verify:
   - `yarn install --immutable`
   - `yarn lint`
   - `yarn ts:compile`
2. Package:
   - `yarn run package`
3. Validate VSIX quickly:
   - `code --install-extension build/forest-night-vscode.vsix`
4. Optional direct local publish tests:
   - VS Marketplace: `VSCE_PAT=<token> yarn run release:vsce --packagePath build/forest-night-vscode.vsix`
   - Open VSX: `OVSX_PAT=<token> yarn run publish:ovsx`
5. Main release path:
   - trigger GitHub Actions `Publish Extension` with version bump input.

## 6) Acceptance criteria

1. `yarn run package` succeeds and produces `build/forest-night-vscode.vsix`.
2. Workflow publishes same version to both registries from a single run.
3. Workflow creates and pushes commit/tag `vX.Y.Z`.
4. Published extension works in desktop and web hosts (shared `main`/`browser` runtime present in VSIX).
5. Internal planning files are not included in VSIX.
