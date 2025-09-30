// src/app/api/user/update/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim() || null;
    const defaultRSN = formData.get("defaultRSN")?.toString().trim() || null;

    let image: string | null = null;
    const avatarFile = formData.get("avatar");

    if (avatarFile && avatarFile instanceof File) {
      const mimeType = avatarFile.type.toLowerCase();
      if (!["image/png", "image/jpeg"].includes(mimeType)) {
        return NextResponse.json(
          { error: "Only PNG and JPG images are allowed." },
          { status: 400 }
        );
      }

      // Here you'd normally handle resizing/sanitization
      // For now, just save with unique name under /uploads
      const arrayBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = mimeType === "image/png" ? "png" : "jpg";
      const fileName = `avatar_${session.user.id}.${ext}`;
      const fs = await import("fs");
      const path = await import("path");
      const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);
      fs.writeFileSync(uploadPath, buffer);

      image = `/uploads/${fileName}`;
    } else {
      // Default avatar if no upload provided
      image = "/uploads/default.png";
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        defaultRSN,
        image,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        defaultRSN: updatedUser.defaultRSN,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
