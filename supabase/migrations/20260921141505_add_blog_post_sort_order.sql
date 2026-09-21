alter table public.blog_posts
add column if not exists sort_order integer not null default 0;

create index if not exists blog_posts_sort_order_idx
on public.blog_posts (sort_order asc, published_at desc);
