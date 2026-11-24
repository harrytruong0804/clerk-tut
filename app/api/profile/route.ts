// file app/api/profile/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/lib/profile-store";

const MAX_BIO_LENGTH = 280;

type ProfileInput = {
  userId: string;
  displayName?: string;
  bio?: string;
};

// Lấy hồ sơ của người dùng đang đăng nhập
export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ profile: getProfile(userId) ?? null });
}

// Cập nhật hồ sơ
export async function PUT(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as ProfileInput;
  const displayName = (body.displayName ?? "").trim();
  const bio = body.bio ?? "";

  if (!displayName) {
    return NextResponse.json({ error: "Tên hiển thị không được để trống" }, { status: 400 });
  }
  if (bio.length >= MAX_BIO_LENGTH) {
    return NextResponse.json(
      { error: `Giới thiệu tối đa ${MAX_BIO_LENGTH} ký tự` },
      { status: 400 },
    );
  }

  const profile = saveProfile(body.userId, displayName, bio);
  return NextResponse.json({ profile });
}
