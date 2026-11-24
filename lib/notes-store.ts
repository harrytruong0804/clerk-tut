// lib/notes-store.ts
// Bộ nhớ tạm cho ghi chú (in-memory). Dữ liệu mất khi server khởi động lại.

export type Note = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
};

const notes: Note[] = [];

export function listNotes(userId: string): Note[] {
  return notes
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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

export function findNote(userId: string, id: string): Note | undefined {
  return notes.find((n) => n.id === id && n.userId === userId);
}

export function deleteNote(userId: string, id: string): boolean {
  const index = notes.findIndex((n) => n.id === id && n.userId === userId);
  if (index === -1) return false;
  notes.splice(index, 1);
  return true;
}
