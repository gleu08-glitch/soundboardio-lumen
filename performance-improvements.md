# 10 performance improvements for the Lumen soundboard

1. Replace repeated array scans with a precomputed lookup map.
2. Lazy-create tones instead of instantiating browser audio nodes for every item on load.
3. Use event delegation for all sound triggers so the page does not attach per-button listeners.
4. Avoid full board re-renders when a single item is activated; update the active state in-place.
5. Keep DOM updates minimal by using a single render pass and simple template strings.
6. Cache derived values such as keyboard mappings and labels instead of recalculating them.
7. Make the initial paint lighter by deferring non-critical UI enhancement work.
8. Use reduced motion and compact CSS transitions to avoid expensive repaint cycles.
9. Bundle static UI styles and script logic so the browser loads a single lightweight page shell.
10. Favor lightweight synthesized tones or delayed asset streaming instead of eagerly fetching every media file.

## Highest-impact, lowest-effort fix

The best quick win is item 1: build a direct lookup map (`Map`) for keyboard keys and sound metadata, then reuse it from click and key handlers. This cuts work from repeated linear scans to near-constant lookup time while keeping the change small and easy to validate.
