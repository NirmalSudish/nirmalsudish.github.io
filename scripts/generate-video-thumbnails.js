/**
 * Video Thumbnail Generator Script
 * Generates poster images for all video files
 * 
 * Usage: node scripts/generate-video-thumbnails.js
 * 
 * Note: This requires ffmpeg to be installed. 
 * If ffmpeg is not available, you can manually create thumbnails:
 * 1. Open each video
 * 2. Take a screenshot of the first frame
 * 3. Save as [videoname]_thumb.jpg in the same folder
 * 
 * For example: motion/hardees1.mp4 → motion/hardees1_thumb.jpg
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOTION_DIR = path.join(__dirname, '..', 'public', 'motion');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

function generateThumbnails(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);
    const mp4Files = files.filter(f => f.endsWith('.mp4'));

    console.log(`Found ${mp4Files.length} video files in ${directory}`);

    mp4Files.forEach(file => {
        const videoPath = path.join(directory, file);
        const thumbPath = path.join(directory, file.replace('.mp4', '_thumb.jpg'));

        if (fs.existsSync(thumbPath)) {
            console.log(`✓ Thumbnail exists: ${file.replace('.mp4', '_thumb.jpg')}`);
            return;
        }

        try {
            // Try to generate using ffmpeg (if available)
            execSync(`ffmpeg -i "${videoPath}" -ss 00:00:00.5 -vframes 1 -q:v 2 "${thumbPath}"`, {
                stdio: 'ignore'
            });
            console.log(`✓ Generated: ${file.replace('.mp4', '_thumb.jpg')}`);
        } catch (error) {
            console.log(`✗ Could not generate thumbnail for ${file} (ffmpeg not available)`);
            console.log(`  Please manually create: ${file.replace('.mp4', '_thumb.jpg')}`);
        }
    });
}

console.log('=== Video Thumbnail Generator ===\n');

// Process motion directory
console.log('Processing /public/motion/...');
generateThumbnails(MOTION_DIR);

// Process images directory (for any videos there)
console.log('\nProcessing /public/images/...');
generateThumbnails(IMAGES_DIR);

console.log('\n=== Complete ===');
console.log('\nIf thumbnails were not generated automatically, please create them manually.');
console.log('Each video file needs a corresponding _thumb.jpg file in the same directory.');
