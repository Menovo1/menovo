-- Use human-friendly 1-based priorities for portfolio projects and blog posts.
update public.portfolio_projects set sort_order = sort_order + 1 where sort_order >= 0;
update public.blog_posts set sort_order = sort_order + 1 where sort_order >= 0;

create index if not exists portfolio_projects_sort_order_idx
on public.portfolio_projects (sort_order asc, created_at asc);

create index if not exists blog_posts_sort_order_idx_v2
on public.blog_posts (sort_order asc, published_at desc);
