import { PointProduct } from "@/app/_types/Point";

// ポイントパッケージの定義
export enum PointPackage {
  PACK_10 = "PACK_10",
  PACK_30 = "PACK_30",
  PACK_100 = "PACK_100",
}

// ポイントパッケージのマスターデータ
export const POINT_PRODUCTS_MASTER: Record<PointPackage, PointProduct> = {
  [PointPackage.PACK_10]: {
    name: "10ptパック",
    price: 550,
    point: 10,
  },
  [PointPackage.PACK_30]: {
    name: "30ptパック",
    price: 1100,
    point: 30,
  },
  [PointPackage.PACK_100]: {
    name: "100ptパック",
    price: 3300,
    point: 100,
  },
} as const;
