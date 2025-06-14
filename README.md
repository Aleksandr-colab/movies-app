#Movies App

Используя MovieDB API разработайте приложение для поиска фильмов.

[Deploy -](https://movie-jg7cat7gs-aleksandrs-projects-f31d4829.vercel.app/)

###Первая часть - получить список фильмов с сервера и отобразить их в приложении.

Для реализации интерфейса будем пользовать библиотекой готовых компонентов Antd.

Сверстайте макет по мокапам. Достаточно списка фильмов - без поиска.
Зарегистрируйтесь на сервисе, создайте API ключ для вашего приложения (Тип использования выберите "Обучение", поля можно заполнить любыми данными)
Используя API поиска фильмов получите фильмы по поиску по ключему слову "return" и выведите их на страницу
Примечания:

Настройте все инструменты по контролю качества кода, как и в предыдущей проекте (eslint/prettier/husky/lint-staged).
Для форматирования времени пользуйтесь date-fns.
Напишите отдельную функцию для сокращения текста описания, сокращенный текст не должен обрезать слова на середине.
На жанры пока сделайте "заглушки" - отобразим настоящие данные из апи позже
Макеты (Start - базовый, Final - итоговый, мобилку можете сделать в последнюю очередь) https://www.figma.com/file/3Byrf7DtfhBjSBBLDo5WI8/Movies

###Лоадер и обработка ошибок

Добавить индикатор загрузки - возьмите из библиотеки Antd компонент Spin.
Реализуйте обработку ошибок - возьмите компонент Alert
Реализуйте обработку ситуации, когда у пользователя нет сети (вы можете эмулировать это в chrome dev tools).
###Поиск и пагинация

Добавить текстовое поле ввода, по изменению которого будет выполняться поиск
Сделать серверную пагинацию (при переключении страниц должны отправляться новые запросы) с применением компонента Pagination.
####Требования к поиску:

Поиск должен происходить сразу после того, как пользователь ввел поисковый запрос (без нажатия на кнопку)
При вводе символов в поле ввода запросы не должны отправляться сразу в целях избежания лишних запросов на сервер.
Если поиск не дал результатов, должно отображаться сообщение об этом
Пока фильмы загружаются, должен отображаться спиннер загрузки
Результаты поиска должны быть разделены постранично (используйте antd pagination).
Постраничное деление данных (pagination) реализовывается на сервере, вам лишь нужно отобразить интерфейс для его использования. Найдите необходимое API для этого и воспользуйтесь им.
###Рейтинг и жанры

####Добавим функционал добавления в избранное и отображение жанров.

При запуске вашего приложения создаем новую гостевую сессию по апи
Разделяем приложение на 2 таба - Search и Rated,
В табе Rated выводим только список тех фильмов, которы оценивали (см апи) без строки поиска - в остальном макет идетичен.
Добавляем звезды для голосования (компонент Rate). Если вы не голосовали за фильм - все звезды должны быть пустыми, если голосовали - тот рейтинг, что вы проставили фильму.
Добавить блок с текущим рейтингом в правом-верхнем углу блока, сделать изменение цвета круга в зависимости от рейтинга (см ниже).
При старте приложения получать список жанров, хранить данные с помощью React.Context, отображать по соотвествующим ID в списке жанров карточки.
Цвета в зависимости от оценки:

От 0 до 3 - #E90000
От 3 до 5 - #E97E00
От 5 до 7 - #E9D100
Выше 7 - #66E900
