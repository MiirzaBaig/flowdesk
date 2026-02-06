'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { CustomerNote } from '@/types/customer';
import { Avatar } from '@/components/ui/Avatar';

interface CustomerNotesProps {
  notes: CustomerNote[];
  customerId: string;
}

export function CustomerNotes({ notes, customerId }: CustomerNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // In a real app, this would call an API to save the note
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Reset form
    setNewNote('');
    setIsSubmitting(false);

    // In production, you'd invalidate the query to refetch notes
    // or optimistically add the note to the list
  };

  return (
    <div className="space-y-6">
      {/* Add note form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this customer..."
          className="input min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newNote.trim() || isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              'Add Note'
            )}
          </button>
        </div>
      </form>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="text-center py-8 text-sm text-slate-500">
          No notes yet. Add one above to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: CustomerNote }) {
  return (
    <div className="bg-white border-2 border-black shadow-brutal p-4">
      <div className="flex items-start gap-3">
        <Avatar name={note.author.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-black truncate">
              {note.author.name}
            </p>
            <p className="text-xs font-bold text-slate-400 flex-shrink-0">
              {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
            </p>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-700 whitespace-pre-wrap">
            {note.content}
          </p>
        </div>
      </div>
    </div>
  );
}
