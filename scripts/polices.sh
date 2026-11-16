#!/usr/bin/env bash
# Régénère les polices allégées de src/assets/fonts à partir des paquets @fontsource.
# Prérequis : pip install fonttools brotli
set -euo pipefail
cd "$(dirname "$0")/.."
F=node_modules/@fontsource-variable/newsreader/files
P=node_modules/@fontsource/ibm-plex-mono/files
O=src/assets/fonts
U="U+0020-007E,U+00A0-00FF,U+0152-0153,U+0178,U+02C6,U+02DA,U+02DC,U+2009-200A,U+202F,U+2010-2014,U+2018-201E,U+2022,U+2026,U+2030,U+2039-203A,U+20AC,U+2122,U+2190-2193,U+2212"
for s in normal italic; do
  python3 -m fontTools.varLib.instancer "$F/newsreader-latin-opsz-$s.woff2" wght=400:600 -o "/tmp/nr-$s.ttf" -q
  pyftsubset "/tmp/nr-$s.ttf" --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file="$O/newsreader-opsz-$s.woff2"
done
for w in 400 500; do
  pyftsubset "$P/ibm-plex-mono-latin-$w-normal.woff2" --unicodes="$U" --layout-features='kern,liga,calt' --flavor=woff2 --output-file="$O/plex-mono-$w.woff2"
done
ls -la "$O"
