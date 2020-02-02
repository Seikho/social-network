export const config = {
  apiUrl: process.env.API_URL || `${window.location.hostname}:3000`,
  assetUrl: process.env.ASSET_URL || `http://${window.location.hostname}:3000/api/post/asset`,
}
