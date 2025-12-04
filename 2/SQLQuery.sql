-- подразделение сотрудника с id 710253 ("—отрудник 1")
WITH RECURSIVE_SUBDIVISIONS AS (
    SELECT 
        s.id,
        s.name,
        s.parent_id,
        0 as sub_level
    FROM subdivisions s
    WHERE s.id = (SELECT subdivision_id FROM collaborators WHERE id = 710253)
    UNION ALL   
    -- все дочерние подразделени€
    SELECT 
        s.id,
        s.name,
        s.parent_id,
        rs.sub_level + 1
    FROM subdivisions s
    INNER JOIN RECURSIVE_SUBDIVISIONS rs ON s.parent_id = rs.id
    WHERE s.id NOT IN (100055, 100059)
)
-- ѕолучаем количество сотрудников в каждом подразделении
SELECT 
    c.id,
    c.name,
    rs.name as sub_name,
    rs.id as sub_id,
    rs.sub_level,
    (SELECT COUNT(*) FROM collaborators WHERE subdivision_id = c.subdivision_id) as colls_count
FROM collaborators c
INNER JOIN RECURSIVE_SUBDIVISIONS rs ON c.subdivision_id = rs.id
 -- ¬озраст
WHERE c.age < 40
    AND c.id != 710253
ORDER BY rs.sub_level ASC, c.id;