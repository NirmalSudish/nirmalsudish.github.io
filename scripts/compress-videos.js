import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..'); // Assuming scripts/ is one level deep
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const MOTION_DIR = path.join(PUBLIC_DIR, 'motion');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

console.log('🎬 Starting video compression...');
console.log(`📂 Scanning directory: ${MOTION_DIR}`);

// Get all MP4 files
const files = fs.readdirSync(MOTION_DIR).filter(file => file.toLowerCase().endsWith('.mp4'));

if (files.length === 0) {
    console.log('❌ No MP4 files found.');
    process.exit(0);
}

// Process videos sequentially
const processVideo = async (index) => {
    if (index >= files.length) {
        console.log('\n✅ All videos processed successfully!');
        return;
    }

    const file = files[index];
    const inputPath = path.join(MOTION_DIR, file);
    const tempPath = path.join(MOTION_DIR, `temp_${file}`);

    const originalSize = fs.statSync(inputPath).size / (1024 * 1024);

    // Skip if already small (< 3MB)
    if (originalSize < 3) {
        console.log(`⏭️  Skipping ${file} (${originalSize.toFixed(2)} MB) - already small enough`);
        processVideo(index + 1);
        return;
    }

    console.log(`\n⏳ Processing ${file} (${originalSize.toFixed(2)} MB)...`);

    ffmpeg(inputPath)
        .outputOptions([
            '-c:v libx264',     // H.264 codec (widely supported)
            '-crf 26',          // Constant Rate Factor (23=default, 28=high compression. 26 is good balance)
            '-preset slow',     // Better compression efficiency
            '-c:a aac',         // Audio codec
            '-b:a 128k',        // Audio bitrate
            '-movflags +faststart' // Optimize for web streaming
        ])
        .output(tempPath)
        .on('end', () => {
            const newSize = fs.statSync(tempPath).size / (1024 * 1024);
            const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

            console.log(`✅ Compressed: ${newSize.toFixed(2)} MB (Reduced by ${reduction}%)`);

            // Replace original file
            fs.unlinkSync(inputPath);
            fs.renameSync(tempPath, inputPath);

            processVideo(index + 1);
        })
        .on('error', (err) => {
            console.error(`❌ Error processing ${file}:`, err.message);
            // Clean up temp file if exists
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            processVideo(index + 1);
        })
        .run();
};

// Start processing
processVideo(0);
