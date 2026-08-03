-- Promote module and introduction headings from level 2 (##) to level 1 (#)
-- This makes them section-level (larger) instead of subsection-level in the PDF

function Header(el)
  -- Check if heading level is 2 (##)
  if el.level == 2 then
    local text = pandoc.utils.stringify(el)
    -- Promote module headings and introduction headings
    if string.match(text, "^Modul %d+") 
       or string.match(text, "^Módulo %d+")
       or string.match(text, "^Parte [A-F]")
       or text == "Einleitung"
       or text == "Introducción" then
      el.level = 1
    end
  end
  return el
end
