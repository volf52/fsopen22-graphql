const authors = [
  {
    name: "Robert Martin",
    born: 1952,
    books: [
      {
        title: "Clean Code",
        published: 2008,
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring"],
      },
      {
        title: "Agile software development",
        published: 2002,
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ["agile", "patterns", "design"],
      },
    ],
  },
  {
    name: "Martin Fowler",
    born: 1963,
    books: [
      {
        title: "Refactoring, edition 2",
        published: 2018,
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring"],
      },
    ],
  },
  {
    name: "Fyodor Dostoevsky",
    born: 1821,
    books: [
      {
        title: "Crime and punishment",
        published: 1866,
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ["classic", "crime"],
      },
      {
        title: "The Demon ",
        published: 1872,
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ["classic", "revolution"],
      },
    ],
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    books: [
      {
        title: "Refactoring to patterns",
        published: 2008,
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring", "patterns"],
      },
    ],
  },
  {
    name: "Sandi Metz", // birthyear not known
    books: [
      {
        title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
        published: 2012,
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring", "design"],
      },
    ],
  },
]

module.exports = { authors }
