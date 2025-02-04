import { NextRequest, NextResponse } from "next/server";
import { dbConnect, ScanProfileModel } from "extension-a11y-checker-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;

  await dbConnect();

  const scanProfile = await ScanProfileModel.findById(profileId);
  if (!scanProfile || scanProfile.project._id.toString() !== projectId) {
    return NextResponse.json(
      { message: "Scan profile not found" },
      { status: 404 },
    );
  }
  return NextResponse.json(scanProfile.toJSON());
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  await dbConnect();

  const scanProfile = await ScanProfileModel.findById(profileId);
  if (!scanProfile || scanProfile.project._id.toString() !== projectId) {
    return NextResponse.json(
      { message: "Scan profile not found" },
      { status: 404 },
    );
  }

  const input = await request.json();
  const updatedScanProfile = await ScanProfileModel.findByIdAndUpdate(
    profileId,
    { $set: { ...input, updatedAt: new Date(), projectId } },
    { new: true },
  );
  return NextResponse.json(updatedScanProfile!.toJSON());
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  await dbConnect();

  const deletedScanProfile = await ScanProfileModel.findOneAndDelete({
    projectId,
    _id: profileId,
  });
  if (!deletedScanProfile) {
    return NextResponse.json(
      { message: "Scan profile not found" },
      { status: 404 },
    );
  }
  return NextResponse.json(deletedScanProfile.toJSON());
}
