#!/bin/bash
# =============================================================================
# UFC Faceoff Image Enhancement Pipeline
# =============================================================================
# Professional photo enhancement workflow for product/marketing images
# Requires: ImageMagick 7+, cwebp
# Usage: ./enhance-images.sh [input_dir] [output_dir]
# =============================================================================

set -e

# Configuration
INPUT_DIR="${1:-./public/images/faceoffs/originals}"
OUTPUT_DIR="${2:-./public/images/faceoffs/enhanced}"
JPEG_QUALITY=85
WEBP_QUALITY=85
TARGET_SIZE="1024x1024"  # 1:1 aspect ratio for marketplaces

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  UFC Image Enhancement Pipeline${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check dependencies
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    if ! command -v magick &> /dev/null; then
        echo -e "${RED}Error: ImageMagick not found. Install with: brew install imagemagick${NC}"
        exit 1
    fi
    
    if ! command -v cwebp &> /dev/null; then
        echo -e "${RED}Error: cwebp not found. Install with: brew install webp${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All dependencies found${NC}"
    echo ""
}

# Create output directory
setup_directories() {
    mkdir -p "$OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR/comparison"
    echo -e "${GREEN}✓ Output directories created${NC}"
}

# Enhancement function for a single image
enhance_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    echo -e "${YELLOW}Processing: ${filename}${NC}"
    
    # Get original dimensions
    local orig_dims=$(magick identify -format "%wx%h" "$input_file")
    echo "  Original: $orig_dims"
    
    # Step 1: Upscale 2x with Lanczos (high-quality resampling)
    echo "  → Upscaling 2x with Lanczos..."
    magick "$input_file" \
        -filter Lanczos \
        -resize 200% \
        "$OUTPUT_DIR/${name}_step1_upscaled.png"
    
    # Step 2: Noise reduction and artifact removal
    echo "  → Reducing noise and artifacts..."
    magick "$OUTPUT_DIR/${name}_step1_upscaled.png" \
        -despeckle \
        -enhance \
        -enhance \
        "$OUTPUT_DIR/${name}_step2_denoised.png"
    
    # Step 3: Color correction and enhancement
    echo "  → Correcting color and exposure..."
    magick "$OUTPUT_DIR/${name}_step2_denoised.png" \
        -auto-level \
        -auto-gamma \
        -normalize \
        -modulate 100,110,100 \
        "$OUTPUT_DIR/${name}_step3_color.png"
    
    # Step 4: Clarity and contrast (dehaze effect)
    echo "  → Applying clarity and contrast..."
    magick "$OUTPUT_DIR/${name}_step3_color.png" \
        -sigmoidal-contrast 3x50% \
        -unsharp 0x1+0.5+0.05 \
        "$OUTPUT_DIR/${name}_step4_clarity.png"
    
    # Step 5: Crop to 1:1 aspect ratio (center crop)
    echo "  → Cropping to 1:1 aspect ratio..."
    local current_dims=$(magick identify -format "%wx%h" "$OUTPUT_DIR/${name}_step4_clarity.png")
    local width=$(echo $current_dims | cut -d'x' -f1)
    local height=$(echo $current_dims | cut -d'x' -f2)
    local crop_size=$((width < height ? width : height))
    
    magick "$OUTPUT_DIR/${name}_step4_clarity.png" \
        -gravity center \
        -crop ${crop_size}x${crop_size}+0+0 \
        +repage \
        "$OUTPUT_DIR/${name}_step5_cropped.png"
    
    # Step 6: Final resize to target and sharpen for web
    echo "  → Final resize and web sharpening..."
    magick "$OUTPUT_DIR/${name}_step5_cropped.png" \
        -resize "$TARGET_SIZE" \
        -unsharp 0.5x0.5+1.0+0.02 \
        -quality 100 \
        "$OUTPUT_DIR/${name}_step6_final.png"
    
    # Step 7: Export to JPEG (sRGB, quality 85)
    echo "  → Exporting JPEG (sRGB, quality ${JPEG_QUALITY})..."
    magick "$OUTPUT_DIR/${name}_step6_final.png" \
        -colorspace sRGB \
        -strip \
        -interlace Plane \
        -quality "$JPEG_QUALITY" \
        "$OUTPUT_DIR/${name}-enhanced.jpg"
    
    # Step 8: Export to WebP (quality 85)
    echo "  → Exporting WebP (quality ${WEBP_QUALITY})..."
    cwebp -q "$WEBP_QUALITY" -m 6 \
        "$OUTPUT_DIR/${name}_step6_final.png" \
        -o "$OUTPUT_DIR/${name}-enhanced.webp" 2>/dev/null
    
    # Step 9: Create before/after comparison
    echo "  → Creating comparison image..."
    # Resize original to match for comparison
    magick "$input_file" \
        -resize "$TARGET_SIZE^" \
        -gravity center \
        -extent "$TARGET_SIZE" \
        "$OUTPUT_DIR/comparison/${name}_original_resized.jpg"
    
    # Side by side comparison
    magick "$OUTPUT_DIR/comparison/${name}_original_resized.jpg" \
        "$OUTPUT_DIR/${name}-enhanced.jpg" \
        +append \
        -font Helvetica -pointsize 24 \
        -gravity NorthWest -fill white -stroke black -strokewidth 1 \
        -annotate +10+10 "BEFORE" \
        -gravity NorthEast -fill white -stroke black -strokewidth 1 \
        -annotate +10+10 "AFTER" \
        "$OUTPUT_DIR/comparison/${name}_before-after.jpg"
    
    # Cleanup intermediate files
    echo "  → Cleaning up intermediate files..."
    rm -f "$OUTPUT_DIR/${name}_step"*.png
    rm -f "$OUTPUT_DIR/comparison/${name}_original_resized.jpg"
    
    # Get final file sizes
    local jpeg_size=$(ls -lh "$OUTPUT_DIR/${name}-enhanced.jpg" | awk '{print $5}')
    local webp_size=$(ls -lh "$OUTPUT_DIR/${name}-enhanced.webp" | awk '{print $5}')
    local final_dims=$(magick identify -format "%wx%h" "$OUTPUT_DIR/${name}-enhanced.jpg")
    
    echo -e "${GREEN}  ✓ Complete: ${final_dims} | JPEG: ${jpeg_size} | WebP: ${webp_size}${NC}"
    echo ""
}

# Main execution
main() {
    check_dependencies
    setup_directories
    
    echo -e "${BLUE}Input directory: ${INPUT_DIR}${NC}"
    echo -e "${BLUE}Output directory: ${OUTPUT_DIR}${NC}"
    echo ""
    
    # Process all images
    local count=0
    shopt -s nullglob
    for img in "$INPUT_DIR"/*.jpg "$INPUT_DIR"/*.jpeg "$INPUT_DIR"/*.png "$INPUT_DIR"/*.JPG "$INPUT_DIR"/*.JPEG "$INPUT_DIR"/*.PNG; do
        if [ -f "$img" ]; then
            enhance_image "$img"
            ((count++))
        fi
    done
    shopt -u nullglob
    
    if [ $count -eq 0 ]; then
        echo -e "${RED}No images found in ${INPUT_DIR}${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Enhancement Complete!${NC}"
    echo -e "${GREEN}  Processed: ${count} images${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Output files:"
    ls -lh "$OUTPUT_DIR"/*.jpg "$OUTPUT_DIR"/*.webp 2>/dev/null || true
    echo ""
    echo "Comparison images:"
    ls -lh "$OUTPUT_DIR/comparison"/*.jpg 2>/dev/null || true
}

main "$@"

