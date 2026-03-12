

## Fix Build Errors: Missing Node Types

The previous edit removed `"node"` from the `types` array in `tsconfig.app.json`. Three files reference `NodeJS.Timeout` and `process.env`:

- `src/contexts/RealtimeContext.tsx` — `NodeJS` namespace, `process.env`
- `src/hooks/useSlotHold.ts` — `NodeJS.Timeout`
- `src/hooks/useUndoableCart.ts` — `NodeJS.Timeout`

### Fix

Re-add the `types` field with `"node"` to `tsconfig.app.json`:

```json
"compilerOptions": {
  ...
  "types": ["node"],
  ...
}
```

This is a single-line addition that restores the previous working state and resolves all 7 build errors.

