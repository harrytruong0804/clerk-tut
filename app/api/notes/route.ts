// file app/api/notes/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addNote, deleteNote, findNote, listNotes } from "@/lib/notes-store";

const MAX_LENGTH = 500;

// Lấy danh sách ghi chú của người dùng đang đăng nhập
export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ notes: listNotes(userId) });
}

// Tạo ghi chú mới
export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { text?: string };
  const text = body.text ?? "";

  if (!text.trim() || text.length > MAX_LENGTH) {
    return NextResponse.json(
      { error: `Ghi chú phải có từ 1 đến ${MAX_LENGTH} ký tự` },
      { status: 400 },
    );
  }

  const note = addNote(userId, text.trim());
  return NextResponse.json({ note }, { status: 201 });
}

// Xoá ghi chú theo id (?id=...)
export async function DELETE(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !findNote(userId, id)) {
    return NextResponse.json({ error: "Không tìm thấy ghi chú" }, { status: 404 });
  }

  deleteNote(userId, id);
  return new NextResponse(null, { status: 204 });
}
