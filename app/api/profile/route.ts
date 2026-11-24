// file app/api/profile/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/lib/profile-store";

const MAX_BIO_LENGTH = 280;
const MAX_DISPLAY_NAME_LENGTH = 50;

// Lấy hồ sơ của người dùng đang đăng nhập
export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ profile: getProfile(userId) ?? null });
}

// Cập nhật hồ sơ của người dùng đang đăng nhập
export async function PUT(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ" }, { status: 400 });
  }

  const { displayName: rawName, bio: rawBio } = (body ?? {}) as Record<string, unknown>;
  if (
    (rawName !== undefined && typeof rawName !== "string") ||
    (rawBio !== undefined && typeof rawBio !== "string")
  ) {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ" }, { status: 400 });
  }

  const displayName = (rawName ?? "").trim();
  const bio = rawBio ?? "";

  if (!displayName) {
    return NextResponse.json({ error: "Tên hiển thị không được để trống" }, { status: 400 });
  }
  if (displayName.length > MAX_DISPLAY_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Tên hiển thị tối đa ${MAX_DISPLAY_NAME_LENGTH} ký tự` },
      { status: 400 },
    );
  }
  if (bio.length > MAX_BIO_LENGTH) {
    return NextResponse.json(
      { error: `Giới thiệu tối đa ${MAX_BIO_LENGTH} ký tự` },
      { status: 400 },
    );
  }

  const profile = saveProfile(userId, displayName, bio);
  return NextResponse.json({ profile });
}
