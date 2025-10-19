# App Icon Setup Instructions

## 📱 Icon Added to Website

I've added favicon links to `index.html`. Now you need to save the icon image in different sizes.

## 🎯 Required Steps

### 1. Save the Icon Image
You attached the app icon image. Save it to your computer first.

### 2. Create Icon Sizes
You need to create 3 sizes of the icon:

- **32x32** - Standard favicon
- **180x180** - Apple Touch Icon (iOS/macOS)
- **512x512** - High-resolution icon

### 3. Save Icons to Website

Save the icons with these exact names in the `website/images/` folder:

```
website/images/icon-32.png
website/images/icon-180.png
website/images/icon-512.png
```

## 🛠️ How to Create Different Sizes

### Option 1: Using Preview (macOS)
1. Open the icon image in Preview
2. Go to Tools → Adjust Size
3. Set width to 32 (or 180, or 512)
4. Make sure "Scale proportionally" is checked
5. Save as PNG

### Option 2: Using Online Tool
1. Go to https://www.iloveimg.com/resize-image
2. Upload your icon
3. Resize to 32x32, 180x180, and 512x512
4. Download each size

### Option 3: Using Command Line (ImageMagick)
If you have ImageMagick installed:

```bash
# Install ImageMagick (if needed)
brew install imagemagick

# Resize icon (replace 'icon.png' with your icon filename)
convert icon.png -resize 32x32 website/images/icon-32.png
convert icon.png -resize 180x180 website/images/icon-180.png
convert icon.png -resize 512x512 website/images/icon-512.png
```

## ✅ After Adding Icons

1. Refresh the website in your browser
2. Check the browser tab - you should see the new icon
3. On iOS/macOS, the icon will appear when adding to home screen

## 📝 Current Status

- ✅ HTML updated with favicon links
- ⏳ Need to save icon images in `website/images/`

The icon you provided shows a blue microphone with a bell - perfect for a voice reminder app! 🎤🔔
