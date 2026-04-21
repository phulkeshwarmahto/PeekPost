export const injectAdsInFeed = (items, ads, frequency = 5) => {
  if (!ads?.length) {
    return items;
  }

  const result = [...items];
  let adIndex = 0;

  for (let i = frequency; i < result.length; i += frequency + 1) {
    result.splice(i, 0, {
      ...ads[adIndex % ads.length].toObject(),
      isAd: true,
      _id: `ad-${adIndex}-${Date.now()}`,
    });
    adIndex += 1;
  }

  return result;
};