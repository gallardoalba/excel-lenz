import { useState, useEffect } from 'react';
import { MessageCircle, Trash2, Reply } from 'lucide-react';
import { apiFetch, useAuth } from '../../context/AuthContext';

interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  content: string;
  created_at: string;
  parent_id: string | null;
}

interface CommentsProps {
  exerciseId: string;
}

/** Generate initials and consistent color from user name */
function avatarProps(name: string) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#1B4332','#2C5282','#9B2C2C','#C5A065','#276749','#B7791F'];
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return { initials, bg: colors[hash % colors.length] };
}

export default function Comments({ exerciseId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = () => {
    apiFetch(`/community/exercise/${exerciseId}`)
      .then(data => setComments(data.comments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadComments(); }, [exerciseId]);

  const handleSubmit = async (parentId: string | null = null) => {
    const text = parentId ? replyText : newComment;
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch(`/community/exercise/${exerciseId}`, {
        method: 'POST',
        body: JSON.stringify({ content: text, parent_id: parentId }),
      });
      if (parentId) { setReplyText(''); setReplyTo(null); }
      else setNewComment('');
      loadComments();
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/community/${id}`, { method: 'DELETE' });
      loadComments();
    } catch (e) { console.error(e); }
  };

  // Group: top-level comments + their replies
  const topLevel = comments.filter(c => !c.parent_id);
  const replies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

  const formatDate = (d: string) => {
    const date = new Date(d + 'Z');
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'gerade eben';
    if (diff < 3600) return `vor ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std`;
    return date.toLocaleDateString('de-DE');
  };

  if (!user) {
    // Guests can view comments but not post
    if (loading) return <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kommentare werden geladen...</p>;
    return (
      <div style={{ marginTop: 28 }}>
        <h3 style={{ marginBottom: 16 }}>
          <MessageCircle size={18} style={{marginRight:6, verticalAlign:'middle'}} />Kommentare ({comments.length})
        </h3>
        {topLevel.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Noch keine Kommentare.</p>
        ) : (
          topLevel.map(c => (
            <div key={c.id} style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: avatarProps(c.user_name).bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                  {avatarProps(c.user_name).initials}
                </div>
                <strong style={{ fontSize: '0.85rem' }}>{c.user_name}</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatDate(c.created_at)}</span>
              </div>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>{c.content}</p>
            </div>
          ))
        )}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
          <a href="/login" style={{ color: 'var(--tertiary)' }}>Melde dich an</a>, um einen Kommentar zu schreiben.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 28 }}>
      <h3 style={{ marginBottom: 16 }}>
        <MessageCircle size={18} style={{marginRight:6, verticalAlign:'middle'}} />Kommentare ({comments.length})
      </h3>

      {/* New comment input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Frage oder Tipp zu dieser Übung..."
          rows={2}
          aria-label="Neuer Kommentar"
          style={{
            flex: 1, padding: '10px 14px',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical',
          }}
        />
        <button className="btn btn-primary btn-sm"
          onClick={() => handleSubmit()}
          disabled={submitting || !newComment.trim()}
          style={{ alignSelf: 'flex-end' }}
          aria-label="Kommentar senden">
          {submitting ? '...' : 'Senden'}
        </button>
      </div>

      {/* Comment list */}
      {loading ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Lade Kommentare...</p>
      ) : topLevel.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>
          Noch keine Kommentare. Sei der Erste!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topLevel.map(c => (
            <div key={c.id}>
              <div style={{
                padding: '12px 16px', background: 'var(--primary-lighter)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {(() => { const av = avatarProps(c.user_name); return (
                      <span style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: av.bg, color: '#fff',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.65rem', flexShrink: 0,
                      }}>{av.initials}</span>
                    ); })()}
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.user_name}</span>
                    {c.user_role === 'teacher' && (
                      <span style={{
                        fontSize: '0.68rem', color: 'var(--primary)',
                        border: '1px solid var(--primary)',
                        padding: '0px 6px', borderRadius: 8, fontWeight: 600,
                      }}>LEHRER</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(c.created_at)}</span>
                  </div>
                  {(c.user_id === user?.id || user?.role === 'teacher') && (
                    <button onClick={() => handleDelete(c.id)}
                      style={{
                        background: 'transparent', border: 'none', color: 'var(--text-muted)',
                        cursor: 'pointer', fontSize: '0.75rem',
                      }}
                      aria-label="Kommentar löschen">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {c.content}
                </p>
                <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--primary)',
                    cursor: 'pointer', fontSize: '0.8rem', marginTop: 6, padding: 0,
                  }}>
                  {replyTo === c.id ? 'Abbrechen' : <><Reply size={12} style={{marginRight:3}} />Antworten</>}
                </button>
              </div>

              {/* Reply input */}
              {replyTo === c.id && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8, marginLeft: 32 }}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Antwort schreiben..."
                    rows={2}
                    style={{
                      flex: 1, padding: '8px 12px',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical',
                    }}
                  />
                  <button className="btn btn-primary btn-sm"
                    onClick={() => handleSubmit(c.id)}
                    disabled={submitting || !replyText.trim()}
                    style={{ alignSelf: 'flex-end' }}>
                    Senden
                  </button>
                </div>
              )}

              {/* Replies */}
              {replies(c.id).map(r => (
                <div key={r.id} style={{
                  marginLeft: 32, marginTop: 8, padding: '10px 14px',
                  background: '#f9fafb', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {(() => { const av = avatarProps(r.user_name); return (
                        <span style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: av.bg, color: '#fff',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.6rem', flexShrink: 0,
                        }}>{av.initials}</span>
                      ); })()}
                      <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{r.user_name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatDate(r.created_at)}</span>
                    </div>
                    {(r.user_id === user?.id || user?.role === 'teacher') && (
                      <button onClick={() => handleDelete(r.id)}
                        style={{
                          background: 'transparent', border: 'none', color: 'var(--text-muted)',
                          cursor: 'pointer', fontSize: '0.7rem',
                        }}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {r.content}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
