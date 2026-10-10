export const useStatusCodeCheck = (error: number | undefined) => {
  const toast = useToast();
  if (!error) {
    toast.add({
      title: 'Все получилось!'
    });
  } else {
    switch (error) {
      case 500:
        toast.add({
          title: 'Не удалось выполнить действие!'
        });
        break
      case 401:
        toast.add({
          title: 'Вы не авторизованы!'
        });
        break
      case 400:
        toast.add({
          title: 'Плохой запрос'
        });
        break
      default:
        toast.add({
          title: 'Произошла ошибка'
        });
    }
  }
}