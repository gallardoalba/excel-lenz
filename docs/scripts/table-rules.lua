-- Pandoc Lua filter: add light horizontal rules between table body rows
-- Pandoc 3.x compatible

function Table(tbl)
  local total_rows = 0
  for _, body in ipairs(tbl.bodies) do
    total_rows = total_rows + #body.body
  end
  if total_rows <= 1 then return nil end

  local num_cols = 0
  if tbl.head and #tbl.head.rows > 0 and tbl.head.rows[1].cells then
    num_cols = #tbl.head.rows[1].cells
  end
  if num_cols == 0 then
    for _, body in ipairs(tbl.bodies) do
      if #body.body > 0 and body.body[1].cells then
        num_cols = #body.body[1].cells
        break
      end
    end
  end
  if num_cols == 0 then return nil end

  for _, body in ipairs(tbl.bodies) do
    local new_rows = {}
    for i, row in ipairs(body.body) do
      table.insert(new_rows, row)
      if i < #body.body then
        local latex = [[\cmidrule(lr){1-]] .. num_cols .. [[}]]
        local sep_cell = pandoc.Cell({pandoc.RawInline('latex', latex)})
        table.insert(new_rows, pandoc.Row({sep_cell}))
      end
    end
    body.body = new_rows
  end
  return tbl
end
