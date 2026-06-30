# Bundle Size Comparison

Production build (`ng build --configuration production`), measured on 2026-06-30.

| Branch | Initial JS | Initial CSS | Notes |
|--------|-----------|-------------|-------|
| `03-accordion-aria` | 261.46 kB | 0.74 kB | @angular/aria accordion only |
| `07-material-comparison` | 409.84 kB | 104.47 kB | + @angular/material/expansion |

**Delta:** +148.38 kB JS, +103.73 kB CSS

## How to re-measure
`ng build --configuration production 2>&1 | grep -E "Initial|\.js|\.css"`

Re-run before the talk if any dependency versions change.
