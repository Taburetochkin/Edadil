export const useOpenLink = (link: string | undefined) => {
  window.open(link, '_blank');
}
