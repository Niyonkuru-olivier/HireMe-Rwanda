import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// 📌 POST — Clean up expired announcements (admin only)
export async function POST() {
  try {
    // 🔒 Only allow admins
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    
    // Find expired announcements
    const expiredAnnouncements = await prisma.announcement.findMany({
      where: {
        expiration_date: {
          not: null,
          lte: now, // Less than or equal to current time
        },
      },
    });

    if (expiredAnnouncements.length === 0) {
      return NextResponse.json({ 
        message: "No expired announcements found.",
        deletedCount: 0 
      });
    }

    // Delete expired announcements
    const deleteResult = await prisma.announcement.deleteMany({
      where: {
        expiration_date: {
          not: null,
          lte: now,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} expired announcement(s).`,
      deletedCount: deleteResult.count,
      deletedAnnouncements: expiredAnnouncements.map(a => ({
        id: a.id,
        title: a.title,
        expiredAt: a.expiration_date
      }))
    });
  } catch (error) {
    console.error("Error cleaning up expired announcements:", error);
    return NextResponse.json(
      { error: "Failed to clean up expired announcements." },
      { status: 500 }
    );
  }
}

// 📌 GET — Check for expired announcements without deleting them
export async function GET() {
  try {
    // 🔒 Only allow admins
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    
    // Find expired announcements
    const expiredAnnouncements = await prisma.announcement.findMany({
      where: {
        expiration_date: {
          not: null,
          lte: now,
        },
      },
      select: {
        id: true,
        title: true,
        expiration_date: true,
        created_at: true,
      },
    });

    return NextResponse.json({
      expiredCount: expiredAnnouncements.length,
      expiredAnnouncements: expiredAnnouncements.map(a => ({
        id: a.id,
        title: a.title,
        expiredAt: a.expiration_date,
        createdAt: a.created_at
      }))
    });
  } catch (error) {
    console.error("Error checking expired announcements:", error);
    return NextResponse.json(
      { error: "Failed to check expired announcements." },
      { status: 500 }
    );
  }
}

