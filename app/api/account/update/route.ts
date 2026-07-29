import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const {
  name,
  email,
  username,
  currentPassword,
  newPassword,
} = await request.json();

    // Temporary until NextAuth session integration
    const session = await getServerSession(authOptions);

if (!session || !(session.user as { id?: string })?.id) {
  return NextResponse.json(
    { message: "Unauthorized" },
    { status: 401 }
  );
}

const user = await User.findById(
  (session.user as { id: string }).id
);

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const passwordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordCorrect) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const existingUser = await User.findOne({
  username,
  _id: { $ne: user._id },
});

if (existingUser) {
  return NextResponse.json(
    { message: "Username already exists." },
    { status: 400 }
  );
}

    user.name = name;
user.email = email;
user.username = username;

    if (newPassword && newPassword.trim() !== "") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return NextResponse.json({
      message: "Account updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server Error." },
      { status: 500 }
    );
  }
}