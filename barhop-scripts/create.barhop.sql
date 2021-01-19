TRUNCATE barhop_lists, barhop_bars RESTART IDENTITY CASCADE;

CREATE TABLE IF NOT EXISTS barhop_lists (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS barhop_bars (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    listId INTEGER REFERENCES barhop_lists(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL
);