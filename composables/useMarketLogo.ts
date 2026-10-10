export const useMarketLogo = (market: string | undefined) => {
  switch(market) {
    case 'citilink':
      return 'https://www.fryazino.info/image/logo/citilink.png';
    case 'wildberries':
      return 'https://free-png.ru/wp-content/uploads/2021/11/free-png.ru-419.png';
    case 'regard':
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-MLqcyrEFBEZQ1_Y9lwTmh3yb4pFWvw60g&s';
    case 'online-trade':
      return 'https://img.utdstc.com/icon/64d/2cc/64d2cc04d0d509139a8ee0d386996108f70d4f49bbbe6dc4b361f7c461b73c96:200';
    case 'yandex-market':
      return 'https://avatars.mds.yandex.net/get-marketcms/475644/img-0ec60a9f-2803-4ab0-8408-ed0dd2cbec79.png/optimize';
    default: 
      return 'https://medvirturials.com/img/old_logo.png';
  }
}
