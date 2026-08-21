#!/usr/bin/env bash
# Сборка видеоурока: слайд + своя реплика = сегмент, сегменты подряд.
# Длительность слайда берётся из реального WAV, а не прикидывается.
set -euo pipefail
cd "$(dirname "$0")/.."
PAUSE=0.35
rm -rf seg && mkdir -p seg
: > seg/list.txt
for f in vo/vo_*.wav; do
  n="${f##*vo_}"; n="${n%.wav}"
  img="frames/${n}.png"
  [ -f "$img" ] || { echo "нет кадра $img"; exit 1; }
  ffmpeg -y -v error -loop 1 -i "$img" -i "$f" \
    -filter_complex "[1:a]apad=pad_dur=${PAUSE}[a]" -map 0:v -map "[a]" \
    -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p -r 25 \
    -c:a aac -b:a 128k -shortest "seg/${n}.mp4"
  echo "file '${n}.mp4'" >> seg/list.txt
done
ffmpeg -y -v error -f concat -safe 0 -i seg/list.txt -c copy u1_sabaq.mp4
cp frames/01.png u1_poster.jpg 2>/dev/null || ffmpeg -y -v error -i frames/01.png u1_poster.jpg
ffprobe -v error -show_entries format=duration -of csv=p=0 u1_sabaq.mp4
