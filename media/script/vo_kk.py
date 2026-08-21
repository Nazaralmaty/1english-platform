#!/usr/bin/env python3
"""Казахская озвучка ОДНИМ голосом.

Голос выбран Элжаном (это бывший vo_13) и лежит образцом в
media/voice/ref_ustaz.wav вместе с расшифровкой .txt. Модель OmniVoice
умеет клонировать по образцу — поэтому голос больше не «какой выпадет»,
а один и тот же во всех уроках.

  python3 script/vo_kk.py script/kk_u2.txt vo_u2 [--voice ata]

Флаг --voice выбирает образец из media/voice (ustaz по умолчанию).
"""
import argparse, os, sys, time

MODEL = os.path.expanduser("~/ai-local/models/kazakh-omnivoice")
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # media/

def main():
    p = argparse.ArgumentParser()
    p.add_argument("lines")
    p.add_argument("out")
    p.add_argument("--voice", default="ustaz", help="образец из media/voice")
    p.add_argument("--instruct", default="Энергично, тепло, с интересом, как учитель для детей")
    p.add_argument("--temperature", type=float, default=0.7)
    a = p.parse_args()

    ref_wav = os.path.join(HERE, "voice", a.voice + ".wav")
    ref_txt = os.path.join(HERE, "voice", a.voice + ".txt")
    if not os.path.exists(ref_wav):
        sys.exit("нет образца голоса: " + ref_wav)
    ref_text = open(ref_txt, encoding="utf-8").read().strip() if os.path.exists(ref_txt) else None

    with open(a.lines, encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip() and not l.startswith("#")]
    os.makedirs(a.out, exist_ok=True)

    from mlx_audio.tts.utils import load_model
    from mlx_audio.tts.generate import generate_audio

    print("грузим модель ...", flush=True)
    t0 = time.time(); model = load_model(MODEL)
    print("загружено за %.1f с, реплик: %d" % (time.time() - t0, len(lines)), flush=True)

    for i, text in enumerate(lines, 1):
        n = "%02d" % i
        t = time.time()
        generate_audio(text=text, model=model, lang_code="kk",
                       temperature=a.temperature,
                       ref_audio=ref_wav, ref_text=ref_text, instruct=a.instruct,
                       output_path=a.out, file_prefix="v_" + n,
                       audio_format="wav", verbose=False)
        print("  %s  %5.1f с  %s" % (n, time.time() - t, text[:56]), flush=True)
    print("готово", flush=True)

if __name__ == "__main__":
    main()
