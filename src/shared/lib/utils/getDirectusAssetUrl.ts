export function getDirectusAssetUrl(directusUrl: URL, id: string): string {
  const assetBase = `${directusUrl.href.replace(/\/$/, "")}/`;
  return new URL(`assets/${id}`, assetBase).href;
}
