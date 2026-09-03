import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Image as ImageIcon, Loader2, Plus, Save, Table as TableIcon, Trash2, CheckCircle2 } from "lucide-react";
import { adminList, adminSave } from "@/lib/admin.functions";
import { AdminButton, AdminCard, inputCls, labelCls } from "@/components/admin/ui";

export type NoteBlock =
  | { type: "paragraph"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; url: string; alt: string; caption?: string };

export type AdminNote = {
  id?: string;
  title: string;
  category: string;
  blocks: NoteBlock[];
  updated_at?: string;
};

export function AdminNotesEditor() {
  const listFn = useServerFn(adminList);
  const saveFn = useServerFn(adminSave);

  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [activeNote, setActiveNote] = useState<AdminNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const rows = (await listFn({ data: { table: "site_content" } })) as Array<{ key: string; value: unknown }>;
      const notesRow = rows.find((r) => r.key === "admin_content_notes");
      if (notesRow && Array.isArray(notesRow.value)) {
        setNotes(notesRow.value as AdminNote[]);
        if (!activeNote && notesRow.value.length > 0) {
          setActiveNote(notesRow.value[0] as AdminNote);
        }
      } else {
        const defaultNotes: AdminNote[] = [
          {
            id: "1",
            title: "Hotel Feature Comparison & Rates Note",
            category: "General",
            blocks: [
              {
                type: "paragraph",
                text: "Overview of standard amenities, suite packages, and direct booking benefits for client hotels.",
              },
              {
                type: "table",
                headers: ["Package Tier", "Includes", "Target Hotel Type"],
                rows: [
                  ["Boutique Essential", "Mobile site, 5 pages, Direct Enquiry", "Independent B&B"],
                  ["Luxury Grand", "Full CMS, Dining, Suite Showcase, SEO", "5-Star Resorts"],
                ],
              },
              {
                type: "image",
                url: "/hotel-website-visual.jpg",
                alt: "Hotel Suite Showcase",
                caption: "Sample Luxury Suite Digital Showcase Interface",
              },
            ],
          },
        ];
        setNotes(defaultNotes);
        setActiveNote(defaultNotes[0]);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [listFn, activeNote]);

  useEffect(() => {
    void loadNotes();
  }, []);

  const saveAllNotes = async (updatedList: AdminNote[]) => {
    setBusy(true);
    try {
      await saveFn({
        data: {
          table: "site_content",
          row: {
            key: "admin_content_notes",
            value: updatedList,
          },
        },
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch {
      // error handling
    } finally {
      setBusy(false);
    }
  };

  const createNewNote = () => {
    const newNote: AdminNote = {
      id: String(Date.now()),
      title: "Untitled Admin Note",
      category: "Draft",
      blocks: [{ type: "paragraph", text: "Write your note paragraphs here..." }],
    };
    const newList = [newNote, ...notes];
    setNotes(newList);
    setActiveNote(newNote);
    void saveAllNotes(newList);
  };

  const updateActiveNote = (updated: AdminNote) => {
    setActiveNote(updated);
    const newList = notes.map((n) => (n.id === updated.id ? updated : n));
    setNotes(newList);
  };

  const addBlock = (type: NoteBlock["type"]) => {
    if (!activeNote) return;
    let newBlock: NoteBlock;
    if (type === "paragraph") {
      newBlock = { type: "paragraph", text: "" };
    } else if (type === "table") {
      newBlock = {
        type: "table",
        headers: ["Header 1", "Header 2", "Header 3"],
        rows: [
          ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
          ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
        ],
      };
    } else {
      newBlock = {
        type: "image",
        url: "",
        alt: "Image description",
        caption: "Caption text",
      };
    }
    const updated = { ...activeNote, blocks: [...activeNote.blocks, newBlock] };
    updateActiveNote(updated);
  };

  const removeBlock = (index: number) => {
    if (!activeNote) return;
    const updated = {
      ...activeNote,
      blocks: activeNote.blocks.filter((_, i) => i !== index),
    };
    updateActiveNote(updated);
  };

  return (
    <AdminCard className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-display text-xl text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-gold" /> Admin Content Notes Editor
          </h3>
          <p className="text-xs text-white/50">Create and format rich content with Tables, Images, and Paragraphs.</p>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="text-xs text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          <AdminButton onClick={createNewNote} variant="ghost">
            <Plus className="h-4 w-4" /> New Note
          </AdminButton>
          <AdminButton onClick={() => void saveAllNotes(notes)} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Notes
          </AdminButton>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-gold">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Notes Sidebar Selector */}
          <div className="space-y-2 border-r border-white/10 pr-4">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-white/40 mb-3">Saved Notes</div>
            {notes.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveNote(n)}
                className={`w-full text-left p-3 rounded-2xl text-xs transition-all ${
                  activeNote?.id === n.id
                    ? "bg-gold/20 text-gold border border-gold/40 font-semibold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="truncate font-medium">{n.title || "Untitled Note"}</div>
                <div className="text-[10px] text-white/40 mt-1">{n.blocks.length} block(s)</div>
              </button>
            ))}
          </div>

          {/* Active Note Editor & Preview */}
          {activeNote && (
            <div className="space-y-6 min-w-0">
              <div className="space-y-3">
                <label className={labelCls}>Note Title</label>
                <input
                  type="text"
                  className={inputCls}
                  value={activeNote.title}
                  onChange={(e) => updateActiveNote({ ...activeNote, title: e.target.value })}
                />
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2 bg-white/5 p-2.5 rounded-2xl border border-white/10">
                <span className="text-xs text-white/50 px-2 font-medium">Add Element:</span>
                <button
                  onClick={() => addBlock("paragraph")}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-gold hover:text-navy text-xs text-white transition-colors flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" /> + Paragraph
                </button>
                <button
                  onClick={() => addBlock("table")}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-gold hover:text-navy text-xs text-white transition-colors flex items-center gap-1.5"
                >
                  <TableIcon className="h-3.5 w-3.5" /> + Table
                </button>
                <button
                  onClick={() => addBlock("image")}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-gold hover:text-navy text-xs text-white transition-colors flex items-center gap-1.5"
                >
                  <ImageIcon className="h-3.5 w-3.5" /> + Image
                </button>
              </div>

              {/* Block Editors */}
              <div className="space-y-6">
                {activeNote.blocks.map((block, idx) => (
                  <div key={idx} className="relative rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 group">
                    <button
                      onClick={() => removeBlock(idx)}
                      className="absolute top-3 right-3 text-white/30 hover:text-red-400 p-1"
                      title="Remove element"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* PARAGRAPH BLOCK */}
                    {block.type === "paragraph" && (
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-gold font-semibold mb-2 flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" /> Paragraph
                        </div>
                        <textarea
                          rows={3}
                          className={inputCls}
                          value={block.text}
                          onChange={(e) => {
                            const newBlocks = [...activeNote.blocks];
                            newBlocks[idx] = { ...block, text: e.target.value };
                            updateActiveNote({ ...activeNote, blocks: newBlocks });
                          }}
                        />
                      </div>
                    )}

                    {/* TABLE BLOCK */}
                    {block.type === "table" && (
                      <div className="space-y-3">
                        <div className="text-[11px] uppercase tracking-wider text-gold font-semibold flex items-center gap-1">
                          <TableIcon className="h-3.5 w-3.5" /> Table
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-white/10">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-white/10 text-white font-semibold">
                              <tr>
                                {block.headers.map((h, i) => (
                                  <th key={i} className="p-2 border-b border-white/10">
                                    <input
                                      type="text"
                                      className="bg-transparent text-white font-semibold outline-none w-full"
                                      value={h}
                                      onChange={(e) => {
                                        const newHeaders = [...block.headers];
                                        newHeaders[i] = e.target.value;
                                        const newBlocks = [...activeNote.blocks];
                                        newBlocks[idx] = { ...block, headers: newHeaders };
                                        updateActiveNote({ ...activeNote, blocks: newBlocks });
                                      }}
                                    />
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {block.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-white/5">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-2">
                                      <input
                                        type="text"
                                        className="bg-transparent text-white/80 outline-none w-full"
                                        value={cell}
                                        onChange={(e) => {
                                          const newRows = block.rows.map((r, ri) =>
                                            ri === rIdx ? r.map((c, ci) => (ci === cIdx ? e.target.value : c)) : r
                                          );
                                          const newBlocks = [...activeNote.blocks];
                                          newBlocks[idx] = { ...block, rows: newRows };
                                          updateActiveNote({ ...activeNote, blocks: newBlocks });
                                        }}
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* IMAGE BLOCK */}
                    {block.type === "image" && (
                      <div className="space-y-3">
                        <div className="text-[11px] uppercase tracking-wider text-gold font-semibold flex items-center gap-1">
                          <ImageIcon className="h-3.5 w-3.5" /> Image
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="url"
                            placeholder="Image URL (e.g. /hotel-website-visual.jpg)"
                            className={inputCls}
                            value={block.url}
                            onChange={(e) => {
                              const newBlocks = [...activeNote.blocks];
                              newBlocks[idx] = { ...block, url: e.target.value };
                              updateActiveNote({ ...activeNote, blocks: newBlocks });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Alt text"
                            className={inputCls}
                            value={block.alt}
                            onChange={(e) => {
                              const newBlocks = [...activeNote.blocks];
                              newBlocks[idx] = { ...block, alt: e.target.value };
                              updateActiveNote({ ...activeNote, blocks: newBlocks });
                            }}
                          />
                        </div>
                        {block.url && (
                          <img
                            src={block.url}
                            alt={block.alt}
                            className="h-32 object-cover rounded-xl border border-white/10"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Rendered Live Preview */}
              <div className="mt-8 rounded-3xl border border-white/15 bg-black/30 p-6 space-y-5">
                <div className="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold border-b border-white/10 pb-2">
                  Live Formatted Output Render
                </div>
                <h2 className="font-display text-2xl text-white">{activeNote.title}</h2>
                <div className="space-y-4 text-sm leading-relaxed text-white/80">
                  {activeNote.blocks.map((b, i) => {
                    if (b.type === "paragraph") {
                      return <p key={i}>{b.text}</p>;
                    }
                    if (b.type === "table") {
                      return (
                        <div key={i} className="overflow-x-auto my-4 rounded-xl border border-white/20">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-white/10 text-white font-semibold">
                              <tr>
                                {b.headers.map((h, hi) => (
                                  <th key={hi} className="p-3 border-b border-white/20">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {b.rows.map((row, ri) => (
                                <tr key={ri} className="border-b border-white/10">
                                  {row.map((cell, ci) => (
                                    <td key={ci} className="p-3">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    if (b.type === "image") {
                      return (
                        <div key={i} className="my-4">
                          {b.url && (
                            <img src={b.url} alt={b.alt} className="w-full max-h-80 object-cover rounded-2xl border border-white/20" />
                          )}
                          {b.caption && <p className="text-xs text-white/50 mt-1 italic text-center">{b.caption}</p>}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminCard>
  );
}
