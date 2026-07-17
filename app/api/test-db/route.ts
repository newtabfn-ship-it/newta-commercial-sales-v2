import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  try {
    console.log(process.env.MONGODB_URI);

    const client = new MongoClient(process.env.MONGODB_URI!);

    await client.connect();

    await client.db().command({ ping: 1 });

    await client.close();

    return NextResponse.json({
      success: true,
      message: "MongoDB Driver Connected",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}