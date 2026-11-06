insert into public.categories(path,image_url,updated_at)
select p,u,now() from (values
('Освітлення','https://trendelectro.com.ua/cat-osvitlennia.jpg'),
('Все для електромонтажу','https://trendelectro.com.ua/cat-elektromontazh.jpg'),
('Розетки та вимикачі','https://trendelectro.com.ua/cat-rozetky.jpg'),
('Захист електромереж','https://trendelectro.com.ua/cat-zakhyst.jpg'),
('Системи прокладки кабелю','https://trendelectro.com.ua/cat-kabelni-systemy.jpg'),
('Електротовари для дому','https://trendelectro.com.ua/cat-dlia-domu.jpg'),
('Розподільні щити та бокси','https://trendelectro.com.ua/cat-shchyty.jpg'),
('Кабельна продукція','https://trendelectro.com.ua/cat-kabelna.jpg'),
('Вентилятори','https://trendelectro.com.ua/cat-ventyliatory.jpg'),
('Електрична тепла підлога','https://trendelectro.com.ua/cat-tepla-pidloha.jpg')
) t(p,u)
on conflict (path) do update set image_url=excluded.image_url, updated_at=now();
