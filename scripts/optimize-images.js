import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Configuration
const MOBILE_MAX_WIDTH = 800; // Max width for mobile images
const WEBP_QUALITY = 85; // WebP quality (85 is excellent quality, much smaller than JPG)
const JPG_QUALITY = 90; // Fallback JPG quality

console.log('🖼️  Starting comprehensive image optimization...');
console.log(`📂 Processing directory: ${IMAGES_DIR}`);

// Get all image files
const imageExtensions = ['.jpg', '.jpeg', '.png'];
const files = fs.readdirSync(IMAGES_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext) && !file.includes('-mobile') && !file.includes('.webp');
});

if (files.length === 0) {
    console.log('❌ No image files found.');
    process.exit(0);
}

console.log(`Found ${files.length} images to optimize\n`);

let processed = 0;
let totalOriginalSize = 0;
let totalOptimizedSize = 0;

// Process images sequentially
const processImage = async (index) => {
    if (index >= files.length) {
        console.log('\n✅ All images processed successfully!');
        console.log(`📊 Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📊 Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`💾 Space saved: ${(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)}%`);
        return;
    }

    const file = files[index];
    const inputPath = path.join(IMAGES_DIR, file);
    const originalSize = fs.statSync(inputPath).size;
    totalOriginalSize += originalSize;

    const ext = path.extname(file);
    const basename = path.basename(file, ext);

    // Output paths
    const webpPath = path.join(IMAGES_DIR, `${basename}.webp`);
    const mobileWebpPath = path.join(IMAGES_DIR, `${basename}-mobile.webp`);
    const mobileJpgPath = path.join(IMAGES_DIR, `${basename}-mobile${ext}`);

    console.log(`⏳ Processing ${file} (${(originalSize / 1024 / 1024).toFixed(2)} MB)...`);

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Skip if already tiny
        if (originalSize < 100 * 1024) { // < 100KB
            console.log(`  ⏭️  Skipped (already small)`);
            processImage(index + 1);
            return;
        }

        // 1. Create WebP version (desktop - full size, optimized)
        await image.clone()
            .webp({ quality: WEBP_QUALITY, effort: 6 })
            .toFile(webpPath);

        const webpSize = fs.statSync(webpPath).size;
        console.log(`  ✅ Desktop WebP: ${(webpSize / 1024).toFixed(0)} KB`);
        totalOptimizedSize += webpSize;

        // 2. Create mobile WebP version (resized + optimized)
        if (metadata.width > MOBILE_MAX_WIDTH) {
            await image.clone()
                .resize(MOBILE_MAX_WIDTH, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: WEBP_QUALITY, effort: 6 })
                .toFile(mobileWebpPath);

            const mobileWebpSize = fs.statSync(mobileWebpPath).size;
            console.log(`  ✅ Mobile WebP: ${(mobileWebpSize / 1024).toFixed(0)} KB (${MOBILE_MAX_WIDTH}px wide)`);
            totalOptimizedSize += mobileWebpSize;

            // 3. Create mobile JPG fallback (for older browsers)
            await image.clone()
                .resize(MOBILE_MAX_WIDTH, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .jpeg({ quality: JPG_QUALITY })
                .toFile(mobileJpgPath);

            const mobileJpgSize = fs.statSync(mobileJpgPath).size;
            console.log(`  ✅ Mobile JPG fallback: ${(mobileJpgSize / 1024).toFixed(0)} KB`);
            totalOptimizedSize += mobileJpgSize;
        } else {
            console.log(`  ℹ️  Image already small enough for mobile (${metadata.width}px)`);
            // Just create a mobile WebP that's the same as desktop
            fs.copyFileSync(webpPath, mobileWebpPath);
            totalOptimizedSize += fs.statSync(mobileWebpPath).size;
        }

        processed++;
        processImage(index + 1);
    } catch (err) {
        console.error(`  ❌ Error processing ${file}:`, err.message);
        processImage(index + 1);
    }
};

// Start processing
processImage(0);
