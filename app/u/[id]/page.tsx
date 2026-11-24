// file app/u/[id]/page.tsx
// Trang hồ sơ công khai, ai cũng xem được

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profile-store";
import { renderBio } from "@/lib/render-bio";

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  const profile = getProfile(params.id);
  if (!profile) {
    notFound();
  }

  return <div className="w-full min-h-screen flex flex-col gap-4 items-center justify-center">
    <h1 className="font-bold text-xl">{profile.displayName}</h1>
    <div
      className="max-w-md text-center"
      dangerouslySetInnerHTML={{ __html: renderBio(profile.bio) }}
    />
    <div className="text-sm opacity-50">
      Cập nhật lúc {new Date(profile.updatedAt).toLocaleString("vi-VN")}
    </div>
    <Link href={'/'}>Quay lại</Link>
  </div>;
}
