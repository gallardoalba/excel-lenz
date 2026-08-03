-- Pandoc Lua filter: add light horizontal rules between table body rows
-- Improves readability of data tables in PDF output

function Table(tbl)
  -- Only process if we have more than one body row
  local total_rows = 0
  for _, body in ipairs(tbl.bodies) do
    total_rows = total_rows + #body.body
  end
  if total_rows <= 1 then
    return nil
  end
  
  -- Add \cmidrule between rows in each table body
  for _, body in ipairs(tbl.bodies) do
    local new_rows = {}
    local num_cols = tbl.caption and #tbl.caption or (#tbl.headers > 0 and #tbl.headers or (#body.body[1] and #body.body[1] or 1))
    
    for i, row in ipairs(body.body) do
      table.insert(new_rows, row)
      -- Add a separator row after each row except the last
      if i < #body.body then
        local sep_cells = {}
        -- Build column range for \cmidrule, e.g., \cmidrule(lr){1-3}
        local rule = "\\cmidrule(lr){1-" .. num_cols .. "}"
        table.insert(sep_cells, pandoc.RawInline('latex', rule))
        local sep_row = pandoc.Row(sep_cells)
        table.insert(new_rows, sep_row)
      end
    end
    body.body = new_rows
  end
  
  return tbl
end
