#!/usr/bin/env bash
# Сборка видеоурока 2: слайд презентации + свои реплики.
# Реплики темпируются (atempo) — ровный TTS без ускорения звучит вяло.
set -euo pipefail
cd "$(dirname "$0")/.."
TEMPO=1.10
PAUSE=0.28
IN=u2/vo; OUT=u2/seg
rm -rf "$OUT" && mkdir -p "$OUT" u2/mix
# 1. каждая реплика: тишина по краям → темп → нормализация
i=0
for f in "$IN"/v_*.wav; do
  i=$((i+1)); n=$(printf '%02d' $i)
  ffmpeg -y -v error -i "$f" \
    -af "silenceremove=start_periods=1:start_silence=0.03:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_silence=0.03:start_threshold=-45dB,areverse,atempo=${TEMPO},loudnorm=I=-16:TP=-1.5:LRA=11" \
    -ar 48000 -ac 1 "u2/mix/${n}.wav"
done
# 2. слайд ← его реплики (карта: сколько реплик на слайде)
MAP=(1 2 2 1 1 2 2 1 1 1)
: > "$OUT/list.txt"; line=0
for s in "${!MAP[@]}"; do
  slide=$(printf '%02d' $((s+1))); cnt=${MAP[$s]}
  parts=()
  for ((k=0;k<cnt;k++)); do line=$((line+1)); parts+=("u2/mix/$(printf '%02d' $line).wav"); done
  if [ ${#parts[@]} -gt 1 ]; then
    ffmpeg -y -v error -i "${parts[0]}" -i "${parts[1]}" \
      -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1[a]" -map "[a]" "$OUT/a_${slide}.wav"
  else
    cp "${parts[0]}" "$OUT/a_${slide}.wav"
  fi
  ffmpeg -y -v error -loop 1 -i "u2/frames/${slide}.png" -i "$OUT/a_${slide}.wav" \
    -filter_complex "[1:a]apad=pad_dur=${PAUSE}[a]" -map 0:v -map "[a]" \
    -c:v libx264 -preset veryfast -crf 21 -pix_fmt yuv420p -r 25 -vf scale=1920:1080 \
    -c:a aac -b:a 128k -shortest "$OUT/${slide}.mp4"
  echo "file '${slide}.mp4'" >> "$OUT/list.txt"
done
ffmpeg -y -v error -f concat -safe 0 -i "$OUT/list.txt" -c copy u2_sabaq.mp4
ffmpeg -y -v error -i u2/frames/01.png -vf scale=1920:1080 -q:v 3 u2_poster.jpg
# 3. тайминги слайдов — для чекпоинтов урока
python3 - <<'PY'
import subprocess, glob, os
cum=0
for f in sorted(glob.glob('u2/seg/*.mp4')):
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
    cum+=d; print(os.path.basename(f)[:2], round(cum,1))
PY
