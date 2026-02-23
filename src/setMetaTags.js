const setMetaTags = () => {
  const baseUrl = import.meta.env.VITE_APP_URL;
  const imageUrl = `${baseUrl}/open-graph.png`;

  const metaUrl = document.createElement('meta');
  metaUrl.setAttribute('property', 'og:url');
  metaUrl.setAttribute('content', baseUrl);

  const metaImage = document.createElement('meta');
  metaImage.setAttribute('property', 'og:image');
  metaImage.setAttribute('content', imageUrl);

  document.head.appendChild(metaUrl);
  document.head.appendChild(metaImage);
};

setMetaTags();