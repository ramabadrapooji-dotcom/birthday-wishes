This folder is served at the root URL.
Place your music files here:
- song1.mp3 -> will be served as /music/song1.mp3
- song2.mp3 -> will be served as /music/song2.mp3
- song3.mp3 -> will be served as /music/song3.mp3
- song4.mp3 -> will be served as /music/song4.mp3

Vite will copy these files directly to the build folder when running 'npm run build'.
This prevents any TypeScript or Vite build errors if the files are not imported statically.
