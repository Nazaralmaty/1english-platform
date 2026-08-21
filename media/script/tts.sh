#!/bin/bash
# Озвучка ролика локальными моделями. Копируется в проект как script/tts.sh и правится под ролик.
#   tts.sh ru script/script_ru.txt hf/assets/vo [--ref голос.wav] [--tempo 1.30]
set -eu

LANG_CODE="${1:?язык: ru | en | kk}"
LINES="${2:?файл с репликами, одна на строку}"
VO="${3:?куда класть готовые WAV}"
shift 3

TEMPO=1.00          # ускорение речи. Рилс обычно 1.20–1.35, длинное видео 1.00
EXAG=0.5            # ru/en: живость. 0.3 спокойно, 0.5 норма, 0.7 энергично
GENDER=female       # kk: female | male
REF=""              # ru/en: образец голоса 5–10 с для клонирования
while [ $# -gt 0 ]; do
  case "$1" in
    --tempo) TEMPO="$2"; shift 2;;
    --ref)   REF="$2";   shift 2;;
    --exag)  EXAG="$2";  shift 2;;
    --gender) GENDER="$2"; shift 2;;
    *) echo "неизвестный флаг: $1" >&2; exit 1;;
  esac
done

RAW="$VO/raw"
mkdir -p "$RAW"

export HF_HUB_DISABLE_XET=1

if [ "$LANG_CODE" = ru ]; then
  # Русский идёт мимо chatterbox: тот сам угадывает ударение и ошибается.
  # F5-TTS_RUSSIAN + RUAccent, голос задаётся образцом --ref (по умолчанию voices/ru_ref).
  if [ -n "$REF" ]; then export RU_REF="${REF%.wav}"; fi
  TEXTS=()
  while IFS= read -r line; do
    [ -z "${line// /}" ] || TEXTS+=("$line")
  done < <(cat "$LINES"; echo)   # echo — на случай файла без перевода строки в конце
  ~/ai-local/bin/say-ru "$RAW/v" "${TEXTS[@]}"
else
  . ~/ai-local/.venv/bin/activate
  ARGS=(--lang "$LANG_CODE" --lines "$LINES" --out "$RAW" --exaggeration "$EXAG" --gender "$GENDER")
  if [ -n "$REF" ]; then ARGS+=(--ref "$REF"); fi
  caffeinate -is python ~/.claude/skills/local-tts/assets/vo.py "${ARGS[@]}"
fi

# Чистка и нормализация. stop_periods=-1 обязателен: паузы бывают ВНУТРИ реплики,
# срез по краям их не трогает.
total=0
for f in "$RAW"/v_*.wav; do
  # mlx-audio дописывает к имени _000 — вырезаем, оставляем только номер реплики
  n=$(basename "$f" | sed -E 's/^v_([0-9]+).*\.wav$/\1/')
  ffmpeg -y -loglevel error -i "$f" -af \
    "silenceremove=start_periods=1:start_silence=0.04:start_threshold=-40dB:detection=peak:stop_periods=-1:stop_silence=0.06:stop_threshold=-40dB,atempo=$TEMPO,loudnorm=I=-16:TP=-1.5:LRA=11" \
    -ar 48000 -ac 1 "$VO/vo_${n}.wav"
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VO/vo_${n}.wav")
  total=$(echo "$total+$d" | bc)
  printf "vo_%s.wav  %s\n" "$n" "$d"
done
echo "речь суммарно: $total с"
