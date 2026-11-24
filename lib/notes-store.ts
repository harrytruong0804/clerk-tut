// lib/notes-store.ts
// Bộ nhớ tạm cho ghi chú (in-memory). Dữ liệu mất khi server khởi động lại.

export type Note = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
};

const notes: Note[] = [];

export function listNotes(): Note[] {
  return [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addNote(userId: string, text: string): Note {
  const note: Note = {
    id: crypto.randomUUID(),
    userId,
    text,
    createdAt: new Date().toISOString(),
  };
  notes.push(note);
  return note;
}

export function findNote(id: string): Note | undefined {
  return notes.find((n) => n.id === id);
}

export function deleteNote(id: string): boolean {
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return false;
  notes.splice(index, 1);
  return true;
}
