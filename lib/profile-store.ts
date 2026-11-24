// lib/profile-store.ts
// Bộ nhớ tạm cho hồ sơ người dùng (in-memory). Dữ liệu mất khi server khởi động lại.

export type Profile = {
  userId: string;
  displayName: string;
  bio: string;
  updatedAt: string;
};

const profiles = new Map<string, Profile>();

export function getProfile(userId: string): Profile | undefined {
  return profiles.get(userId);
}

export function saveProfile(userId: string, displayName: string, bio: string): Profile {
  const profile: Profile = {
    userId,
    displayName,
    bio,
    updatedAt: new Date().toISOString(),
  };
  profiles.set(userId, profile);
  return profile;
}
