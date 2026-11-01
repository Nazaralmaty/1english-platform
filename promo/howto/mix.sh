#!/bin/zsh
# Звук ролика: голос по START из index.html, нажатия по __TAPS, музыка Curiosity (Mixkit) на 20 дБ под голосом (голос −21.3 LUFS, музыка −41.6).
# Потом мастер для сторис: -16 LUFS, H.264 1080×1920, faststart → media/stories/howto_ru.mp4
set -e
cd "${0:A:h}"
START=(0.5 5.2 9.0 13.0 17.9 22.4 27.0 31.9 36.8)
TAPS=(13.62 18.41 22.88 26.85); OPEN=26.97
IN=(); F=""; n=0
for i in {1..9}; do IN+=(-i assets/vo/vo_0$i.wav); d=$(( ${START[$i]} * 1000 )); F+="[$n:a]aresample=48000,adelay=${d%.*}|${d%.*}[v$n];"; n=$((n+1)); done
for t in $TAPS; do IN+=(-i assets/sfx/apple_tap.mp3); d=$(( t * 1000 )); F+="[$n:a]aresample=48000,volume=0.5,adelay=${d%.*}|${d%.*}[v$n];"; n=$((n+1)); done
IN+=(-i assets/sfx/apple_open.mp3); d=$(( OPEN * 1000 )); F+="[$n:a]aresample=48000,volume=0.45,adelay=${d%.*}|${d%.*}[v$n];"; n=$((n+1))
IN+=(-i assets/sfx/music.mp3); F+="[$n:a]aresample=48000,atrim=0:43,afade=t=in:d=1.5,afade=t=out:st=40.5:d=2.5,volume=0.037[v$n];"; n=$((n+1))
L=""; for k in $(seq 0 $((n-1))); do L+="[v$k]"; done
ffmpeg -nostdin -y -v error $IN -filter_complex "${F}${L}amix=inputs=$n:normalize=0:duration=longest,atrim=0:43,loudnorm=I=-16:TP=-1.5:LRA=11[a]" -map "[a]" -ar 48000 -ac 2 work/_mix.wav
mkdir -p ../../media/stories out
ffmpeg -nostdin -y -v error -i work/_video.mp4 -i work/_mix.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 25 -profile:v high -level 4.0 \
  -pix_fmt yuv420p -r 30 -g 60 -c:a aac -b:a 128k -t 43 -movflags +faststart out/howto_ru.mp4
cp out/howto_ru.mp4 ../../media/stories/howto_ru.mp4
ffmpeg -nostdin -v error -ss 9.5 -i work/_video.mp4 -frames:v 1 -vf "crop=1080:1080:0:560,scale=240:240" -y ../../assets/stories/poster.jpg
ls -la out/howto_ru.mp4
