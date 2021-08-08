**Тестовое задание на позицию Back-end Developer**
Я заказчик, и я хочу продукт для коллекционеров Вилок ( те что столовые приборы ). **Что продукт должен уметь:**

1. Регистрировать новых пользователей
2. Авторизировать пользователей с помощью JWT и RefreshToken
3. Позволять авторизованным пользователям:
1. Получить все вилки ( необходима пагинация )
2. Получить все вилки из определенной категории ( необходима пагинация )
3. Создать вилку
4. Подписаться на создание новых вилок в категории ( имеется в виду, что если пользователь подписан на создание вилки в категории А, то когда новая вилка будет добавлена в категорию А, то пользователь получит уведомление ). Реализовать данную фичу необходимо с использованием очередей. Уведомления можно реализовать с помощью console.log ( имеется ввиду вывод в консоль сообщения вида &quot;Send notification to Ivan about new fork in category A&quot;

**Ограничения:**

1. Применение всех принципов SOLID
2. Необходим Dockerfile
3. Необходимо обосновать выбор технологий, которые будут использованы в продукте
4. Нельзя использовать Passport.js

**Уточнения:**

1. Вы можете использовать любой фреймворк/библиотеку для роутинга
2. Вы можете использовать как JS так и TS, но TS предпочтительнее
3. Вы можете использовать что угодно для работы с базой данных
4. Вы можете использовать какой угодно подход, как и REST так и GraphQl или WebSockets
5. Вы можете делать с базой данных что угодно, главное чтобы продукт обладал необходимой функциональностью, описанной выше, и чтобы у таблиц были поля указанные ниже

**Обязательные поля сущностей:**

**Пользователь**
1. Логин
2. Пароль
3. Имейл 
   
**Вилка**
  
1. Название
2. Описание
3. год создания
4. юзер, который создал

**Категория Вилок**

1. Название
2. Описание
