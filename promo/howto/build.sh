#!/bin/bash
# Ролик сторис на обоих языках: ./build.sh [ru kk]. Нужна озвучка (assets/vo, kk/assets/vo) и экраны (node caps.cjs <lang>).
set -e
cd "$(dirname "$0")"
for L in ${@:-ru kk}; do
  C=index.html; [ "$L" != ru ] && { C=$L.html; sed "s/var LANG = 'ru';/var LANG = '$L';/" index.html > "$C"; }
  until mkdir ~/ai-local/.gpu.lock 2>/dev/null; do sleep 15; done
  trap 'rmdir ~/ai-local/.gpu.lock 2>/dev/null' EXIT
  caffeinate -is npx --yes hyperframes@0.8.82 render . -c "$C" --fps 30 --quality high --output "work/_video_$L.mp4" --quiet
  rmdir ~/ai-local/.gpu.lock
  python3 mix.py "$L"
done
ffmpeg -nostdin -v error -ss 9.5 -i work/_video_ru.mp4 -frames:v 1 -vf "crop=1080:1080:0:560,scale=240:240" -y ../../assets/stories/poster.jpg
