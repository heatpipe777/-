#!/bin/bash
# 사용법: nav.sh <출력폴더> <이름> <단계...>
#  단계: "t:글자" = 그 글자(또는 설명)가 있는 요소를 탭, "s" = 아래로 스크롤, "b" = 뒤로, "r" = 앱 재시작, "w" = 2초 대기
cd /c/Users/미미
A=/c/Android/Sdk/platform-tools/adb.exe
OUT="$1"; NAME="$2"; shift 2
mkdir -p "$OUT"
adbs() { MSYS_NO_PATHCONV=1 $A shell "$@"; }
tapText() {
  for try in 1 2 3 4; do tapTextOnce "$1" && return 0; sleep 2; done
  echo "못 찾음: $1"; return 1
}
tapTextOnce() {
  adbs uiautomator dump /sdcard/ui.xml >/dev/null 2>&1
  MSYS_NO_PATHCONV=1 $A exec-out cat /sdcard/ui.xml > "$OUT/ui.xml"
  local b
  b=$(node -e "
    const x=require('fs').readFileSync(process.argv[1],'utf8');const t=process.argv[2];
    const re=/<node [^>]*>/g;let m,best=null;
    while((m=re.exec(x))){const n=m[0];const tx=(n.match(/ text=\"([^\"]*)\"/)||[])[1]||'';const cd=(n.match(/content-desc=\"([^\"]*)\"/)||[])[1]||'';
      if(tx.includes(t)||cd.includes(t)){const b=n.match(/bounds=\"\[(\d+),(\d+)\]\[(\d+),(\d+)\]\"/);if(b){const y=(+b[2]+ +b[4])/2;if(y>60&&y<2250){best=[(+b[1]+ +b[3])/2|0,y|0];break;}}}}
    console.log(best?best.join(' '):'');" "$OUT/ui.xml" "$1")
  if [ -z "$b" ]; then return 1; fi
  adbs input tap $b
}
for step in "$@"; do
  case "$step" in
    r) adbs am force-stop com.goldenarchivew.sosanggongin; adbs monkey -p com.goldenarchivew.sosanggongin 1 >/dev/null 2>&1; sleep 5 ;;
    s) adbs input swipe 540 1700 540 900 300; sleep 1 ;;
    b) adbs input keyevent 4; sleep 2 ;;
    w) sleep 2 ;;
    t:*) tapText "${step#t:}"; sleep 3 ;;
  esac
done
MSYS_NO_PATHCONV=1 $A exec-out screencap -p > "$OUT/$NAME.png"
