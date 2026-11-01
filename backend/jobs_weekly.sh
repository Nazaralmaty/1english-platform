#!/bin/zsh
# Раз в неделю (launchd на Air, kz.1english.jobs.plist): свежие вакансии → app/jobs.js → push.
# Ставится один раз: cp backend/kz.1english.jobs.plist ~/Library/LaunchAgents/ &&
#   launchctl load ~/Library/LaunchAgents/kz.1english.jobs.plist
cd "${0:A:h}/.." || exit 1
python3 backend/jobs.py || exit 0            # меньше 40 — файл прошлой недели остаётся
git diff --quiet -- app/jobs.js && exit 0
git add app/jobs.js && git commit -q -m "Вакансии: обновление недели" && git push -q origin HEAD:main
