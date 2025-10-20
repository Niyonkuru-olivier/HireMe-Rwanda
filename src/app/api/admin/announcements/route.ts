import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📌 GET — Fetch all announcements
export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements." },
      { status: 500 }
    );
  }
}

// 📌 POST — Create a new announcement
export async function POST(req: Request) {
  try {
    const { title, content, expiration_date } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    // Validate expiration date if provided
    let expirationDate = null;
    if (expiration_date) {
      expirationDate = new Date(expiration_date);
      if (isNaN(expirationDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiration date format." },
          { status: 400 }
        );
      }
      // Check if expiration date is in the future
      if (expirationDate <= new Date()) {
        return NextResponse.json(
          { error: "Expiration date must be in the future." },
          { status: 400 }
        );
      }
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        expiration_date: expirationDate,
        created_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, announcement: newAnnouncement });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement." },
      { status: 500 }
    );
  }
}
