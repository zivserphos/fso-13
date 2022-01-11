CREATE TABLE blogs ( id SERIAL PRIMARY KEY, author TEXT, url TEXT NOT NULL, title TEXT NOT NULL, likes INTEGER DEFAULT 0);

insert into blogs (author , url , title) values ('ziv123' , 'i owe ' , 'lollipop');
insert into blogs (author , url , title) values ('nadav' , 'is the best friend ' , 'of rami levy');