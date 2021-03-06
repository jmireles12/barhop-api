CREATE TABLE IF NOT EXISTS barhop_bars (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    listId INTEGER REFERENCES barhop_lists(id) ON DELETE CASCADE NOT NULL,
    address TEXT NOT NULL,
    price INTEGER NOT NULL,
    rating NUMERIC(2, 1) NOT NULL
);