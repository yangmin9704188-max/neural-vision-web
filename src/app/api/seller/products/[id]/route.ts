import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "@/lib/storage";

/**
 * GET /api/seller/products/:id
 * 상품 상세 조회
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storage = getStorage();
  const product = await storage.read("products", id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

/**
 * DELETE /api/seller/products/:id
 * 상품 삭제
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storage = getStorage();
  const deleted = await storage.delete("products", id);

  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true, id });
}
