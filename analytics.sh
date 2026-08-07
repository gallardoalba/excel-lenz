#!/usr/bin/env bash
# =============================================================================
# Excel-lenz — Analytics (Nginx + App Database)
# =============================================================================
# Usage: ./analytics.sh [--today|--week|--top|--errors|--referrers|--users|--bots|--full|--live]
# =============================================================================
set -euo pipefail

BOLD='\033[1m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[0;33m'; RED='\033[0;31m'; NC='\033[0m'
# Detect Docker: works from any directory on the server
if docker ps &>/dev/null 2>&1; then
  DOCKER="docker"
else
  echo -e "${RED}Error: Docker not accessible. Check permissions (try: sudo docker ps).${NC}"
  exit 1
fi
# Quick check: are the containers running?
if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q 'excel-lenz'; then
  echo -e "${RED}Error: Excel-lenz containers not running. Start with: docker compose up -d${NC}"
  exit 1
fi
LOG_CMD="docker exec excel-lenz-nginx cat /var/log/nginx/access.log"
DB_CMD="docker exec excel-lenz-api sqlite3 /app/data/excel-lenz.db"
MODE="${1:-}"

banner() { echo -e "${CYAN}${BOLD}\n  ╔══════════════════════════════════════╗\n  ║   Excel-lenz · Analytics Report      ║\n  ╚══════════════════════════════════════╝\n${NC}  ${YELLOW}$(date '+%Y-%m-%d %H:%M')${NC}\n"; }
divider() { echo -e "\n${CYAN}── ${BOLD}$1${NC}${CYAN} ─────────────────────────────────────────────${NC}\n"; }
today_str() { LC_TIME=C date +%d/%b/%Y; }
day_ago()  { LC_TIME=C date -d "$1 days ago" +%d/%b/%Y 2>/dev/null || LC_TIME=C date -v-${1}d +%d/%b/%Y; }
get_log()  { $LOG_CMD 2>/dev/null || echo ""; }
get_db()   { $DB_CMD "$1" 2>/dev/null || echo "?"; }

today() {
  local log; log=$(get_log)
  local ds; ds=$(today_str)
  local tl; tl=$(echo "$log" | grep "$ds")
  local t v e4 e5 bw
  t=$(echo "$tl" | wc -l)
  v=$(echo "$tl" | grep -viE 'bot|crawler|spider|scanner|GPTBot|CCBot|health|uptime' | wc -l)
  e4=$(echo "$tl" | awk '$9 ~ /^4/{print $9}' | wc -l)
  e5=$(echo "$tl" | awk '$9 ~ /^5/{print $9}' | wc -l)
  bw=$(echo "$tl" | awk '{sum+=$10} END {printf "%.1f MB", sum/1048576}')
  echo -e "${BOLD}📊 Hoy — $ds${NC}\n"
  printf "  %-28s %s\n" "Peticiones:" "$t"
  printf "  %-28s %s\n" "Visitantes:" "$v"
  printf "  %-28s %s\n" "Tráfico:"   "$bw"
  printf "  %-28s ${RED}%s${NC}\n" "Errores 4xx:" "$e4"
  printf "  %-28s ${RED}%s${NC}\n" "Errores 5xx:" "$e5"
  echo -e "\n${BOLD}  Por hora:${NC}"
  echo "$tl" | awk '{h=substr($4,2,14); print substr(h,1,length(h)-3)}' | cut -d: -f1 | sort | uniq -c | awk '{printf "    %02d:00  %4d\n", $2, $1}'
  echo -e "\n${BOLD}  Top 10 páginas:${NC}"
  echo "$tl" | grep -viE 'bot|crawler' | awk '{print $7}' | sort | uniq -c | sort -rn | head -10 | awk '{printf "    %4d  %s\n", $1, $2}'
}

week() {
  local log; log=$(get_log); divider "📅 Últimos 7 días"
  printf "  %-12s %8s %8s %8s\n" "Fecha" "Visitas" "IPs" "Err"
  for i in $(seq 6 -1 0); do
    local d; d=$(day_ago $i)
    local dl; dl=$(echo "$log" | grep "$d" | grep -viE 'bot|crawler|health')
    local c ip err
    c=$(echo "$dl" | wc -l)
    ip=$(echo "$dl" | awk '{print $1}' | sort -u | wc -l)
    err=$(echo "$dl" | awk '$9~/^[45]/{print $9}' | wc -l)
    [ "$d" = "$(today_str)" ] && printf "  ${YELLOW}%-12s %8s %8s %8s${NC} ◀\n" "$d" "$c" "$ip" "$err" || printf "  %-12s %8s %8s %8s\n" "$d" "$c" "$ip" "$err"
  done
}

top_pages() {
  local log; log=$(get_log); divider "🏆 Top 20 páginas"
  echo "$log" | grep -viE 'bot|crawler|health' | awk '{print $7}' | sort | uniq -c | sort -rn | head -20 | awk '{printf "  %6d  %s\n",$1,$2}'
}

errors() {
  local log; log=$(get_log); divider "🚨 Errores HTTP"
  echo -e "${BOLD}  Top 404s:${NC}"
  echo "$log" | awk '$9=="404"{print $7}' | sort | uniq -c | sort -rn | head -10 | awk '{printf "    %4d  %s\n",$1,$2}'
  echo -e "\n${BOLD}  Últimos 5xx:${NC}"
  echo "$log" | awk '$9~/^5/' | tail -10 | awk '{printf "    %s %s %s\n", substr($4,2,12), $9, $7}'
}

referrers() {
  local log; log=$(get_log); divider "🔗 Top referrers"
  echo "$log" | awk -F'"' '{print $4}' | grep -v '"-"\|excel-lenz' | sort | uniq -c | sort -rn | head -15 | awk '{printf "  %4d  %s\n",$1,$2}'
}

users() {
  divider "👥 Usuarios"
  printf "  %-30s %s\n" "Registrados:" "$(get_db "SELECT COUNT(*) FROM users;")"
  printf "  %-30s %s\n" "Activos hoy:" "$(get_db "SELECT COUNT(DISTINCT user_id) FROM analytics_events WHERE DATE(created_at)=DATE('now');")"
  printf "  %-30s %s\n" "Activos 7 días:" "$(get_db "SELECT COUNT(DISTINCT user_id) FROM analytics_events WHERE created_at>datetime('now','-7 days');")"
  printf "  %-30s %s%%\n" "Nota media:" "$(get_db "SELECT ROUND(AVG(score),1) FROM (SELECT MAX(CAST(json_extract(metadata,'$.score') AS REAL)) as score FROM analytics_events WHERE event_type='exercise_submit' GROUP BY user_id, resource_id);")"
}

bots() {
  local log; log=$(get_log); divider "🤖 Bots"
  local t; t=$(echo "$log" | wc -l)
  local b; b=$(echo "$log" | grep -ciE 'bot|crawler|spider|GPTBot|CCBot')
  printf "  %-25s %s\n" "Total:" "$t"
  if [ "$t" -gt 0 ]; then
    printf "  %-25s %s (%.1f%%)\n" "Bots:" "$b" "$(python3 -c "print(round($b*100/$t,1))" 2>/dev/null || echo '?')"
  else
    printf "  %-25s %s\n" "Bots:" "$b"
  fi
}

full() { banner; today; week; users; top_pages; referrers; bots; echo -e "\n${GREEN}${BOLD}══════════════════════════════════════════════${NC}\n  Reporte: $(date)\n${GREEN}${BOLD}══════════════════════════════════════════════${NC}\n"; }
live() { docker logs -f excel-lenz-nginx 2>/dev/null; }

case "$MODE" in
  --today|"")   banner; today ;;
  --week)       banner; week ;;
  --top)        banner; top_pages ;;
  --errors)     banner; errors ;;
  --referrers)  banner; referrers ;;
  --users)      banner; users ;;
  --bots)       banner; bots ;;
  --full)       full ;;
  --live)       live ;;
  *) echo "Uso: ./analytics.sh [--today|--week|--top|--errors|--referrers|--users|--bots|--full|--live]" ;;
esac
echo ""
