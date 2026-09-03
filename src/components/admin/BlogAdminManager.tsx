import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle, Clock, FileText, Loader2, Plus, Send, Trash2, X } from "lucide-react";
import { adminDelete, adminList, adminSave } from "@/lib/admin.functions";
import { AdminButton, AdminCard, AdminHeading, inputCls, labelCls } from "@/components/admin/ui";

type BlogPostRow = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  published: boolean;
  published_at: string | null;
  created_at?: string;
};

const emptyPost: BlogPostRow = {
  title: "",
  slug: "",
  category: "Hotels & Tech",
  author: "MENOVO",
  excerpt: "",
  content: "",
  featured_image_url: "",
  published: false,
  published_at: null,
};

export function BlogAdminManager() {
  const listFn = useServerFn(adminList);
  const saveFn = useServerFn(adminSave);
  const deleteFn = useServerFn(adminDelete);

  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [draft, setDraft] = useState<BlogPostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const rows = (await listFn({ data: { table: "blog_posts" } })) as BlogPostRow[];
      setPosts(rows);
    } catch {
      setError("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  }, [listFn]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleTitleChange = (val: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      title: val,
      slug: draft.slug || slugify(val),
    });
  };

  const savePost = async (publishImmediate: boolean) => {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Title is required.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    const now = new Date().toISOString();
    const payload: BlogPostRow = {
      ...draft,
      slug: draft.slug.trim() || slugify(draft.title),
      published: publishImmediate,
      published_at: publishImmediate ? now : draft.published_at,
    };

    try {
      await saveFn({ data: { table: "blog_posts", row: payload } });
      setNotice(publishImmediate ? "Article published live immediately!" : "Article saved as Draft.");
      setDraft(null);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog post.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setBusy(true);
    try {
      await deleteFn({ data: { table: "blog_posts", id } });
      await loadPosts();
    } catch {
      setError("Could not delete post.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHeading title="Blog Posts" subtitle="Write, edit and publish articles live on the MENOVO Blog." />
        {!draft && (
          <AdminButton onClick={() => setDraft({ ...emptyPost })}>
            <Plus className="h-4 w-4" /> New Post
          </AdminButton>
        )}
      </div>

      {notice && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-300 flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}><X className="h-4 w-4" /></button>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-medium text-red-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Editor Modal / Card */}
      {draft && (
        <AdminCard className="border-gold/40 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-display text-xl text-white">
              {draft.id ? "Edit Article" : "New Article"}
            </h3>
            <button onClick={() => setDraft(null)} className="text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Post Title *</label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. 5 Design Principles Every Luxury Hotel Needs Online"
                value={draft.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>URL Slug</label>
              <input
                type="text"
                className={inputCls}
                placeholder="hotel-design-principles"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </div>

            <div>
              <label className={labelCls}>Category</label>
              <input
                type="text"
                className={inputCls}
                placeholder="Hotels & Tech"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </div>

            <div>
              <label className={labelCls}>Author</label>
              <input
                type="text"
                className={inputCls}
                placeholder="MENOVO"
                value={draft.author}
                onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              />
            </div>

            <div>
              <label className={labelCls}>Cover Image URL</label>
              <input
                type="url"
                className={inputCls}
                placeholder="https://..."
                value={draft.featured_image_url}
                onChange={(e) => setDraft({ ...draft, featured_image_url: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Excerpt (Short Summary)</label>
              <textarea
                rows={3}
                className={inputCls}
                placeholder="Brief summary shown on blog preview cards..."
                value={draft.excerpt}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Full Article Body</label>
              <textarea
                rows={10}
                className={inputCls}
                placeholder="Write article body content here..."
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons: Publish Now vs Draft */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
            <AdminButton variant="ghost" onClick={() => setDraft(null)} disabled={busy}>
              Cancel
            </AdminButton>

            <AdminButton variant="ghost" onClick={() => void savePost(false)} disabled={busy} className="bg-white/10 border-white/20">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4 text-white/70" />}
              Draft
            </AdminButton>

            <AdminButton onClick={() => void savePost(true)} disabled={busy} className="bg-gold text-navy font-semibold px-6">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publish Now
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {/* Posts Table */}
      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center p-8 text-gold">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-white/50 text-sm">
            No blog posts published yet. Click "New Post" above to write an article.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {posts.map((post) => (
              <div key={post.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-base text-white truncate">{post.title}</h4>
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/30">
                        <CheckCircle className="h-3 w-3" /> Published Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/30">
                        <Clock className="h-3 w-3" /> Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 truncate mt-1">{post.excerpt || post.content}</p>
                </div>

                <div className="flex items-center gap-2">
                  <AdminButton variant="ghost" onClick={() => setDraft({ ...post })}>
                    Edit
                  </AdminButton>

                  {post.id && (
                    <button
                      onClick={() => void handleDelete(post.id!)}
                      className="p-2 text-white/40 hover:text-red-400 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
