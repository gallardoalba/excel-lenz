-- Pandoc Lua filter: prevent orphan headings
-- Uses \Needspace before + \nopagebreak after each heading.

local function needspace(level)
  -- Minimal reservation: just enough to avoid a lone heading at page bottom
  -- level 2 (##): 3 lines, level 3 (###): 2 lines, level 4 (####): 2 lines
  local lines = (level == 2 and 3) or 2
  return pandoc.RawBlock('latex', '\\Needspace{' .. lines .. '\\baselineskip}')
end

local nopagebreak = pandoc.RawBlock('latex', '\\nopagebreak[4]')

function Header(el)
  if el.level >= 2 and el.level <= 4 then
    return {
      needspace(el.level),
      el,
      nopagebreak
    }
  end
  return nil
end
