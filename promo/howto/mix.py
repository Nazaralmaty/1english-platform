#!/usr/bin/env python3
"""Звук и мастер ролика сторис: python3 mix.py ru|kk
Голос — по тем же START, что в композиции (timing.cjs), нажатия — по __TAPS. Музыка (Curiosity, Mixkit)
слышна в паузах и уходит под голос сайдчейном: в речи ≈ 15 дБ ниже голоса, в паузах ≈ 5 дБ.
Мастер −16 LUFS, H.264 1080×1920, faststart → media/stories/howto_<lang>.mp4."""
import json, os, subprocess, sys
L = sys.argv[1] if len(sys.argv) > 1 else 'ru'
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
comp = 'index.html' if L == 'ru' else f'{L}.html'
vo = 'assets/vo' if L == 'ru' else f'{L}/assets/vo'
T = json.loads(subprocess.check_output(['node', 'timing.cjs', comp]))
END = round(T['end'], 2)
ins, f, n = [], [], 0
for k, st in enumerate(T['start']):
    ins += ['-i', f'{vo}/vo_{k + 1:02d}.wav']; ms = int(st * 1000)
    f.append(f'[{n}:a]aresample=48000,adelay={ms}|{ms}[v{n}]'); n += 1
voices = ''.join(f'[v{i}]' for i in range(n))
f.append(f'{voices}amix=inputs={n}:normalize=0,apad=whole_dur={END},asplit=2[vox][key]')   # apad: иначе сайдчейн обрывает музыку с последним словом
sfx = []
for at, kind in T['taps']:
    ins += ['-i', f'assets/sfx/apple_{kind}.mp3']; ms = int(at * 1000)
    f.append(f'[{n}:a]aresample=48000,volume={0.5 if kind == "tap" else 0.45},adelay={ms}|{ms}[s{n}]'); sfx.append(f'[s{n}]'); n += 1
ins += ['-i', 'assets/sfx/music.mp3']
f.append(f'[{n}:a]aresample=48000,atrim=0:{END},afade=t=in:d=1.2,afade=t=out:st={END - 2.5}:d=2.5,volume=0.30[mus]')
f.append('[mus][key]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=450[musd]')
f.append(f'[vox][musd]{"".join(sfx)}amix=inputs={2 + len(sfx)}:normalize=0,atrim=0:{END},loudnorm=I=-16:TP=-1.5:LRA=11[a]')
os.makedirs('work', exist_ok=True)
subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', *ins, '-filter_complex', ';'.join(f), '-map', '[a]', '-ar', '48000', '-ac', '2', f'work/_mix_{L}.wav'], check=True)
out = f'../../media/stories/howto_{L}.mp4'; os.makedirs(os.path.dirname(out), exist_ok=True)
subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-i', f'work/_video_{L}.mp4', '-i', f'work/_mix_{L}.wav', '-map', '0:v', '-map', '1:a',
                '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p', '-r', '30', '-g', '60',
                '-c:a', 'aac', '-b:a', '128k', '-t', str(END), '-movflags', '+faststart', out], check=True)
print(L, 'end', END, 'taps', T['taps'], '→', out, os.path.getsize(out) // 1024, 'KB')
