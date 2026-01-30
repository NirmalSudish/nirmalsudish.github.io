---
description: Run all performance optimizations for media assets
---

# Media Optimization Workflow

This workflow optimizes all media assets (videos and images) for better web performance.

## Prerequisites

Make sure you have the required dependencies installed:

```bash
npm install sharp fluent-ffmpeg ffmpeg-static
```

## Steps

### 1. Analyze Media (Optional)

Run the analysis script to see what needs optimization:

```bash
// turbo
node scripts/analyze-media.js
```

### 2. Compress Videos

Compress all video files larger than 3MB:

```bash
node scripts/compress-videos.js
```

### 3. Optimize Images

Convert images to WebP and create mobile-optimized versions:

```bash
node scripts/optimize-images.js
```

### 4. Build and Test

Build the production bundle and run Lighthouse:

```bash
// turbo
npm run build
```

```bash
// turbo
npm run preview
```

Then run Lighthouse in Chrome DevTools or use:

```bash
npx lighthouse http://localhost:4173 --view
```

## Expected Results

After optimization:
- Videos should be under 3MB each
- Images should have WebP versions
- Images should have mobile-optimized versions (-mobile.webp)
- Lighthouse Performance score should be 80+
