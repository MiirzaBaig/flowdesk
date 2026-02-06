# Migration to pnpm

This project has been migrated from npm to pnpm for better performance and disk space efficiency.

## What Changed

1. **Package Manager**: Now uses `pnpm` instead of `npm`
2. **Lock File**: `pnpm-lock.yaml` replaces `package-lock.json`
3. **Configuration**: Added `.npmrc` for pnpm-specific settings
4. **Package.json**: Added `packageManager` field to enforce pnpm usage

## Migration Steps (Already Completed)

✅ Removed `package-lock.json`  
✅ Added `.npmrc` configuration  
✅ Updated `package.json` with `packageManager` field  
✅ Updated `.gitignore` to ignore npm/yarn lock files  
✅ Updated `README.md` with pnpm commands  

## Next Steps

To complete the migration on your local machine:

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Remove node_modules and old lock file (if they exist)
rm -rf node_modules package-lock.json

# Install dependencies with pnpm
pnpm install
```

## Benefits of pnpm

- **Faster**: Up to 2x faster than npm
- **Disk Efficient**: Uses hard links to save disk space
- **Strict**: Better dependency resolution and peer dependency handling
- **Monorepo Ready**: Built-in support for monorepos

## Commands Reference

All npm commands work the same with pnpm:

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm test             # Run tests
pnpm test:e2e         # Run E2E tests
pnpm add <package>    # Add a dependency
pnpm remove <package> # Remove a dependency
```
