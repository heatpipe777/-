#!/bin/bash
# 빌드·설치·실행을 한 번에 (에뮬레이터 Pixel_Test만 사용, 다른 기기·에뮬레이터는 건드리지 않아요)
#
# 사용법 (프로젝트 폴더에서):
#   bash scripts/dev/run.sh                         빌드 → 설치 → 앱 실행
#   bash scripts/dev/run.sh --shot 05_calc,12_news  … + 화면 캡처 (shots.mjs 이름, 결과: $SHOT_DIR)
#   bash scripts/dev/run.sh --audit 계산기,MY        … + 바뀐 화면만 배치 점검 (일반 폰 크기)
#   bash scripts/dev/run.sh --full-audit            … + 전체 점검 3크기 (출시 전 마지막에 한 번)
#   --no-build  빌드 없이 설치된 앱으로만
#   --stop      끝나면 Pixel_Test 끄기
# (set -e 쓰지 않아요: 기기 찾기 등에서 "없음"이 정상 결과일 수 있어요)
PROJ="/c/Users/미미/Desktop/github_desk/소상공인지원금"
ADB=/c/Android/Sdk/platform-tools/adb.exe
PKG=com.goldenarchivew.sosanggongin
SHOT_DIR="${SHOT_DIR:-$TEMP/badagage_shots}"
BUILD=1; SHOT=""; AUDIT=""; FULL=0; STOP=0
while [ $# -gt 0 ]; do
  case "$1" in
    --no-build) BUILD=0 ;;
    --shot) SHOT="$2"; shift ;;
    --audit) AUDIT="$2"; shift ;;
    --full-audit) FULL=1 ;;
    --stop) STOP=1 ;;
  esac
  shift
done

find_emu() {
  for d in $($ADB devices | grep -o "^emulator-[0-9]*"); do
    [ "$($ADB -s $d emu avd name 2>/dev/null | head -1 | tr -d '\r')" = "Pixel_Test" ] && { echo $d; return; }
  done
  return 0
}

# 1) 빌드 (에뮬레이터 켜는 동안 같이)
SERIAL=$(find_emu)
if [ -z "$SERIAL" ]; then
  echo "▶ Pixel_Test 켜는 중"
  (cd /c/Users/미미 && ANDROID_AVD_HOME="C:/Android/avd" nohup /c/Android/Sdk/emulator/emulator.exe -avd Pixel_Test -no-snapshot -no-boot-anim >/dev/null 2>&1 &)
fi
if [ $BUILD = 1 ]; then
  echo "▶ 빌드"
  (cd "$PROJ" && npm run android:sync 2>&1 | grep -iE "error|built in" ) || true
  (cd "$PROJ/android" && ./gradlew.bat assembleDebug -q 2>&1 | grep -iE "error|failed" ) && { echo "빌드 실패"; exit 1; } || true
fi
for i in $(seq 1 60); do SERIAL=$(find_emu); [ -n "$SERIAL" ] && break; sleep 5; done
[ -z "$SERIAL" ] && { echo "Pixel_Test를 찾지 못했어요"; exit 1; }
for i in $(seq 1 60); do [ "$($ADB -s $SERIAL shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && break; sleep 4; done
export ANDROID_SERIAL=$SERIAL
s() { MSYS_NO_PATHCONV=1 $ADB shell "$@"; }

# 2) 설치·실행
if [ $BUILD = 1 ]; then $ADB install -r "$PROJ/android/app/build/outputs/apk/debug/app-debug.apk" | tail -1; fi
connect() {
  s am force-stop $PKG; s monkey -p $PKG 1 >/dev/null 2>&1; sleep 12
  local S=$(s cat /proc/net/unix | grep -o "webview_devtools_remote_[0-9]*" | tail -1)
  $ADB forward --remove-all; $ADB forward tcp:9333 localabstract:$S >/dev/null
}
connect
echo "▶ 실행 완료 ($SERIAL)"

# 3) 캡처
if [ -n "$SHOT" ]; then mkdir -p "$SHOT_DIR"; (cd "$PROJ" && node scripts/dev/shots.mjs "$SHOT_DIR" "$SHOT"); echo "캡처 폴더: $SHOT_DIR"; fi

# 4) 점검
anr() { MSYS_NO_PATHCONV=1 $ADB logcat -d -b events | grep -c "am_anr.*sosang" || true; }
if [ -n "$AUDIT" ]; then
  B=$(anr); (cd "$PROJ" && AUDIT_ONLY="$AUDIT" node scripts/layout-audit.mjs 2>&1 | grep -v "^✅"); echo "응답 없음(ANR): $(( $(anr) - B ))"
fi
if [ $FULL = 1 ]; then
  B=$(anr); OK=0
  for cfg in "일반폰 reset reset" "작은폰 720x1280 320" "태블릿 1600x2560 320"; do
    set -- $cfg; s wm size $2; s wm density $3; sleep 8; connect
    out=$(cd "$PROJ" && node scripts/layout-audit.mjs 2>&1)
    echo "== $1: 통과 $(echo "$out" | grep -c '^✅') / $(echo "$out" | tail -1)"; echo "$out" | grep "^❌\|^   -" | head -10
    echo "$out" | grep -q "문제 없음" && OK=$((OK+1))
  done
  s wm size reset; s wm density reset
  A=$(( $(anr) - B )); echo "전체 점검: $OK/3 크기 통과, 응답 없음 $A"
  [ $OK = 3 ] && [ $A = 0 ] && echo "PASS" > "$TEMP/badagage_full_audit.txt" || echo "FAIL" > "$TEMP/badagage_full_audit.txt"
fi

[ $STOP = 1 ] && $ADB -s $SERIAL emu kill >/dev/null && echo "▶ Pixel_Test 종료"
exit 0
