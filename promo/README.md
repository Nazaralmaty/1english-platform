# promo — презентация платформы

Вертикальный ролик 1080×1920, 32 с, без голоса: музыка и точечные ui-звуки.
В кадре живые экраны платформы, снятые в браузере, а не перерисованные макеты.

| Что | Где |
|---|---|
| Готовый ролик | [`1english_promo_1080x1920.mp4`](1english_promo_1080x1920.mp4) |
| Исходная композиция | `videos/1english-promo/index.html` (HyperFrames) |
| Скриншоты экранов | `shots/` и `videos/1english-promo/assets/screens/` |
| Бриф, раскадровка, дизайн-система | `videos/1english-promo/{BRIEF,STORYBOARD,frame}.md` |

## Пересобрать

```bash
cd videos/1english-promo
npx hyperframes check                       # линт, разметка, контраст
npx hyperframes snapshot --at 16,22,31      # посмотреть кадры без рендера
npx hyperframes render -o renders/1english_promo.mp4 -q high
```

Мастер звука делается после рендера, иначе ролик тише нормы площадок:

```bash
ffmpeg -i renders/1english_promo.mp4 -c:v copy \
  -af loudnorm=I=-14:TP=-1.3:LRA=11 -c:a aac -b:a 256k \
  -movflags +faststart renders/1english_promo_master.mp4
```

## Обновить экраны

Скриншоты снимаются с локального сервера (`python3 -m http.server 8788` в
корне платформы) через puppeteer на вьюпорте 390×844 при DPR 3. Состояние
ученика кладётся в `localStorage` под ключом `1eng.v2` до загрузки страницы,
иначе роутер уводит на экран входа. Смена хеша без перезагрузки не работает:
приложение держит состояние в памяти, поэтому каждый экран открывается
новым `goto` с уникальным query.
