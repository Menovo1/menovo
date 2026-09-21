-- Normalize existing content to unique 1-based positions.
with ranked as (
  select id, row_number() over (order by sort_order asc, created_at asc, id asc) as new_order
  from public.portfolio_projects
)
update public.portfolio_projects p
set sort_order = ranked.new_order
from ranked
where p.id = ranked.id;

with ranked as (
  select id, row_number() over (order by sort_order asc, published_at desc nulls last, created_at asc, id asc) as new_order
  from public.blog_posts
)
update public.blog_posts p
set sort_order = ranked.new_order
from ranked
where p.id = ranked.id;
