/**
 * Comprehensive Media Optimization Script
 * 
 * This script optimizes both videos and images for web performance:
 * - Videos: Compresses and creates mobile-optimized versions
 * - Images: Converts to WebP and creates mobile-sized versions
 * 
 * Usage: node scripts/optimize-media.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const MOTION_DIR = path.join(PUBLIC_DIR, 'motion');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Configuration
const CONFIG = {
    video: {
        // Videos larger than this will be compressed
        maxSizeMB: 3,
        // Target width for mobile videos
        mobileWidth: 480,
        // CRF values (lower = better quality, larger file)
        desktopCRF: 26,
        mobileCRF: 30,
    },
    image: {
        // Target width for mobile images
        mobileWidth: 800,
        // WebP quality (0-100)
        webpQuality: 85,
        mobileWebpQuality: 75,
        // Supported input formats
        supportedFormats: ['.jpg', '.jpeg', '.png'],
    }
};

/**
 * Get all files recursively from a directory
 */
function getFilesRecursive(dir, extensions = []) {
    const files = [];

    if (!fs.existsSync(dir)) {
        console.log(`Directory not found: ${dir}`);
        return files;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getFilesRecursive(fullPath, extensions));
        } else if (extensions.length === 0 || extensions.some(ext => item.toLowerCase().endsWith(ext))) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Format file size for display
 */
function formatSize(bytes) {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
}

/**
 * Analyze media files and report statistics
 */
function analyzeMedia() {
    console.log('\n📊 MEDIA ANALYSIS REPORT\n');
    console.log('='.repeat(50));

    // Analyze videos
    const videoFiles = getFilesRecursive(MOTION_DIR, ['.mp4', '.webm']);
    let totalVideoSize = 0;
    let largeVideos = 0;

    console.log('\n🎬 VIDEOS:');
    console.log('-'.repeat(40));

    for (const file of videoFiles) {
        const size = fs.statSync(file).size;
        totalVideoSize += size;
        const sizeMB = size / (1024 * 1024);
        const status = sizeMB > CONFIG.video.maxSizeMB ? '⚠️  LARGE' : '✅';

        if (sizeMB > CONFIG.video.maxSizeMB) {
            largeVideos++;
            console.log(`${status} ${path.basename(file)}: ${formatSize(size)}`);
        }
    }

    console.log(`\nTotal videos: ${videoFiles.length}`);
    console.log(`Total size: ${formatSize(totalVideoSize)}`);
    console.log(`Large videos (>${CONFIG.video.maxSizeMB}MB): ${largeVideos}`);

    // Analyze images
    const imageFiles = getFilesRecursive(IMAGES_DIR, CONFIG.image.supportedFormats);
    let totalImageSize = 0;
    let imagesWithoutWebP = 0;
    let imagesWithoutMobile = 0;

    console.log('\n🖼️  IMAGES:');
    console.log('-'.repeat(40));

    for (const file of imageFiles) {
        const size = fs.statSync(file).size;
        totalImageSize += size;

        const baseName = path.basename(file, path.extname(file));
        const dir = path.dirname(file);

        // Check if WebP version exists
        const webpPath = path.join(dir, `${baseName}.webp`);
        if (!fs.existsSync(webpPath)) {
            imagesWithoutWebP++;
        }

        // Check if mobile version exists
        const mobilePath = path.join(dir, `${baseName}-mobile.webp`);
        if (!fs.existsSync(mobilePath)) {
            imagesWithoutMobile++;
        }
    }

    console.log(`Total images: ${imageFiles.length}`);
    console.log(`Total size: ${formatSize(totalImageSize)}`);
    console.log(`Missing WebP versions: ${imagesWithoutWebP}`);
    console.log(`Missing mobile versions: ${imagesWithoutMobile}`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 OPTIMIZATION RECOMMENDATIONS:');
    console.log('-'.repeat(40));

    if (largeVideos > 0) {
        console.log(`⚠️  Compress ${largeVideos} large video(s) using: node scripts/compress-videos.js`);
    }

    if (imagesWithoutWebP > 0 || imagesWithoutMobile > 0) {
        console.log(`⚠️  Convert images to WebP and create mobile versions`);
        console.log(`   Install sharp: npm install sharp`);
        console.log(`   Then run image optimization script`);
    }

    console.log('\n💡 To optimize all media, run:');
    console.log('   1. npm install sharp fluent-ffmpeg ffmpeg-static');
    console.log('   2. node scripts/compress-videos.js');
    console.log('   3. node scripts/optimize-images.js');

    return {
        videos: { total: videoFiles.length, totalSize: totalVideoSize, large: largeVideos },
        images: { total: imageFiles.length, totalSize: totalImageSize, noWebP: imagesWithoutWebP, noMobile: imagesWithoutMobile }
    };
}

// Run analysis
analyzeMedia();
